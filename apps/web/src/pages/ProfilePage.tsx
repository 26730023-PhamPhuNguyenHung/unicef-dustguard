import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { apiRequest } from '../api/client.js';
import { User, Mail, MapPin, Shield, Check, Save, LogOut } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [district, setDistrict] = useState(user?.district || 'Quận 7');
  const [ward, setWard] = useState(user?.ward || 'Tân Phú');
  const [bio, setBio] = useState(user?.bio || '');
  const [displayIdentity, setDisplayIdentity] = useState<'name' | 'anonymous'>(
    user?.displayIdentity || 'anonymous'
  );

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await apiRequest('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          fullName,
          district,
          ward,
          bio,
          displayIdentity
        })
      });
      await refreshUser();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Lỗi lưu thông tin hồ sơ.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-content-main">
          Hồ sơ của bạn
        </h1>
        <p className="text-xs sm:text-sm text-content-sub mt-0.5">
          Quản lý thông tin tài khoản và cài đặt quyền riêng tư khi tham gia cộng đồng.
        </p>
      </div>

      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm space-y-6">
        {/* User Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-border-subtle">
          <div className="w-16 h-16 rounded-full bg-primary-light text-primary font-extrabold text-2xl flex items-center justify-center border-2 border-primary/20">
            {fullName ? fullName.charAt(0) : 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-content-main">{fullName || 'Người dùng'}</h2>
            <div className="text-xs text-content-sub flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email}</span>
            </div>
            <div className="text-xs font-semibold text-primary capitalize mt-1">
              Vai trò: {user?.role.replace('_', ' ')}
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
              Họ và tên *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                Quận / Huyện sinh sống
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                Phường / Xã
              </label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
              Giới thiệu ngắn
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="VD: Cư dân sinh sống tại Quận 7, quan tâm đến chất lượng không khí quanh công trình..."
              className="w-full px-4 py-2.5 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
            />
          </div>

          {/* Cài đặt riêng tư / Danh tính */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
              Quyền riêng tư: Hiển thị danh tính công khai
            </label>
            <div className="space-y-2">
              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${
                  displayIdentity === 'anonymous'
                    ? 'border-primary bg-primary-light text-primary font-semibold'
                    : 'border-border-subtle bg-white text-content-main'
                }`}
              >
                <input
                  type="radio"
                  name="displayIdentity"
                  value="anonymous"
                  checked={displayIdentity === 'anonymous'}
                  onChange={() => setDisplayIdentity('anonymous')}
                />
                <span className="text-xs">
                  Ẩn danh mặc định (Hiển thị là "Thành viên cộng đồng")
                </span>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${
                  displayIdentity === 'name'
                    ? 'border-primary bg-primary-light text-primary font-semibold'
                    : 'border-border-subtle bg-white text-content-main'
                }`}
              >
                <input
                  type="radio"
                  name="displayIdentity"
                  value="name"
                  checked={displayIdentity === 'name'}
                  onChange={() => setDisplayIdentity('name')}
                />
                <span className="text-xs">
                  Công khai họ tên thật trên các phản ánh và quan sát
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary-dark transition-all disabled:opacity-50 active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Đã lưu xong
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
