/**
 * Copyright (c) 2015 - present LibDriver All rights reserved
 * 
 * The MIT License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE. 
 *
 * @file      driver_apm2000.c
 * @brief     driver apm2000 source file
 * @version   1.0.0
 * @author    Shifeng Li
 * @date      2025-07-15
 *
 * <h3>history</h3>
 * <table>
 * <tr><th>Date        <th>Version  <th>Author      <th>Description
 * <tr><td>2025/07/15  <td>1.0      <td>Shifeng Li  <td>first upload
 * </table>
 */

#include "driver_apm2000.h"

/**
 * @brief chip information definition
 */
#define CHIP_NAME                 "ASAIR APM2000"        /**< chip name */
#define MANUFACTURER_NAME         "ASAIR"                /**< manufacturer name */
#define SUPPLY_VOLTAGE_MIN        4.75f                  /**< chip min supply voltage */
#define SUPPLY_VOLTAGE_MAX        5.25f                  /**< chip max supply voltage */
#define MAX_CURRENT               100.0f                 /**< chip max current */
#define TEMPERATURE_MIN           -10.0f                 /**< chip min operating temperature */
#define TEMPERATURE_MAX           50.0f                  /**< chip max operating temperature */
#define DRIVER_VERSION            1000                   /**< driver version */

/**
 * @brief chip address definition
 */
#define APM2000_ADDRESS             (0x08 << 1)              /**< chip iic address */

/**
 * @brief chip reg definition
 */
#define APM2000_REG_START        0x0010U        /**< start measurement */
#define APM2000_REG_STOP         0x0104U        /**< stop measurement */
#define APM2000_REG_READ         0x0300U        /**< read measurement */

/**
 * @brief     generate the crc
 * @param[in] *handle pointer to an apm2000 handle structure
 * @param[in] *data pointer to a data buffer
 * @param[in] count data length
 * @return    crc
 * @note      none
 */
static uint8_t a_apm2000_generate_crc(apm2000_handle_t *handle, uint8_t* data, uint8_t count)
{
    if (handle->iic_uart == APM2000_INTERFACE_IIC)
    {
        uint8_t current_byte;
        uint8_t crc = 0xFF;
        uint8_t crc_bit;

        for (current_byte = 0; current_byte < count; current_byte++)        /* calculate crc */
        {
            crc ^= (data[current_byte]);                                    /* xor data */
            for (crc_bit = 8; crc_bit > 0; --crc_bit)                       /* 8 bit */
            {
                if ((crc & 0x80) != 0)                                      /* if 7th bit is 1 */
                {
                    crc = (crc << 1) ^ 0x31;                                /* xor */
                }
                else
                {
                    crc = crc << 1;                                         /* left shift 1 */
                }
            }
        }
        
        return crc;                                                         /* return crc */
    }
    else
    {
        uint8_t i;
        uint32_t sum = 0x00;
        
        for (i = 0; i < count; i++)                                         /* sum */
        {
            sum += data[i];                                                 /* sum */
        }
        
        return (uint8_t)((sum & 0xFF));                                     /* return sum */
    }
}

/**
 * @brief      read bytes
 * @param[in]  *handle pointer to an apm2000 handle structure
 * @param[in]  reg iic register address
 * @param[out] *data pointer to a data buffer
 * @param[in]  len data length
 * @return     status code
 *             - 0 success
 *             - 1 read failed
 * @note       none
 */
static uint8_t a_apm2000_iic_read(apm2000_handle_t *handle, uint16_t reg, uint8_t *data, uint16_t len)
{
    if (handle->iic_read_address16(APM2000_ADDRESS, reg, (uint8_t *)data, len) != 0)        /* read data */
    {
        return 1;                                                                           /* return error */
    }
    
    return 0;                                                                               /* success return 0 */
}

/**
 * @brief     write bytes
 * @param[in] *handle pointer to an apm2000 handle structure
 * @param[in] reg iic register address
 * @param[in] *data pointer to a data buffer
 * @param[in] len data length
 * @return    status code
 *            - 0 success
 *            - 1 write failed
 * @note      none
 */
