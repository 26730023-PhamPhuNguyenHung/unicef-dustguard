import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import {
  Search,
  FileText,
  CheckCircle2,
  BookOpen,
  Radio,
  ArrowRight,
  X,
  Plus,
  BarChart3,
  ShieldCheck,
  CornerDownLeft,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ cases: any[]; tasks: any[]; legal: any[]; iot: any[] }>({
    cases: [],
    tasks: [],
    legal: [],
    iot: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults({ cases: [], tasks: [], legal: [], iot: [] });
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ cases: [], tasks: [], legal: [], iot: [] });
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.search(query.trim());
        setResults(res.results || { cases: [], tasks: [], legal: [], iot: [] });
        setSelectedIndex(0);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectRoute = (path: string) => {
    onClose();
    navigate(path);
  };

  const defaultActions = [
    { title: 'Hàng đợi Nhiệm vụ Vận hành', path: '/tasks', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
    { title: 'Hộp việc Vụ việc Đô thị', path: '/cases', icon: <FileText className="w-4 h-4 text-dustguard-teal" /> },
    { title: 'Kho Lưu trữ & Kiểm định Bằng chứng', path: '/evidence', icon: <ShieldCheck className="w-4 h-4 text-purple-600" /> },
    { title: 'Giám sát Mạng lưới Cảm biến IoT', path: '/iot', icon: <Radio className="w-4 h-4 text-blue-600" /> },
    { title: 'Thư viện Pháp lý Môi trường', path: '/legal/library', icon: <BookOpen className="w-4 h-4 text-amber-600" /> },
    { title: 'Báo cáo & Phân tích Hoạt động', path: '/reports', icon: <BarChart3 className="w-4 h-4 text-rose-600" /> },
  ];

  const hasResults =
    results.cases.length > 0 ||
    results.tasks.length > 0 ||
    results.legal.length > 0 ||
    results.iot.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-none flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in duration-150">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm vụ việc (DG-...), nhiệm vụ, điều khoản luật, hoặc trạm IoT..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full text-sm bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-200 text-slate-600 rounded">
            ESC để đóng
          </span>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {loading && (
            <div className="p-8 text-center text-xs text-slate-500">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-dustguard-teal mb-2" />
              <p>Đang tìm kiếm trên toàn hệ thống...</p>
            </div>
          )}

          {!loading && !query.trim() && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Truy cập nhanh nghiệp vụ
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {defaultActions.map(action => (
                  <button
                    key={action.path}
                    onClick={() => handleSelectRoute(action.path)}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-slate-100 text-left transition-colors group touch-target"
                  >
                    <div className="p-1.5 rounded bg-slate-100 group-hover:bg-white transition-colors">
                      {action.icon}
                    </div>
                    <span className="text-xs font-semibold text-slate-800">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && query.trim() && !hasResults && (
            <div className="p-8 text-center text-slate-500 text-xs">
              Không tìm thấy kết quả phù hợp cho "<strong>{query}</strong>"
            </div>
          )}

          {!loading && hasResults && (
            <div className="space-y-4">
              {/* Cases Results */}
              {results.cases.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    Vụ việc ({results.cases.length})
                  </div>
                  {results.cases.map(c => (
                    <div
                      key={c.id}
                      onClick={() => handleSelectRoute(`/cases/${c.id}`)}
                      className="p-2.5 rounded-lg hover:bg-slate-100 cursor-pointer flex items-center justify-between text-xs transition-colors group"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-dustguard-teal mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 group-hover:text-dustguard-teal truncate">
                            <span className="text-dustguard-red font-mono mr-1.5">{c.case_code}</span>
                            {c.title}
                          </div>
                          <div className="text-slate-500 text-[11px] truncate">{c.location_text}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 flex-shrink-0">
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tasks Results */}
              {results.tasks.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    Nhiệm vụ ({results.tasks.length})
                  </div>
                  {results.tasks.map(t => (
                    <div
                      key={t.id}
                      onClick={() => handleSelectRoute('/tasks')}
                      className="p-2.5 rounded-lg hover:bg-slate-100 cursor-pointer flex items-center justify-between text-xs transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div className="min-w-0 font-medium text-slate-900 group-hover:text-emerald-700 truncate">
                          {t.title}
                          {t.case_code && (
                            <span className="ml-2 font-mono text-[11px] text-slate-500">({t.case_code})</span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500">{t.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Legal Sections */}
              {results.legal.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    Quy định Pháp lý ({results.legal.length})
                  </div>
                  {results.legal.map(l => (
                    <div
                      key={l.id}
                      onClick={() => handleSelectRoute('/legal/library')}
                      className="p-2.5 rounded-lg hover:bg-slate-100 cursor-pointer text-xs transition-colors group space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <span className="font-bold text-slate-900 group-hover:text-purple-700 truncate">
                          {l.heading || `Điều ${l.section_number}`}
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">({l.document_number})</span>
                      </div>
                      {l.snippet && (
                        <div
                          className="text-[11px] text-slate-600 line-clamp-1 pl-6"
                          dangerouslySetInnerHTML={{ __html: l.snippet }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* IoT Devices */}
              {results.iot.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    Trạm Quan trắc IoT ({results.iot.length})
                  </div>
                  {results.iot.map(d => (
                    <div
                      key={d.id}
                      onClick={() => handleSelectRoute(`/iot/${d.id}`)}
                      className="p-2.5 rounded-lg hover:bg-slate-100 cursor-pointer flex items-center justify-between text-xs transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Radio className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 group-hover:text-blue-700">
                            {d.device_code}
                          </span>{' '}
                          <span className="text-slate-600">— {d.name}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3 text-slate-400" />
            Nhấn Enter hoặc click để điều hướng
          </span>
          <span>Phím tắt: <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">K</kbd></span>
        </div>
      </div>
    </div>
  );
};
