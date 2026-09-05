import React, { useState } from 'react';
import { Send, CheckCircle2, Building, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

interface PilotSectionProps {
  lang: 'vi' | 'en';
}

export const PilotSection: React.FC<PilotSectionProps> = ({ lang }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    district: 'Hà Nội',
    email: '',
    phone: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="pilot" className="py-16 sm:py-24 bg-[#FDFBF7] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Cột thông điệp */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-primary border border-red-200 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Hợp tác Triển khai Thực tế' : 'Pilot Deployment Partnership'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-content-main tracking-tight leading-tight">
              {lang === 'vi'
                ? 'Sẵn sàng đưa giải pháp vào địa bàn của bạn?'
                : 'Ready to deploy DustGuard in your district?'}
            </h2>

            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {lang === 'vi'
                ? 'Chúng tôi hợp tác cùng các Ban Quản lý Dự án Đô thị, Phòng TN&MT Quận/Huyện, Đoàn Thanh niên các trường Đại học và các tổ chức quốc tế nhằm chuẩn hóa quy trình giám sát bụi xây dựng trong 48 giờ.'
                : 'We partner with District Environment Offices, Urban Project Management Boards, University Youth Unions, and international organizations to operationalize 48-hour dust monitoring.'}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Cài đặt không gián đoạn:</strong> Triển khai nhanh chóng qua Cloud D1 hoặc máy chủ nội bộ trong 24 giờ.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Đào tạo hiện trường:</strong> Tập huấn quy trình ghi nhận chứng cứ số và đối soát tái kiểm cho thanh niên và cán bộ.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Đạt chuẩn pháp lý:</strong> Tích hợp sẵn mẫu biểu thanh tra theo Nghị định 45/2022/NĐ-CP và Luật BVMT 2020.
                </span>
              </div>
            </div>
          </div>

          {/* Cột Form Đăng ký Pilot */}
          <div className="lg:col-span-6">
            <div className="civic-card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
              {submitted ? (
                <div className="py-8 text-center space-y-3 animate-in fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {lang === 'vi' ? 'Đã tiếp nhận thông tin hợp tác!' : 'Pilot Application Received!'}
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    {lang === 'vi'
                      ? 'Điều phối viên của DustGuard VN sẽ liên hệ với bạn trong vòng 24 giờ làm việc để trao đổi kế hoạch thử nghiệm.'
                      : 'Our project coordinator will reach out within 24 working hours to schedule a deployment briefing.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      {lang === 'vi' ? 'Đăng ký Khảo sát & Triển khai Thử nghiệm' : 'Request a Pilot Briefing'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Miễn phí triển khai thử nghiệm cho các cơ quan quản lý nhà nước và CLB thanh niên.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Họ và tên người đại diện *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Đơn vị / Cơ quan / CLB *</label>
                      <input
                        type="text"
                        required
                        placeholder="Phòng TN&MT / Đoàn trường..."
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Địa bàn dự kiến thử nghiệm *</label>
                      <input
                        type="text"
                        required
                        placeholder="Quận Hoàng Mai, Hà Nội..."
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Số điện thoại liên hệ *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0912.345.678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email công vụ / cá nhân *</label>
                    <input
                      type="email"
                      required
                      placeholder="lienhe@domain.gov.vn hoặc email cá nhân"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nhu cầu hoặc tuyến công trình ưu tiên</label>
                    <textarea
                      rows={2}
                      placeholder="Ví dụ: Giám sát bụi từ tuyến xe ben thi công dự án Vành đai..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 touch-target transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi đăng ký thử nghiệm</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