static uint8_t a_apm2000_iic_write(apm2000_handle_t *handle, uint16_t reg, uint8_t *data, uint16_t len)
{
    if (handle->iic_write_address16(APM2000_ADDRESS, reg, (uint8_t *)data, len) != 0)        /* write data */
    {
        return 1;                                                                            /* return error */
    }
    
    return 0;                                                                                /* success return 0 */
}

/**
 * @brief      write read bytes
 * @param[in]  *handle pointer to an apm2000 handle structure
 * @param[in]  *input pointer to an input buffer
 * @param[in]  in_len input length
 * @param[in]  delay_ms delay time in ms
 * @param[out] *output pointer to an output buffer
 * @param[in]  out_len output length
 * @return     status code
 *             - 0 success
 *             - 1 write read failed
 * @note       none
 */
static uint8_t a_apm2000_uart_write_read(apm2000_handle_t *handle, uint8_t *input, uint16_t in_len,
                                         uint16_t delay_ms, uint8_t *output, uint16_t out_len)
{
    uint16_t len;
    
    if (handle->uart_flush() != 0)                     /* uart flush */
    {
        return 1;                                      /* return error */
    }
    if (handle->uart_write(input, in_len) != 0)        /* write data */
    {
        return 1;                                      /* return error */
    }
    handle->delay_ms(delay_ms);                        /* delay ms */
    len = handle->uart_read(output, out_len);          /* read data */
    if (len != out_len)                                /* check output length */
    {
        return 1;                                      /* return error */
    }
    
    return 0;                                          /* success return 0 */
}

/**
 * @brief     uart make frame
 * @param[in] *handle pointer to an apm2000 handle structure
 * @param[in] cmd input command
 * @param[in] *data pointer to a data buffer
 * @param[in] len data length
 * @return    frame length
 * @note      none
 */
static uint16_t a_apm2000_uart_make_frame(apm2000_handle_t *handle, uint8_t cmd, uint8_t *data, uint8_t len)
{
    memset(handle->buf, 0, 255 + 5);                                                        /* init buffer */
    handle->buf[0] = 0xFE;                                                                  /* set 0xFE */
    handle->buf[1] = 0xA5;                                                                  /* set 0xA5 */
    handle->buf[2] = len;                                                                   /* set length */
    handle->buf[3] = cmd;                                                                   /* set command */
    if (len != 0)                                                                           /* check length */
    {
        memcpy(&handle->buf[4], data, len);                                                 /* copy data */
    }
    handle->buf[4 + len] = a_apm2000_generate_crc(handle, &handle->buf[1], len + 3);        /* generate crc */
    
    return (uint16_t)(len + 5);                                                             /* return crc */
}

/**
 * @brief      uart parse frame
 * @param[in]  *handle pointer to an apm2000 handle structure
 * @param[in]  len buffer length
 * @param[out] *cmd pointer to a command buffer
 * @param[in]  *data pointer to a data buffer
 * @param[in]  *out_len pointer to an output length buffer
 * @return     status code
 *             - 0 success
 *             - 1 parse failed
 * @note       none
 */
static uint8_t a_apm2000_uart_parse_frame(apm2000_handle_t *handle, uint8_t len, uint8_t *cmd, uint8_t *data, uint8_t *out_len)
{
    uint8_t crc;
    
    if (len < 6)                                                             /* check length */
    {
        return 1;                                                            /* return error */
    }
    if (handle->buf[0] != 0xFE)                                              /* check header */
    {
        handle->debug_print("apm2000: header is invalid.\n");                /* header is invalid */
       
        return 1;                                                            /* return error */
    }
    if (handle->buf[1] != 0xA5)                                              /* check frame code */
    {
        handle->debug_print("apm2000: no frame code.\n");                    /* no frame code */
       
        return 1;                                                            /* return error */
    }
    if (handle->buf[2] != 0x02)                                              /* check length */
    {
        handle->debug_print("apm2000: length is invalid.\n");                /* length is invalid */
       
        return 1;                                                            /* return error */
    }
    crc = a_apm2000_generate_crc(handle, &handle->buf[1], len - 2);          /* generate crc */
    if (crc != handle->buf[len - 1])                                         /* check crc */
    {
        handle->debug_print("apm2000: crc is invalid.\n");                   /* crc is invalid */
       
        return 1;                                                            /* return error */
    }
    *cmd = handle->buf[3];                                                   /* set command */
    if ((len - 5) != (*out_len))                                             /* check length */
    {
        handle->debug_print("apm2000: output length is invalid.\n");         /* output length is invalid */
       
        return 1;                                                            /* return error */
    }
    memcpy(data, &handle->buf[4], (*out_len));                               /* copy data */
    
    return 0;                                                                /* success return 0 */
}

