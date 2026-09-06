import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { ArrowLeft, BookOpen, Scale, Search } from 'lucide-react';
import { Button } from '../components/common/Button';

export const LegalDocDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    if (id) {
      api.legal.document(id).then(setData).catch(console.error).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading || !data) {
    return (
      <div className="civic-card p-12 text-center text-slate-400 text-sm animate-pulse">
        Đang tải nội dung văn bản...
      </div>
    );
  }

  const { document: doc, sections } = data;
  const filteredSections = sections.filter((s: any) =>
    s.heading.toLowerCase().includes(filterText.toLowerCase()) ||
    s.section_number.toLowerCase().includes(filterText.toLowerCase()) ||
    s.content.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/legal/library" className="text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="font-mono text-xs font-bold text-dustguard-teal bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            {doc.document_number}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{doc.title}</h1>
        </div>
      </div>

      <div className="civic-card p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-slate-400 block">Cơ quan ban hành:</span>
          <strong className="text-slate-800">{doc.authority}</strong>
        </div>
        <div>
          <span className="text-slate-400 block">Ngày ban hành & có hiệu lực:</span>
          <strong className="text-slate-800">{doc.issued_date} (Hiệu lực: {doc.effective_date})</strong>
        </div>
        <div>
          <span className="text-slate-400 block">Trạng thái áp dụng:</span>
          <span className="font-bold text-emerald-700">
            {doc.status === 'ACTIVE' ? 'Đang có hiệu lực' : doc.status === 'EXPIRED' ? 'Hết hiệu lực' : doc.status}
          </span>
        </div>
      </div>

      {/* Sections search */}
      <div className="civic-card p-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            placeholder="Lọc nhanh điều khoản trong văn bản..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-teal"
          />
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {filteredSections.map((s: any) => (
          <div key={s.id} className="civic-card p-5 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-sm text-slate-900">
                {s.section_number}: {s.heading}
              </span>
              <span className="text-[11px] font-mono text-slate-400">{s.section_type}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-800 leading-relaxed font-medium text-xs sm:text-sm">
              {s.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
