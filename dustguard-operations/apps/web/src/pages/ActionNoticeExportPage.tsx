import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Printer, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';

export const ActionNoticeExportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // actionId
  const [action, setAction] = useState<any>(null);
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.actions.list()
        .then(async (res) => {
          const found = res.actions?.find((a: any) => a.id === id);
          if (found) {
            setAction(found);
            if (found.case_id) {
              try {
                const c = await api.cases.get(found.case_id);
                setCaseData(c.case);
              } catch (e) {
                console.warn('Lỗi lấy case:', e);
              }
            }
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading || !action) {
    return (
      <div className="civic-card p-12 text-center text-slate-400 text-sm">
        Đang chuẩn bị thông báo khắc phục chuẩn A4...
      </div>
    );
  }

  const noticeDate = new Date(action.created_at || Date.now());
  const day = String(noticeDate.getDate()).padStart(2, '0');
  const month = String(noticeDate.getMonth() + 1).padStart(2, '0');
  const year = noticeDate.getFullYear();

  return (
    <div className="space-y-6">
      {/* Action Bar (Ẩn khi in ấn) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
        <div className="flex items-center gap-3">
          <Link to={`/actions`}>
            <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Về Danh Sách Biện Pháp
            </Button>
          </Link>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Xem trước Thông Báo Khắc Phục Chuẩn A4</h2>
            <p className="text-xs text-slate-500">Mẫu Thông báo Yêu cầu Khắc phục Ô nhiễm theo Nghị định 30/2020/NĐ-CP</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Printer className="w-4 h-4" />}
            onClick={() => window.print()}
          >
            In Thông Báo / Lưu PDF (A4)
          </Button>
        </div>
      </div>

      {/* Trang in chuẩn A4 Văn bản Hành chính Việt Nam */}
      <div className="bg-white border border-slate-300 shadow-md max-w-[210mm] mx-auto p-[20mm_15mm_20mm_25mm] text-black font-['Times_New_Roman',Times,serif] leading-[1.4] text-[13pt] print:border-none print:shadow-none print:m-0 print:p-0">
        <style>{`
          @media print {
            body {
              background: #fff !important;
              color: #000 !important;
            }
            @page {
              size: A4 portrait;
              margin: 20mm 15mm 20mm 25mm;
            }
            .print\\:hidden {
              display: none !important;
            }
          }
        `}</style>

        {/* Header Quốc hiệu & Đơn vị */}
        <table className="w-full border-collapse mb-6 text-center">
          <tbody>
            <tr>
              <td className="w-1/2 align-top text-left font-bold leading-tight">
                <div className="text-[12pt] uppercase tracking-tight">ỦY BAN NHÂN DÂN THÀNH PHỐ HÀ NỘI</div>
                <div className="text-[12pt] uppercase tracking-tight font-extrabold">TỔ CÔNG TÁC GIÁM SÁT MÔI TRƯỜNG</div>
                <div className="text-[11pt] font-normal italic mt-1">Số: {action.id.slice(0, 8).toUpperCase()}/TB-KPMT</div>
              </td>
              <td className="w-1/2 align-top text-center leading-tight">
                <div className="text-[12pt] font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div className="text-[12pt] font-bold underline underline-offset-4">Độc lập - Tự do - Hạnh phúc</div>
                <div className="text-[11pt] italic mt-2">Ngày {day} tháng {month} năm {year}</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Tiêu đề Văn bản */}
        <div className="text-center my-6">
          <h1 className="text-[15pt] font-bold uppercase tracking-wider mb-1">
            THÔNG BÁO YÊU CẦU KHẮC PHỤC VI PHẠM MÔI TRƯỜNG
          </h1>
          <div className="text-[12pt] italic font-medium">
            V/v thực hiện các biện pháp cấp bách xử lý ô nhiễm bụi và vệ sinh môi trường thi công
          </div>
        </div>

        {/* Kính gửi */}
        <div className="mb-4 text-center">
          <strong>Kính gửi:</strong> Đại diện Chỉ huy trưởng / Ban Quản lý Công trình
        </div>

        {/* Căn cứ */}
        <div className="space-y-1 mb-4 text-[13pt]">
          <p>
            Căn cứ Luật Bảo vệ môi trường số 72/2020/QH14 ngày 17/11/2020;
          </p>
          <p>
            Căn cứ Nghị định số 45/2022/NĐ-CP ngày 07/07/2022 của Chính phủ về xử phạt vi phạm hành chính trong lĩnh vực bảo vệ môi trường;
          </p>
          <p>
            Căn cứ kết quả kiểm tra thực địa và dữ liệu giám sát môi trường tại công trình <strong>{caseData?.location_text || caseData?.title || 'Hiện trường công trình xây dựng'}</strong>;
          </p>
        </div>

        {/* Nội dung thông báo */}
        <div className="space-y-3 text-[13pt]">
          <p>
            Tổ công tác Giám sát Môi trường thông báo và yêu cầu Đơn vị thi công thực hiện ngay các nội dung sau:
          </p>

          <div className="p-4 border border-black bg-slate-50 space-y-2">
            <p>
              <strong>1. Nội dung yêu cầu khắc phục:</strong> {action.title}
            </p>
            {action.description && (
              <p>
                <strong>2. Chi tiết biện pháp:</strong> {action.description}
              </p>
            )}
            <p>
              <strong>3. Thời hạn hoàn thành bắt buộc (SLA):</strong> Trong vòng <strong>48 giờ</strong> (Hạn chót: {(action.due_at || action.due_date) ? new Date(action.due_at || action.due_date).toLocaleString('vi-VN') : 'Theo thông báo'}).
            </p>
          </div>

          <p>
            <strong>2. Trách nhiệm báo cáo nghiệm thu:</strong>
          </p>
          <p className="pl-4">
            - Sau khi hoàn tất khắc phục hiện trường, Đơn vị thi công chụp ảnh đối chứng hiện trường (Before / After) có gắn tọa độ GPS và tải lên trực tiếp tại <strong>Cổng thông tin Đơn vị thi công (Contractor Portal)</strong> của hệ thống DustGuard VN.
          </p>
          <p className="pl-4">
            - Hết thời hạn nêu trên, nếu Đơn vị thi công không thực hiện hoặc thực hiện không đạt yêu cầu, Tổ công tác sẽ chuyển hồ sơ sang Thanh tra Sở Xây dựng và Công an Môi trường xử lý nghiêm theo quy định pháp luật.
          </p>
        </div>

        {/* Chữ ký */}
        <table className="w-full border-collapse mt-10 text-center break-inside-avoid">
          <tbody>
            <tr>
              <td className="w-1/2 align-top text-left text-[11pt]">
                <strong>Nơi nhận:</strong><br />
                - Như trên (để thực hiện);<br />
                - Sở TN&MT, UBND Địa phương (để b/c);<br />
                - Lưu: VT, Tổ Giám sát.
              </td>
              <td className="w-1/2 align-top text-center">
                <div className="font-bold uppercase text-[12pt]">TỔ TRƯỞNG TỔ GIÁM SÁT</div>
                <div className="text-[11pt] italic mb-16">(Ký, ghi rõ họ tên và đóng dấu)</div>
                <div className="font-bold text-[12pt]">CÁN BỘ PHỤ TRÁCH THỤ LÝ</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Ghi chú pháp lý */}
        <div className="mt-12 p-3 border border-dashed border-slate-400 bg-slate-50 text-[10pt] italic text-slate-700">
          <strong>Ghi chú an toàn pháp lý DustGuard VN:</strong> Văn bản được lập theo thể thức Nghị định 30/2020/NĐ-CP. Việc ký và đóng dấu mộc đỏ pháp nhân được thực hiện thực tế trên bản in giấy trắng đen.
        </div>
      </div>
    </div>
  );
};

export default ActionNoticeExportPage;