/**
 * @brief     set the chip interface
 * @param[in] *handle pointer to an apm2000 handle structure
 * @param[in] interface chip interface
 * @return    status code
 *            - 0 success
 *            - 2 handle is NULL
 * @note      none
 */
uint8_t apm2000_set_interface(apm2000_handle_t *handle, apm2000_interface_t interface) 
{
    if (handle == NULL)                           /* check handle */
    {
        return 2;                                 /* return error */
    }
    
    handle->iic_uart = (uint8_t)interface;        /* set interface */
    
    return 0;                                     /* success return 0 */
}

/**
 * @brief      get the chip interface
 * @param[in]  *handle pointer to an apm2000 handle structure
 * @param[out] *interface pointer to a chip interface buffer
 * @return     status code
 *             - 0 success
 *             - 2 handle is NULL
 * @note       none
 */
uint8_t apm2000_get_interface(apm2000_handle_t *handle, apm2000_interface_t *interface) 
{
    if (handle == NULL)                                        /* check handle */
    {
        return 2;                                              /* return error */
    }
    
    *interface = (apm2000_interface_t)(handle->iic_uart);      /* get interface */
    
    return 0;                                                  /* success return 0 */
}

/**
 * @brief     start the measurement
 * @param[in] *handle pointer to an apm2000 handle structure
 * @return    status code
 *            - 0 success
 *            - 1 start measurement failed
 *            - 2 handle is NULL
 *            - 3 handle is not initialized
 *            - 4 uart can't use this function
 * @note      uart can't use this function
 */
uint8_t apm2000_start_measurement(apm2000_handle_t *handle)
{
    if (handle == NULL)                                                                 /* check handle */
    {
        return 2;                                                                       /* return error */
    }
    if (handle->inited != 1)                                                            /* check handle initialization */
    {
        return 3;                                                                       /* return error */
    }

    if (handle->iic_uart != 0)                                                          /* uart */
    {
        handle->debug_print("apm2000: uart can't use this function.\n");                /* uart can't use this function */
       
        return 4;                                                                       /* return error */
    }
    else                                                                                /* iic */
    {
        uint8_t res;
        uint8_t buf[3];
        
        buf[0] = 0x05;                                                                  /* set param0 */
        buf[1] = 0x00;                                                                  /* set param1 */
        buf[2] = 0xF6;                                                                  /* set param2 */
        res = a_apm2000_iic_write(handle, APM2000_REG_START, (uint8_t *)buf, 3);        /* start measurement command */
        if (res != 0)                                                                   /* check result */
        {
            handle->debug_print("apm2000: start measurement failed.\n");                /* start measurement failed */
           
            return 1;                                                                   /* return error */
        }
    }
    
    return 0;                                                                           /* success return 0 */
}

/**
 * @brief     stop the measurement
 * @param[in] *handle pointer to an apm2000 handle structure
 * @return    status code
 *            - 0 success
 *            - 1 stop measurement failed
 *            - 2 handle is NULL
 *            - 3 handle is not initialized
 *            - 4 uart can't use this function
 * @note      uart can't use this function
 */
