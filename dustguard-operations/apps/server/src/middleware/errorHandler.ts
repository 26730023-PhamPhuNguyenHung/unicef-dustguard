import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error('[API Error]', err);

  if (err instanceof ZodError) {
    res.status(400).json({
      type: 'https://dustguard.gov.vn/errors/validation',
      title: 'Dữ liệu đầu vào không hợp lệ',
      status: 400,
      detail: err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '),
      invalidParams: err.errors,
    });
    return;
  }

  const status = err.status || 500;
  res.status(status).json({
    type: 'https://dustguard.gov.vn/errors/internal',
    title: err.title || 'Lỗi xử lý hệ thống',
    status,
    detail: err.message || 'Đã xảy ra lỗi ngoài ý muốn trên máy chủ.',
  });
}
