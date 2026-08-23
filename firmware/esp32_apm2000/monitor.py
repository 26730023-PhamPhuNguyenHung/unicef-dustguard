import serial
import time
import sys

PORT = "COM7"
BAUD = 115200

def run_monitor():
    print(f"=== KET NOI SERIAL MONITOR {PORT} @ {BAUD} ===")
    print("Nhan Ctrl+C de thoat...\n")
    try:
        ser = serial.Serial(PORT, BAUD, timeout=1)
        while True:
            line = ser.readline()
            if line:
                decoded = line.decode('utf-8', errors='replace').rstrip()
                if decoded:
                    print(f"[{time.strftime('%H:%M:%S')}] {decoded}")
    except KeyboardInterrupt:
        print("\nDa dung monitor.")
    except Exception as e:
        print(f"Loi: {e}")
    finally:
        if 'ser' in locals() and ser.is_open:
            ser.close()

if __name__ == "__main__":
    run_monitor()