uint8_t apm2000_stop_measurement(apm2000_handle_t *handle)
{
    if (handle == NULL)                                                         /* check handle */
    {
        return 2;                                                               /* return error */
    }
    if (handle->inited != 1)                                                    /* check handle initialization */
    {
        return 3;                                                               /* return error */
    }

    if (handle->iic_uart != 0)                                                  /* uart */
    {
        handle->debug_print("apm2000: uart can't use this function.\n");        /* uart can't use this function */
       
        return 4;                                                               /* return error */
    }
    else                                                                        /* iic */
    {
        uint8_t res;
        
        res = a_apm2000_iic_write(handle, APM2000_REG_STOP, NULL, 0);           /* stop measurement command */
        if (res != 0)                                                           /* check result */
        {
            handle->debug_print("apm2000: stop measurement failed.\n");         /* stop measurement failed */
           
            return 1;                                                           /* return error */
        }
    }
        
    return 0;                                                                   /* success return 0 */
}

/**
 * @brief      read the result
 * @param[in]  *handle pointer to an apm2000 handle structure
 * @param[out] *pm pointer to an apm2000 pm structure
 * @return     status code
 *             - 0 success
 *             - 1 read failed
 *             - 2 handle is NULL
 *             - 3 handle is not initialized
 *             - 4 crc check failed
 * @note       none
 */
uint8_t apm2000_read(apm2000_handle_t *handle, apm2000_pm_t *pm)
{
    uint8_t res;
    
    if ((handle == NULL) || (pm == NULL))                                              /* check handle */
    {
        return 2;                                                                      /* return error */
    }
    if (handle->inited != 1)                                                           /* check handle initialization */
    {
        return 3;                                                                      /* return error */
    }
    
    if (handle->iic_uart != 0)                                                         /* uart */
    {
        uint8_t cmd;
        uint8_t out_len;
        uint8_t data[6];
        uint16_t len;
        
        len = a_apm2000_uart_make_frame(handle, 0x01, NULL, 0);                        /* make frame */
        res = a_apm2000_uart_write_read(handle, handle->buf, len, 
                                        200, handle->buf, 11);
        if (res != 0)                                                                  /* check result */
        {
            handle->debug_print("apm2000: uart write read failed.\n");                 /* uart write read failed */
           
            return 1;                                                                  /* return error */
        }
        out_len = 6;                                                                   /* set output length */
        res = a_apm2000_uart_parse_frame(handle, 11, &cmd, data, &out_len);            /* parse frame */
        if (res != 0)                                                                  /* check result */
        {
            return 1;                                                                  /* return error */
        }
        if (cmd != 0x00)                                                               /* check command */
        {
            handle->debug_print("apm2000: command is invalid.\n");                     /* command is invalid. */
           
            return 1;                                                                  /* return error */
        }
        pm->pm1p0_ug_m3 = ((uint16_t)data[0]) << 8 | data[1];                          /* set data */
        pm->pm2p5_ug_m3 = ((uint16_t)data[2]) << 8 | data[3];                          /* set data */
        pm->pm10_ug_m3 = ((uint16_t)data[4]) << 8 | data[5];                           /* set data */
    }
    else                                                                               /* iic */
    {
        uint8_t buf[30];
        
        res = a_apm2000_iic_read(handle, APM2000_REG_READ, (uint8_t *)buf, 30);        /* read data */
        if (res != 0)                                                                  /* check result */
        {
            handle->debug_print("apm2000: read data failed.\n");                       /* read data failed */
           
            return 1;                                                                  /* return error */
        }
        if (buf[2] != a_apm2000_generate_crc(handle, (uint8_t *)buf + 0, 2))           /* check crc */
        {
            handle->debug_print("apm2000: crc check failed.\n");                       /* crc check failed */
           
            return 4;                                                                  /* return error */
        }
        if (buf[5] != a_apm2000_generate_crc(handle, (uint8_t *)buf + 3, 2))           /* check crc */
        {
            handle->debug_print("apm2000: crc check failed.\n");                       /* crc check failed */
           
            return 4;                                                                  /* return error */
        }
        if (buf[11] != a_apm2000_generate_crc(handle, (uint8_t *)buf + 9, 2))          /* check crc */
        {
            handle->debug_print("apm2000: crc check failed.\n");                       /* crc check failed */
           
            return 4;                                                                  /* return error */
        }
        pm->pm1p0_ug_m3 = ((uint16_t)buf[0]) << 8 | buf[1];                            /* set data */
        pm->pm2p5_ug_m3 = ((uint16_t)buf[3]) << 8 | buf[4];                            /* set data */
        pm->pm10_ug_m3 = ((uint16_t)buf[9]) << 8 | buf[10];                            /* set data */
    }
    
    return 0;                                                                          /* success return 0 */
}

