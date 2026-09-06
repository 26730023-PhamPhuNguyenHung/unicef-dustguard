import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { useToast } from '../context/ToastContext.js';
import { Users, MapPin, Layers, ArrowRight, Check, Plus } from 'lucide-react';

export const CommunitiesPage: React.FC = () => {
  const { success: toastSuccess, error: toastError } = useToast();
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCommunities = () => {
    setLoading(true);
    apiRequest<any>('/communities')
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.communities || []);
        setCommunities(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleJoinToggle = async (comm: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (comm.isMember) {
        await apiRequest(`/communities/${comm.id}/leave`, { method: 'POST' });
        toastSuccess('Cộng đồng', `Bạn đã rời nhóm ${comm.name}`);
      } else {
        await apiRequest(`/communities/${comm.id}/join`, { method: 'POST' });
        toastSuccess('Cộng đồng', `Chào mừng bạn gia nhập ${comm.name}!`);
      }
      fetchCommunities();
    } catch (err: any) {
      toastError('Lỗi cập nhật', err.message || 'Lỗi tham gia cộng đồng');
    }
  };

  const filtered = communities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm">
        <div className="max-w-xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Mạng lưới tình nguyện & khu dân cư
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main">
            Cộng đồng quanh bạn
          </h1>
          <p className="text-xs sm:text-sm text-content-sub">
            Cùng tham gia các nhóm tình nguyện, CLB sinh viên và hội dân phố để phối hợp ghi nhận, giám sát và dập tắt nguồn bụi công trình.
          </p>
        </div>

        {/* Search */}
        <div className="mt-6 max-w-md">
          <input
            type="text"
            placeholder="Tìm theo tên cộng đồng hoặc quận huyện..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border-subtle focus:border-primary focus:outline-none text-xs sm:text-sm bg-surface-secondary/40"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton rows={3} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Không tìm thấy nhóm cộng đồng phù hợp"
          description="Hãy thử từ khóa khác hoặc quay lại xem toàn bộ danh sách."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((comm) => (
            <div
              key={comm.id}
              className="bg-surface-card rounded-civic border border-border-subtle shadow-sm hover:shadow transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-content-sub flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {comm.district}
                  </span>
                  <button
                    onClick={(e) => handleJoinToggle(comm, e)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors inline-flex items-center gap-1 ${
                      comm.isMember
                        ? 'bg-emerald-50 text-state-success border border-emerald-200'
                        : 'bg-primary text-white hover:bg-primary-dark shadow-xs'
                    }`}
                  >
                    {comm.isMember ? (
                      <>
                        <Check className="w-3 h-3" />
                        Đã tham gia
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        Tham gia
                      </>
                    )}
                  </button>
                </div>

                <Link to={`/communities/${comm.slug}`}>
                  <h3 className="text-base font-bold text-content-main hover:text-primary transition-colors line-clamp-1">
                    {comm.name}
                  </h3>
                </Link>

                <p className="text-xs text-content-sub line-clamp-2">
                  {comm.description || 'Chưa có mô tả nhóm.'}
                </p>
              </div>

              <div className="px-5 py-3 bg-surface-secondary/50 border-t border-border-subtle flex items-center justify-between text-xs text-content-sub">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold text-content-main">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    {comm.memberCount || comm.member_count || 1} thành viên
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-content-muted" />
                    {comm.activeCaseCount || comm.active_cases || 0} vụ việc
                  </span>
                </div>

                <Link
                  to={`/communities/${comm.slug}`}
                  className="font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1"
                >
                  Chi tiết
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
