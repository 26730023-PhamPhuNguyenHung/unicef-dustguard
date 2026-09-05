import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Printer, ArrowLeft, ShieldCheck, Download, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';

export const InspectionExportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.inspections.get(id).then(setData).catch(console.error).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading || !data) {
    return (
      <div className="civic-card p-12 text-center text-slate-400 text-sm">
        Đang chuẩn bị hồ sơ văn bản biên bản A4...
      </div>
    );
  }

  const { inspection, items = [], findings = [] } = data;
  const inspectionDate = new Date(inspection.created_at || Date.now());
  const day = String(inspectionDate.getDate()).padStart(2, '0');
  const month = String(inspectionDate.getMonth() + 1).padStart(2, '0');
  const year = inspectionDate.getFullYear();
  const hours = String(inspectionDate.getHours()).padStart(2, '0');
  const minutes = String(inspectionDate.getMinutes()).padStart(2, '0');

  const failFindings = findings.length > 0 ? findings : items.filter((i: any) => i.status === 'FAIL').map((i: any, idx: number) => ({
    id: i.id || `f-${idx}`,
    finding: i.item_name || 'Không đáp ứng yêu cầu vệ sinh môi trường',
    staff_note: i.note || 'Cần khắc phục ngay',
    severity: 'HIGH',
    legal_section_number: 'Điều 64 Luật BVMT 72/2020/QH14',
    legal_heading: 'Bảo vệ môi trường trong hoạt động xây dựng',
  }));

  return (
    <div className="space-y-6">
      {/* Action Bar (Ẩn khi in ấn) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
        <div className="flex items-center gap-3">
          <Link to={`/inspections/${id}/result`}>
            <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Về Kết Quả Kiểm Tra
            </Button>
          </Link>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Xem trước Văn bản Hành chính Chuẩn A4</h2>
            <p className="text-xs text-slate-500">Mẫu Biên bản Kiểm tra Hiện trường theo Nghị định 30/2020/NĐ-CP</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Printer className="w-4 h-4" />}
            onClick={() => window.print()}
          >
            In Biên Bản / Lưu PDF (A4)
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
                <div className="text-[12pt] uppercase tracking-tight">SỞ TÀI NGUYÊN VÀ MÔI TRƯỜNG</div>
                <div className="text-[12pt] uppercase tracking-tight font-extrabold">ĐOÀN THANH TRA MÔI TRƯỜNG ĐÔ THỊ</div>
                <div className="text-[11pt] font-normal italic mt-1">Số: {inspection.case_code || 'DG-2026'}/BB-KTMT</div>
              </td>
              <td className="w-1/2 align-top text-center leading-tight">
                <div className="text-[12pt] font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div className="text-[12pt] font-bold underline underline-offset-4">Độc lập - Tự do - Hạnh phúc</div>
                <div className="text-[11pt] italic mt-2">Hà Nội, ngày {day} tháng {month} năm {year}</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Tiêu đề Biên bản */}
        <div className="text-center my-6">
          <h1 className="text-[15pt] font-bold uppercase tracking-wider mb-1">
            BIÊN BẢN KIỂM TRA HIỆN TRƯỜNG
          </h1>
          <div className="text-[12pt] italic font-medium">
            Về việc chấp hành các quy định pháp luật về bảo vệ môi trường và trật tự thi công xây dựng
          </div>
        </div>

        {/* Thời gian & Địa điểm */}
        <div className="space-y-1 mb-4 text-[13pt]">
          <p>
            Hôm nay, vào hồi {hours} giờ {minutes} phút, ngày {day} tháng {month} năm {year}.
          </p>
          <p>
            Tại địa điểm: <strong>{inspection.project_name || inspection.case_title || 'Công trình xây dựng đô thị'}</strong>.
          </p>
          <p>
            Căn cứ quy định tại Luật Bảo vệ môi trường số 72/2020/QH14 ngày 17/11/2020;
          </p>
          <p>
            Căn cứ Nghị định số 45/2022/NĐ-CP ngày 07/07/2022 của Chính phủ quy định về xử phạt vi phạm hành chính trong lĩnh vực bảo vệ môi trường;
          </p>
          <p>
            Căn cứ kết quả tiếp nhận phản ánh hiện trường trên Hệ thống Giám sát Môi trường DustGuard VN;
          </p>
        </div>

        {/* I. Thành phần tham gia kiểm tra */}
        <div className="mt-4 mb-3">
          <h2 className="font-bold text-[13pt] uppercase mb-1">I. THÀNH PHẦN THAM GIA KIỂM TRA</h2>
          <div className="space-y-1 pl-4">
            <p>
              1. <strong>Đại diện Đoàn kiểm tra:</strong>
            </p>
            <p className="pl-4">
              - Ông/Bà: <strong>{inspection.inspector_name || 'Cán bộ thụ lý'}</strong> &mdash; Chức vụ: Trưởng đoàn kiểm tra.
            </p>
            <p>
              2. <strong>Đại diện Chủ đầu tư / Đơn vị thi công:</strong>
            </p>
            <p className="pl-4">
              - Ông/Bà: <strong>{inspection.contractor_rep || 'Chỉ huy trưởng công trường'}</strong> &mdash; Chức vụ: Đại diện phụ trách kỹ thuật & môi trường.
            </p>
          </div>
        </div>

        {/* II. Kết quả kiểm tra hiện trường */}
        <div className="mt-4 mb-3">
          <h2 className="font-bold text-[13pt] uppercase mb-1">
            II. KẾT QUẢ KIỂM TRA THỰC ĐỊA & ĐỐI CHIẾU QUY ĐỊNH
          </h2>
          <p className="mb-2">
            Đoàn kiểm tra đã tiến hành rà soát các hạng mục theo quy chuẩn kỹ thuật quốc gia về môi trường. Ghi nhận thực tế như sau:
          </p>

          <table className="w-full border-collapse border border-black text-[12pt] mb-3">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-black p-2 text-center w-12 font-bold">STT</th>
                <th className="border border-black p-2 text-left font-bold">Hạng mục / Hiện trạng ghi nhận</th>
                <th className="border border-black p-2 text-left w-2/5 font-bold">Căn cứ pháp lý đối chiếu</th>
                <th className="border border-black p-2 text-center w-24 font-bold">Đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {failFindings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="border border-black p-3 text-center italic">
                    Toàn bộ các tiêu chí kiểm tra tại hiện trường đều đạt tiêu chuẩn quy định, không phát hiện vi phạm phát tán bụi.
                  </td>
                </tr>
              ) : (
                failFindings.map((item: any, idx: number) => (
                  <tr key={item.id || idx}>
                    <td className="border border-black p-2 text-center">{idx + 1}</td>
                    <td className="border border-black p-2">
                      <strong>{item.finding}</strong>
                      {item.staff_note && <div className="text-[11pt] italic mt-0.5">{item.staff_note}</div>}
                    </td>
                    <td className="border border-black p-2 text-[11pt]">
                      {item.legal_section_number ? (
                        <>
                          <strong>{item.legal_section_number}:</strong> {item.legal_heading}
                        </>
                      ) : (
                        'Điều 64 Luật BVMT 72/2020/QH14; NĐ 45/2022/NĐ-CP'
                      )}
                    </td>
                    <td className="border border-black p-2 text-center font-bold">
                      {item.severity === 'HIGH' ? 'VI PHẠM' : 'NHẮC NHỞ'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* III. Kết luận và Biện pháp khắc phục */}
        <div className="mt-4 mb-4">
          <h2 className="font-bold text-[13pt] uppercase mb-1">III. KẾT LUẬN VÀ BIỆN PHÁP XỬ LÝ</h2>
          <div className="space-y-1.5 pl-4">
            <p>
              1. Yêu cầu Đơn vị thi công dừng ngay mọi hoạt động phát tán bụi lơ lửng, thu dọn toàn bộ đất cát và vật liệu rơi vãi xung quanh công trình.
            </p>
            <p>
              2. Khẩn trương lắp đặt, gia cố hệ thống bạt che chắn kín khít và kích hoạt trạm rửa xe tự động đối với mọi phương tiện trước khi ra khỏi công trường.
            </p>
            <p>
              3. <strong>Thời hạn khắc phục bắt buộc (SLA):</strong> Hoàn thành toàn bộ các biện pháp trong vòng <strong>48 giờ</strong> kể từ thời điểm lập biên bản này.
            </p>
            <p>
              4. Sau khi hoàn thành, Nhà thầu có trách nhiệm chụp ảnh minh chứng đối chứng (Before/After) kèm định vị và gửi báo cáo nghiệm thu trên Cổng thông tin DustGuard VN.
            </p>
          </div>
        </div>

        <p className="italic mb-6">
          Biên bản này được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản để tổ chức thực hiện và giám sát.
        </p>

        {/* Chữ ký 2 bên */}
        <table className="w-full border-collapse mt-8 text-center break-inside-avoid">
          <tbody>
            <tr>
              <td className="w-1/2 align-top">
                <div className="font-bold uppercase text-[12pt]">ĐẠI DIỆN ĐƠN VỊ THI CÔNG</div>
                <div className="text-[11pt] italic mb-16">(Ký, ghi rõ họ tên và đóng dấu)</div>
                <div className="font-bold text-[12pt]">{inspection.contractor_rep || '...........................................'}</div>
              </td>
              <td className="w-1/2 align-top">
                <div className="font-bold uppercase text-[12pt]">ĐẠI DIỆN ĐOÀN KIỂM TRA</div>
                <div className="text-[11pt] italic mb-16">(Ký và ghi rõ họ tên)</div>
                <div className="font-bold text-[12pt]">{inspection.inspector_name || 'Cán bộ kiểm tra'}</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Ghi chú pháp lý */}
        <div className="mt-12 p-3 border border-dashed border-slate-400 bg-slate-50 text-[10pt] italic text-slate-700">
          <strong>Ghi chú an toàn pháp lý DustGuard VN:</strong> Văn bản được tạo tự động từ hệ thống hồ sơ kỹ thuật số theo thể thức văn bản hành chính Nghị định 30/2020/NĐ-CP. Hệ thống tuân thủ nguyên tắc không tạo con dấu mộc đỏ đồ họa mô phỏng. Việc ký tên xác nhận và đóng dấu mộc pháp nhân được thực hiện thực tế bởi các bên có thẩm quyền trên bản in giấy cứng.
        </div>
      </div>
    </div>
  );
};

export default InspectionExportPage;