/**
 * @brief      read pm2.5
 * @param[in]  *handle pointer to an apm2000 handle structure
 * @param[out] *pm2p5_ug_m3 pointer to a data buffer
 * @return     status code
 *             - 0 success
 *             - 1 read failed
 *             - 2 handle is NULL
 *             - 3 handle is not initialized
 *             - 4 iic can't use this function
 * @note       iic can't use this function
 */
uint8_t apm2000_read_pm2p5(apm2000_handle_t *handle, uint16_t *pm2p5_ug_m3)
{
    uint8_t res;
    
    if (handle == NULL)                                                                /* check handle */
    {
        return 2;                                                                      /* return error */
    }
    if (handle->inited != 1)                                                           /* check handle initialization */
    {
        return 3;                                                                      /* return error */
    }
    
    if (handle->iic_uart != 0)                                                         /* uart */
    {
        uint8_t cmd;
        uint8_t out_len;
        uint8_t data[6];
        uint16_t len;
        
        len = a_apm2000_uart_make_frame(handle, 0x00, NULL, 0);                        /* make frame */
        res = a_apm2000_uart_write_read(handle, handle->buf, len, 
                                        200, handle->buf, 7);
        if (res != 0)                                                                  /* check result */
        {
            handle->debug_print("apm2000: uart write read failed.\n");                 /* uart write read failed */
           
            return 1;                                                                  /* return error */
        }
        out_len = 2;                                                                   /* set output length */
        res = a_apm2000_uart_parse_frame(handle, 7, &cmd, data, &out_len);             /* parse frame */
        if (res != 0)                                                                  /* check result */
        {
            return 1;                                                                  /* return error */
        }
        if (cmd != 0x00)                                                               /* check command */
        {
            handle->debug_print("apm2000: command is invalid.\n");                     /* command is invalid. */
           
            return 1;                                                                  /* return error */
        }
        *pm2p5_ug_m3 = ((uint16_t)data[0]) << 8 | data[1];                             /* set data */
    }
    else                                                                               /* iic */
    {
        handle->debug_print("apm2000: iic can't use this function.\n");                /* iic can't use this function */
       
        return 4;                                                                      /* return error */
    }
    
    return 0;                                                                          /* success return 0 */
}

/**
 * @brief     initialize the chip
 * @param[in] *handle pointer to an apm2000 handle structure
 * @return    status code
 *            - 0 success
 *            - 1 iic or uart initialization failed
 *            - 2 handle is NULL
 *            - 3 linked functions is NULL
 * @note      none
 */
