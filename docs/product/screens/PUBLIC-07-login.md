# PUB-07 — Đăng Nhập & Chọn Phân Hệ (Auth Login)

## 1. Screen identity
- Role: Public / Authenticated User
- Route: `/login`
- Component: `modules/auth/Login.jsx`
- Layout: Auth Centered Layout
- Navigation entry: Nút "Đăng nhập" trên Header
- Current implementation status: ACTIVE (Level 5 Production)

Purpose: Xác thực tài khoản người dùng qua Email/Mật khẩu hoặc truy cập nhanh theo vai trò, cấp phát JWT session bearer token.
