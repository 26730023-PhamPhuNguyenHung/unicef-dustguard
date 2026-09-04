import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import {
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  Plus,
  Edit3,
  ShieldCheck,
  ArrowLeft,
  Scale,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Button } from '../components/common/Button';

// Sample authentic Vietnamese legal texts
const SAMPLES = {
  ND45: {
    title: 'Nghị định 45/2022/NĐ-CP về xử phạt vi phạm hành chính trong lĩnh vực bảo vệ môi trường',
    document_number: '45/2022/NĐ-CP',
    authority: 'Chính phủ',
    text: `Chương II
HÀNH VI VI PHẠM HÀNH CHÍNH, HÌNH THỨC, MỨC XỬ PHẠT VÀ BIỆN PHÁP KHẮC PHỤC HẬU QUẢ

Điều 15. Vi phạm các quy định về bảo vệ môi trường trong hoạt động thi công xây dựng
1. Phạt cảnh cáo hoặc phạt tiền từ 500.000 đồng đến 1.000.000 đồng đối với hành vi không thực hiện biện pháp che chắn bụi tại công trình thi công xây dựng.
2. Phạt tiền từ 10.000.000 đồng đến 15.000.000 đồng đối với hành vi không có trạm rửa xe hoặc không rửa bánh xe ô tô chở vật liệu xây dựng, đất đá ra khỏi công trường.
a) Trường hợp tái phạm hoặc vi phạm nhiều lần thì bị áp dụng mức phạt tăng nặng 50%.
b) Buộc áp dụng biện pháp khắc phục tình trạng ô nhiễm môi trường do hành vi vi phạm gây ra.

Điều 16. Vi phạm về quan trắc môi trường và công khai thông tin
1. Phạt tiền từ 20.000.000 đồng đến 30.000.000 đồng đối với hành vi không duy trì hệ thống quan trắc tự động liên tục theo quy chuẩn kỹ thuật môi trường.`,
  },
  QCVN05: {
    title: 'Quy chuẩn kỹ thuật quốc gia về chất lượng không khí xung quanh',
    document_number: 'QCVN 05:2023/BTNMT',
    authority: 'Bộ Tài nguyên và Môi trường',
    text: `Chương I
QUY ĐỊNH CHUNG

Điều 1. Phạm vi điều chỉnh
1. Quy chuẩn này quy định giá trị giới hạn các thông số chất lượng không khí xung quanh.
2. Quy chuẩn này áp dụng đối với cơ quan quản lý nhà nước về môi trường, các tổ chức, cá nhân có hoạt động liên quan đến phát thải bụi và chất gây ô nhiễm không khí.

Điều 2. Giá trị giới hạn các thông số cơ bản
1. Thông số Bụi mịn PM2.5:
a) Giá trị trung bình 24 giờ không vượt quá 50 microgam trên mét khối không khí (50 µg/m³).
b) Giá trị trung bình năm không vượt quá 25 microgam trên mét khối không khí (25 µg/m³).
2. Thông số Bụi lơ lửng tổng số (TSP):
a) Giá trị trung bình 1 giờ không vượt quá 300 microgam trên mét khối không khí (300 µg/m³).
b) Giá trị trung bình 24 giờ không vượt quá 200 microgam trên mét khối không khí (200 µg/m³).`,
  },
};