uint8_t apm2000_init(apm2000_handle_t *handle)
{
    if (handle == NULL)                                                        /* check handle */
    {
        return 2;                                                              /* return error */
    }
    if (handle->debug_print == NULL)                                           /* check debug_print */
    {
        return 3;                                                              /* return error */
    }
    if (handle->iic_init == NULL)                                              /* check iic_init */
    {
        handle->debug_print("apm2000: iic_init is null.\n");                   /* iic_init is null */
    
        return 3;                                                              /* return error */
    }
    if (handle->iic_deinit == NULL)                                            /* check iic_deinit */
    {
        handle->debug_print("apm2000: iic_deinit is null.\n");                 /* iic_deinit is null */
    
        return 3;                                                              /* return error */
    }
    if (handle->iic_write_address16 == NULL)                                   /* check iic_write_address16 */
    {
        handle->debug_print("apm2000: iic_write_address16 is null.\n");        /* iic_write_address16 is null */
    
        return 3;                                                              /* return error */
    }
    if (handle->iic_read_address16 == NULL)                                    /* check iic_read_address16 */
    {
        handle->debug_print("apm2000: iic_read_address16 is null.\n");         /* iic_read_address16 is null */
    
        return 3;                                                              /* return error */
    }
    if (handle->uart_init == NULL)                                             /* check uart_init */
    {
        handle->debug_print("apm2000: uart_init is null.\n");                  /* uart_init is null */
    
        return 3;                                                              /* return error */
    }
    if (handle->uart_deinit == NULL)                                           /* check uart_deinit */
    {
        handle->debug_print("apm2000: uart_deinit is null.\n");                /* uart_deinit is null */
    
        return 3;                                                              /* return error */
    }
    if (handle->uart_read == NULL)                                             /* check uart_read */
    {
        handle->debug_print("apm2000: uart_read is null.\n");                  /* uart_read is null */
    
        return 3;                                                              /* return error */
    }
    if (handle->uart_write == NULL)                                            /* check uart_write */
    {
        handle->debug_print("apm2000: uart_write is null.\n");                 /* uart_write is null */
    
        return 3;                                                              /* return error */
    }
    if (handle->uart_flush == NULL)                                            /* check uart_flush */
    {
        handle->debug_print("apm2000: uart_flush is null.\n");                 /* uart_flush is null */
    
        return 3;                                                              /* return error */
    }
    if (handle->delay_ms == NULL)                                              /* check delay_ms */
    {
        handle->debug_print("apm2000: delay_ms is null.\n");                   /* delay_ms is null */
    
        return 3;                                                              /* return error */
    }
    
    if (handle->iic_uart != 0)                                                 /* uart */
    {
        if (handle->uart_init() != 0)                                          /* uart init */
        {
            handle->debug_print("apm2000: uart init failed.\n");               /* uart init failed */
        
            return 1;                                                          /* return error */
        }
    }
    else                                                                       /* iic */
    {
        if (handle->iic_init() != 0)                                           /* iic init */
        {
            handle->debug_print("apm2000: iic init failed.\n");                /* iic init failed */
            
            return 1;                                                          /* return error */
        }
    }
    handle->inited = 1;                                                        /* flag finish initialization */
  
    return 0;                                                                  /* success return 0 */
}

/**
 * @brief     close the chip
 * @param[in] *handle pointer to an apm2000 handle structure
 * @return    status code
 *            - 0 success
 *            - 1 iic or uart deinit failed
 *            - 2 handle is NULL
 *            - 3 handle is not initialized
 * @note      none
 */
uint8_t apm2000_deinit(apm2000_handle_t *handle)
{
    uint8_t res;
    
    if (handle == NULL)                                                   /* check handle */
    {
        return 2;                                                         /* return error */
    }
    if (handle->inited != 1)                                              /* check handle initialization */
    {
        return 3;                                                         /* return error */
    }    
    
    if (handle->iic_uart != 0)                                            /* uart */
    {
        if (handle->uart_deinit() != 0)                                   /* uart deinit */
        {
            handle->debug_print("apm2000: uart deinit failed.\n");        /* uart deinit failed */
        
            return 1;                                                     /* return error */
        }
    }
    else                                                                  /* iic */
    {
        res = handle->iic_deinit();                                       /* iic deinit */
        if (res != 0)                                                     /* check result */
        {
            handle->debug_print("apm2000: iic deinit failed.\n");         /* iic deinit */
           
            return 1;                                                     /* return error */
        }
    }
    handle->inited = 0;                                                   /* flag close initialization */
  
    return 0;                                                             /* success return 0 */
}

/**
 * @brief      set and get the chip register with uart interface
 * @param[in]  *handle pointer to an apm2000 handle structure
 * @param[in]  *input pointer to an input buffer
 * @param[in]  in_len input length
 * @param[out] *output pointer to an output buffer
 * @param[in]  out_len output length
 * @return     status code
 *             - 0 success
 *             - 1 write read failed
 * @note       none
 */
