import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Search, BookOpen, FileText, ChevronRight, Scale, ExternalLink } from 'lucide-react';
import { Button } from '../components/common/Button';

export const LegalLibraryPage: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.legal.documents();
      setDocuments(res.documents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setSearching(true);
      const res = await api.legal.search(searchQuery.trim());
      setSearchResults(res.results);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Thư viện Quy phạm Pháp luật Môi trường</h1>
        <p className="text-sm text-slate-600">
          Tra cứu toàn văn điều khoản, khung xử phạt vi phạm hành chính và quy chuẩn chất lượng không khí
        </p>
      </div>

      {/* Legal Search Bar */}
      <div className="civic-card p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Nhập từ khóa tìm kiếm toàn văn: che chắn, rửa xe, phát tán bụi, PM2.5, xử phạt..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-red outline-none"
            />
          </div>
          <Button type="submit" variant="primary" loading={searching}>
            Tra cứu Toàn văn
          </Button>
        </form>
      </div>

      {/* FTS Search Results if active */}
      {searchResults.length > 0 && (
        <div className="civic-card p-5 space-y-3 border-teal-200 bg-teal-50/20">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-teal-950 uppercase tracking-wider">
              Kết quả tra cứu toàn văn ({searchResults.length} điều khoản khớp)
            </h2>
            <button
              onClick={() => {
                setSearchResults([]);
                setSearchQuery('');
              }}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Đóng kết quả
            </button>
          </div>

          <div className="divide-y divide-teal-100">
            {searchResults.map((res: any) => (
              <div key={res.section_id} className="py-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {res.section_number}: {res.heading}
                  </span>
                  <span className="font-mono text-slate-500 text-[11px]">{res.document_number}</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {res.content}
                </p>
                <div className="text-[11px] text-slate-400">
                  Thuộc văn bản: <strong className="text-slate-600">{res.document_title}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Catalog */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          DANH MỤC VĂN BẢN QUY PHẠM ĐANG HIỆU LỰC
        </h2>

        {loading ? (
          <div className="civic-card p-8 text-center text-slate-400 text-sm">Đang tải văn bản...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc: any) => (
              <div key={doc.id} className="civic-card-interactive p-5 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-dustguard-teal bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                      {doc.document_number}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {doc.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-slate-500">
                    Cơ quan ban hành: <strong className="text-slate-700">{doc.authority}</strong>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Hiệu lực: {doc.effective_date} ({doc.sections_count} điều khoản)
                  </span>
                  <Link to={`/legal/documents/${doc.id}`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                      Xem điều khoản &rarr;
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