export const LegalImportPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [authority, setAuthority] = useState('');
  const [textContent, setTextContent] = useState('');

  const [parsing, setParsing] = useState(false);
  const [parsedDoc, setParsedDoc] = useState<any>(null);
  const [parsedSections, setParsedSections] = useState<any[]>([]);
  const [persisting, setPersisting] = useState(false);

  const loadSample = (key: 'ND45' | 'QCVN05') => {
    const s = SAMPLES[key];
    setTitle(s.title);
    setDocNumber(s.document_number);
    setAuthority(s.authority);
    setTextContent(s.text);
  };

  const handleParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !docNumber.trim() || !textContent.trim()) {
      addToast('Vui lòng điền đầy đủ tiêu đề, số hiệu văn bản và nội dung', 'error');
      return;
    }

    try {
      setParsing(true);
      const res = await api.legal.importText({
        title: title.trim(),
        document_number: docNumber.trim(),
        authority: authority.trim() || 'Cơ quan có thẩm quyền',
        text_content: textContent.trim(),
      });
      setParsedDoc(res.document);
      setParsedSections(res.sections || []);
      addToast(`Nhận diện thành công ${res.sections?.length || 0} mục/điều khoản có cấu trúc`, 'success');
    } catch (err: any) {
      addToast(err.detail || 'Không thể bóc tách cấu trúc văn bản pháp lý', 'error');
    } finally {
      setParsing(false);
    }
  };

  const handleUpdateSection = (index: number, field: string, value: any) => {
    const updated = [...parsedSections];
    updated[index] = { ...updated[index], [field]: value };
    setParsedSections(updated);
  };

  const handleDeleteSection = (index: number) => {
    const updated = parsedSections.filter((_, i) => i !== index);
    setParsedSections(updated);
  };

  const handleAddSection = () => {
    setParsedSections([
      ...parsedSections,
      {
        id: `sec-new-${Date.now()}`,
        section_type: 'ARTICLE',
        section_number: 'Điều ...',
        heading: 'Điều khoản bổ sung thủ công',
        content: 'Nội dung quy định...',
        sort_order: parsedSections.length + 1,
      },
    ]);
  };

  const handleApproveAndSave = async () => {
    if (!parsedDoc || parsedSections.length === 0) {
      addToast('Chưa có cấu trúc pháp lý nào được duyệt', 'error');
      return;
    }

    try {
      setPersisting(true);
      const res = await api.legal.saveDocument({
        ...parsedDoc,
        sections: parsedSections,
      });
      addToast('Đã lưu văn bản quy phạm pháp luật và đồng bộ chỉ mục FTS5 thành công!', 'success');
      navigate(`/legal/documents/${res.document.id}`);
    } catch (err: any) {
      addToast(err.detail || 'Lỗi lưu văn bản pháp lý vào CSDL', 'error');
    } finally {
      setPersisting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link to="/legal/library" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Quay lại thư viện pháp lý
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Nhập và Bóc tách Cấu trúc Quy phạm Pháp luật
        </h1>
        <p className="text-sm text-slate-600">
          Hệ thống nhận diện phân cấp Phần → Chương → Mục → Điều → Khoản → Điểm theo quy chuẩn kỹ thuật lập pháp Việt Nam
        </p>
      </div>

      {/* Preset samples */}
      <div className="civic-card p-4 flex flex-wrap items-center justify-between gap-3 bg-slate-50 border-slate-200">
        <div className="text-xs text-slate-700 font-semibold flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-dustguard-teal" />
          <span>Mẫu văn bản quy phạm pháp luật có sẵn trong hệ thống:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadSample('ND45')}
            className="text-xs px-3 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-800 hover:bg-slate-100 touch-target"
          >
            Nghị định 45/2022/NĐ-CP (Xử phạt môi trường)
          </button>
          <button
            type="button"
            onClick={() => loadSample('QCVN05')}
            className="text-xs px-3 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-800 hover:bg-slate-100 touch-target"
          >
            QCVN 05:2023/BTNMT (Không khí xung quanh)
          </button>
        </div>
      </div>

      {/* Input Form */}
      <div className="civic-card p-6 space-y-4">
        <form onSubmit={handleParse} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên văn bản quy phạm *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ví dụ: Nghị định số 45/2022/NĐ-CP..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-teal outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số hiệu văn bản *</label>
              <input
                type="text"
                value={docNumber}
                onChange={e => setDocNumber(e.target.value)}
                placeholder="45/2022/NĐ-CP"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-teal outline-none font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Cơ quan ban hành</label>
            <input
              type="text"
              value={authority}
              onChange={e => setAuthority(e.target.value)}
              placeholder="Chính phủ / Bộ Tài nguyên và Môi trường"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-teal outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Toàn văn nội dung pháp lý cần quét cấu trúc *
            </label>
            <textarea
              value={textContent}
              onChange={e => setTextContent(e.target.value)}
              rows={8}
              placeholder="Dán toàn văn văn bản hoặc điều khoản tại đây..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-teal outline-none font-mono leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="teal" loading={parsing} icon={<Sparkles className="w-4 h-4" />}>
              Bóc tách cấu trúc pháp lý (Scanner)
            </Button>
          </div>
        </form>
      </div>

      {/* Human-in-the-loop Review Tree Editor */}
      {parsedSections.length > 0 && (
        <div className="civic-card p-6 space-y-5 border-teal-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Duyệt cấu trúc phân cấp ({parsedSections.length} điều khoản/khoản)
              </h2>
              <p className="text-xs text-slate-500">
                Kiểm tra, điều chỉnh tiêu đề, nội dung và loại điều khoản trước khi chính thức lưu vào CSDL
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleAddSection} icon={<Plus className="w-3.5 h-3.5" />}>
                Thêm mục
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                loading={persisting}
                onClick={handleApproveAndSave}
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Phê duyệt & Lưu vào Thư viện
              </Button>
            </div>
          </div>

          {/* Tree items */}
          <div className="space-y-3">
            {parsedSections.map((sec, idx) => (
              <div
                key={sec.id || idx}
                className={`p-4 rounded-lg border transition-colors ${
                  sec.section_type === 'CHAPTER'
                    ? 'bg-slate-100 border-slate-300 font-bold'
                    : sec.section_type === 'ARTICLE'
                    ? 'bg-white border-teal-200 ml-3'
                    : 'bg-slate-50/70 border-slate-200 ml-6'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={sec.section_type}
                      onChange={e => handleUpdateSection(idx, 'section_type', e.target.value)}
                      className="text-xs font-bold border border-slate-300 rounded px-2 py-1 bg-white text-slate-800"
                    >
                      <option value="CHAPTER">Chương</option>
                      <option value="SECTION">Mục</option>
                      <option value="ARTICLE">Điều</option>
                      <option value="CLAUSE">Khoản</option>
                      <option value="POINT">Điểm</option>
                    </select>

                    <input
                      type="text"
                      value={sec.section_number || ''}
                      onChange={e => handleUpdateSection(idx, 'section_number', e.target.value)}
                      placeholder="Số hiệu (vd: Điều 15, Khoản 1)"
                      className="text-xs font-mono font-bold px-2 py-1 border border-slate-300 rounded bg-white w-32"
                    />

                    <input
                      type="text"
                      value={sec.heading || ''}
                      onChange={e => handleUpdateSection(idx, 'heading', e.target.value)}
                      placeholder="Tiêu đề đề mục..."
                      className="text-xs font-semibold px-2 py-1 border border-slate-300 rounded bg-white flex-1 min-w-[200px]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteSection(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors touch-target"
                    title="Xóa mục này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  value={sec.content || ''}
                  onChange={e => handleUpdateSection(idx, 'content', e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2 border border-slate-300 rounded bg-white text-slate-800 leading-relaxed font-sans"
                  placeholder="Nội dung điều khoản..."
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="danger"
              loading={persisting}
              onClick={handleApproveAndSave}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Phê duyệt & Lưu vào Thư viện
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