uint8_t apm2000_set_get_reg_uart(apm2000_handle_t *handle, uint8_t *input, uint16_t in_len, uint8_t *output, uint16_t out_len)
{
    if (handle == NULL)                                                                   /* check handle */
    {
        return 2;                                                                         /* return error */
    }
    if (handle->inited != 1)                                                              /* check handle initialization */
    {
        return 3;                                                                         /* return error */
    }

    if (handle->iic_uart != 0)
    {
        return a_apm2000_uart_write_read(handle, input, in_len, 200, output, out_len);    /* write and read with the uart interface */
    }
    else
    {
        handle->debug_print("apm2000: iic interface is invalid.\n");                      /* iic interface is invalid */
       
        return 1;                                                                         /* return error */
    }
}

/**
 * @brief     set the chip register with iic interface
 * @param[in] *handle pointer to an apm2000 handle structure
 * @param[in] reg iic register address
 * @param[in] *buf pointer to a data buffer
 * @param[in] len data buffer length
 * @return    status code
 *            - 0 success
 *            - 1 write failed
 *            - 2 handle is NULL
 *            - 3 handle is not initialized
 * @note      none
 */
uint8_t apm2000_set_reg_iic(apm2000_handle_t *handle, uint16_t reg, uint8_t *buf, uint16_t len)
{
    if (handle == NULL)                                                      /* check handle */
    {
        return 2;                                                            /* return error */
    }
    if (handle->inited != 1)                                                 /* check handle initialization */
    {
        return 3;                                                            /* return error */
    }

    if (handle->iic_uart != 0)
    {
        handle->debug_print("apm2000: uart interface is invalid.\n");        /* uart interface is invalid */
       
        return 1;                                                            /* return error */
    }
    else
    {
        return a_apm2000_iic_write(handle, reg, buf, len);                   /* write the data */
    }
}

/**
 * @brief      get the chip register with iic interface
 * @param[in]  *handle pointer to an apm2000 handle structure
 * @param[in]  reg iic register address
 * @param[out] *buf pointer to a data buffer
 * @param[in]  len data buffer length
 * @return     status code
 *             - 0 success
 *             - 1 read failed
 *             - 2 handle is NULL
 *             - 3 handle is not initialized
 * @note       none
 */
uint8_t apm2000_get_reg_iic(apm2000_handle_t *handle, uint16_t reg, uint8_t *buf, uint16_t len)
{
    if (handle == NULL)                                                      /* check handle */
    {
        return 2;                                                            /* return error */
    }
    if (handle->inited != 1)                                                 /* check handle initialization */
    {
        return 3;                                                            /* return error */
    }

    if (handle->iic_uart != 0)
    {
        handle->debug_print("apm2000: uart interface is invalid.\n");        /* uart interface is invalid */
       
        return 1;
    }
    else
    {
        return a_apm2000_iic_read(handle, reg, buf, len);                    /* read the data */
    }
}

/**
 * @brief      get chip information
 * @param[out] *info pointer to an apm2000 info structure
 * @return     status code
 *             - 0 success
 *             - 2 handle is NULL
 * @note       none
 */
uint8_t apm2000_info(apm2000_info_t *info)
{
    if (info == NULL)                                               /* check handle */
    {
        return 2;                                                   /* return error */
    }
    
    memset(info, 0, sizeof(apm2000_info_t));                        /* initialize apm2000 info structure */
    strncpy(info->chip_name, CHIP_NAME, 32);                        /* copy chip name */
    strncpy(info->manufacturer_name, MANUFACTURER_NAME, 32);        /* copy manufacturer name */
    strncpy(info->interface, "UART IIC", 16);                       /* copy interface name */
    info->supply_voltage_min_v = SUPPLY_VOLTAGE_MIN;                /* set minimal supply voltage */
    info->supply_voltage_max_v = SUPPLY_VOLTAGE_MAX;                /* set maximum supply voltage */
    info->max_current_ma = MAX_CURRENT;                             /* set maximum current */
    info->temperature_max = TEMPERATURE_MAX;                        /* set minimal temperature */
    info->temperature_min = TEMPERATURE_MIN;                        /* set maximum temperature */
    info->driver_version = DRIVER_VERSION;                          /* set driver version */
    
    return 0;                                                       /* success return 0 */
}
