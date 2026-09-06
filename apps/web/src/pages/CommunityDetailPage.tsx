import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { CaseCard } from '../components/common/CaseCard.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { useToast } from '../context/ToastContext.js';
import {
  Users,
  MapPin,
  Check,
  Plus,
  ArrowLeft,
  MessageSquare,
  Layers,
  CheckSquare,
  Send
} from 'lucide-react';

export const CommunityDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { success: toastSuccess, error: toastError } = useToast();

  const [community, setCommunity] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'cases' | 'tasks' | 'members'>('posts');

  // Form đăng post mới
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [posting, setPosting] = useState(false);

  const fetchDetail = () => {
    if (!slug) return;
    setLoading(true);
    apiRequest<any>(`/communities/${slug}`)
      .then((res) => setCommunity(res.community || res))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetail();
  }, [slug]);

  const handleJoinToggle = async () => {
    if (!community) return;
    try {
      if (community.isMember) {
        await apiRequest(`/communities/${community.id}/leave`, { method: 'POST' });
        toastSuccess('Cộng đồng', `Bạn đã rời nhóm ${community.name}`);
      } else {
        await apiRequest(`/communities/${community.id}/join`, { method: 'POST' });
        toastSuccess('Cộng đồng', `Chào mừng bạn gia nhập ${community.name}!`);
      }
      fetchDetail();
    } catch (err: any) {
      toastError('Lỗi cập nhật', err.message || 'Lỗi tham gia cộng đồng');
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!community || !postTitle.trim() || !postContent.trim()) return;
    setPosting(true);
    try {
      await apiRequest(`/communities/${community.id}/posts`, {
        method: 'POST',
        body: JSON.stringify({
          title: postTitle,
          content: postContent,
          postType: 'update'
        })
      });
      setPostTitle('');
      setPostContent('');
      toastSuccess('Đăng tin thành công', 'Cập nhật của bạn đã được chia sẻ tới cộng đồng!');
      fetchDetail();
    } catch (err: any) {
      toastError('Lỗi đăng tin', err.message || 'Lỗi đăng tin cập nhật');
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={4} />;

  if (!community) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-content-main">Không tìm thấy nhóm cộng đồng</h2>
        <Link
          to="/communities"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Về danh sách cộng đồng
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link
        to="/communities"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-sub hover:text-content-main transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại các nhóm cộng đồng
      </Link>

      {/* Community Banner Card */}
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-[280px]">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {community.district}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main">
              {community.name}
            </h1>
            <p className="text-xs sm:text-sm text-content-sub leading-relaxed">
              {community.description || 'Chưa có mô tả cho cộng đồng này.'}
            </p>
          </div>

          <button
            onClick={handleJoinToggle}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm ${
              community.isMember
                ? 'bg-emerald-50 text-state-success border border-emerald-200 hover:bg-emerald-100'
                : 'bg-primary text-white hover:bg-primary-dark active:scale-95'
            }`}
          >
            {community.isMember ? (
              <>
                <Check className="w-4 h-4" />
                Đã là thành viên
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Tham gia nhóm
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-border-subtle text-xs text-content-sub">
          <span className="flex items-center gap-1.5 font-semibold text-content-main">
            <Users className="w-4 h-4 text-primary" />
            {community.memberCount || community.members?.length || 1} thành viên
          </span>
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-content-muted" />
            {community.cases?.length || 0} vụ việc theo dõi
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-subtle gap-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'posts'
              ? 'border-primary text-primary'
              : 'border-transparent text-content-sub hover:text-content-main'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Cập nhật hoạt động ({community.posts?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('cases')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'cases'
              ? 'border-primary text-primary'
              : 'border-transparent text-content-sub hover:text-content-main'
          }`}
        >
          <Layers className="w-4 h-4" />
          Vụ việc địa bàn ({community.cases?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'tasks'
              ? 'border-primary text-primary'
              : 'border-transparent text-content-sub hover:text-content-main'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          Nhiệm vụ cộng đồng ({community.tasks?.length || 0})
        </button>
      </div>

      {/* TAB 1: BÀI VIẾT & CẬP NHẬT */}
      {activeTab === 'posts' && (
        <div className="space-y-5">
          {/* Form đăng bài nhanh */}
          <form
            onSubmit={handleCreatePost}
            className="bg-surface-card rounded-civic border border-border-subtle p-5 shadow-xs space-y-3"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-content-sub">
              Đăng tin cập nhật cho nhóm
            </div>
            <input
              type="text"
              required
              placeholder="Tiêu đề thông báo / cập nhật..."
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-border-subtle focus:border-primary focus:outline-none text-xs sm:text-sm bg-white"
            />
            <textarea
              required
              rows={2}
              placeholder="Nội dung tóm tắt tiến độ, kêu gọi hỗ trợ..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-border-subtle focus:border-primary focus:outline-none text-xs sm:text-sm bg-white"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={posting || !postTitle.trim() || !postContent.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-xs hover:bg-primary-dark transition-all disabled:opacity-50"
              >
                {posting ? 'Đang gửi...' : 'Đăng tin'}
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Danh sách bài viết */}
          {community.posts && community.posts.length > 0 ? (
            community.posts.map((p: any) => (
              <div
                key={p.id}
                className="bg-surface-card rounded-civic border border-border-subtle p-5 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-content-main">
                    {p.authorName || 'Thành viên'}
                  </span>
                  <span className="text-[11px] text-content-muted">
                    {new Date(p.created_at || p.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-content-main">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-content-sub leading-relaxed whitespace-pre-line">
                  {p.content}
                </p>
              </div>
            ))
          ) : (
            <EmptyState
              title="Chưa có tin cập nhật"
              description="Hãy là người đầu tiên chia sẻ thông tin tiến độ hoặc hoạt động của nhóm."
            />
          )}
        </div>
      )}

      {/* TAB 2: CÁC VỤ VIỆC ĐỊA BÀN */}
      {activeTab === 'cases' && (
        <div>
          {community.cases && community.cases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {community.cases.map((c: any) => (
                <CaseCard key={c.id} caseData={c} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Chưa có vụ việc gắn với địa bàn này"
              description="Khi người dân tạo phản ánh tại quận này, các vụ việc sẽ tự động được hiển thị tại đây."
            />
          )}
        </div>
      )}

      {/* TAB 3: NHIỆM VỤ CỘNG ĐỒNG */}
      {activeTab === 'tasks' && (
        <div className="space-y-3">
          {community.tasks && community.tasks.length > 0 ? (
            community.tasks.map((t: any) => (
              <div
                key={t.id}
                className="bg-surface-card p-5 rounded-civic border border-border-subtle shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-primary uppercase">
                    {t.task_type || t.taskType}
                  </span>
                  <h4 className="text-sm font-bold text-content-main">{t.title}</h4>
                  <p className="text-xs text-content-sub">{t.description}</p>
                </div>
                <Link
                  to="/tasks"
                  className="px-4 py-2 rounded-xl bg-surface-secondary hover:bg-gray-200 text-content-main font-semibold text-xs transition-colors shrink-0"
                >
                  Xem nhiệm vụ
                </Link>
              </div>
            ))
          ) : (
            <EmptyState
              title="Hiện không có nhiệm vụ đang mở"
              description="Các nhiệm vụ kiểm tra hiện trường mới sẽ xuất hiện khi điều phối viên tạo yêu cầu."
            />
          )}
        </div>
      )}
    </div>
  );
};
