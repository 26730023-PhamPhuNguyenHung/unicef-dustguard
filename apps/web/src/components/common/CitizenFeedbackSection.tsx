import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';
import { MessageSquare, Star, ThumbsUp, AlertTriangle, CheckCircle2, Send } from 'lucide-react';

interface CitizenFeedbackSectionProps {
  caseId: string;
  isClosedOrResolved: boolean;
}

export const CitizenFeedbackSection: React.FC<CitizenFeedbackSectionProps> = ({
  caseId,
  isClosedOrResolved,
}) => {
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [satisfactionLevel, setSatisfactionLevel] = useState<'SATISFIED' | 'NEUTRAL' | 'UNSATISFIED'>('SATISFIED');
  const [comment, setComment] = useState('');
  const [requestReinspection, setRequestReinspection] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;
    apiRequest<any>(`/cases/${caseId}/feedback`)
      .then((res) => {
        // Bug (đã vá): apiRequest() đã tự giải nén field `data` ở tầng client, nên `res` ở đây
        // CHÍNH LÀ mảng feedback - đọc thêm `res?.data` lần nữa luôn ra undefined, khiến danh
        // sách đánh giá không bao giờ hiển thị và cờ "đã gửi đánh giá" (hasSubmitted) không bao
        // giờ kích hoạt, cho phép 1 người dùng gửi nhiều đánh giá trùng lặp cho cùng 1 vụ việc.
        const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        setFeedbacks(list);
        if (user && list.some((f: any) => f.user_id === user.id)) {
          setHasSubmitted(true);
        }
      })
      .catch(() => {});
  }, [caseId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toastError('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để gửi đánh giá.');
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest(`/cases/${caseId}/feedback`, {
        method: 'POST',
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
          isSatisfied: satisfactionLevel !== 'UNSATISFIED',
          requestReinspection,
        }),
      });

      toastSuccess('Đánh giá thành công', 'Ý kiến của bạn đã được ghi nhận vào hồ sơ vụ việc.');
      setSubmitMessage('Đã gửi đánh giá thành công. Ý kiến của bạn đã được ghi nhận vào hồ sơ vụ việc.');
      setHasSubmitted(true);

      // Tải lại danh sách feedback
      const res = await apiRequest<any>(`/cases/${caseId}/feedback`);
      setFeedbacks(Array.isArray(res) ? res : (res?.data || []));
    } catch (err: any) {
      toastError('Lỗi gửi đánh giá', err.message || 'Không thể gửi đánh giá.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-content-main">
            Đánh Giá Kết Quả Khắc Phục Của Cộng Đồng (Feedback Loop)
          </h2>
        </div>
        <span className="text-xs font-semibold text-content-muted">
          {feedbacks.length} lượt đánh giá
        </span>
      </div>

      {isClosedOrResolved && !hasSubmitted && (
        <form onSubmit={handleSubmit} className="p-4 bg-surface-ground rounded-civic border border-border-subtle space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-content-sub mb-2">
              1. Bạn đánh giá thế nào về kết quả xử lý tại hiện trường?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSatisfactionLevel('SATISFIED');
                  setRating(5);
                  setRequestReinspection(false);
                }}
                className={`p-3 rounded-lg border flex items-center justify-center gap-2 font-bold transition-all min-h-[44px] ${
                  satisfactionLevel === 'SATISFIED'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white border-border-subtle text-content-sub hover:border-emerald-300'
                }`}
              >
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                <span>Hài lòng (Đã sạch bụi)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSatisfactionLevel('NEUTRAL');
                  setRating(3);
                }}
                className={`p-3 rounded-lg border flex items-center justify-center gap-2 font-bold transition-all min-h-[44px] ${
                  satisfactionLevel === 'NEUTRAL'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20 shadow-xs'
                    : 'bg-white border-border-subtle text-content-sub hover:border-amber-300'
                }`}
              >
                <span>Tạm ổn (Cần duy trì)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSatisfactionLevel('UNSATISFIED');
                  setRating(1);
                  setRequestReinspection(true);
                }}
                className={`p-3 rounded-lg border flex items-center justify-center gap-2 font-bold transition-all min-h-[44px] ${
                  satisfactionLevel === 'UNSATISFIED'
                    ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20 shadow-xs'
                    : 'bg-white border-border-subtle text-content-sub hover:border-rose-300'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Chưa đạt (Vẫn phát tán)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-sub mb-1">
              2. Ý kiến nhận xét / góp ý cụ thể:
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ thực tế hiện trạng sau khi đơn vị thi công xử lý (ví dụ: bạt đã được che kín chưa, xe ra vào có rửa lốp không...)"
              className="w-full p-3 rounded-lg border border-border-subtle text-xs outline-none focus:ring-2 focus:ring-primary bg-white text-content-main resize-none"
            />
          </div>

          {satisfactionLevel === 'UNSATISFIED' && (
            <label className="flex items-center gap-2 text-xs font-semibold text-rose-800 cursor-pointer p-2.5 bg-rose-50 rounded-lg border border-rose-200">
              <input
                type="checkbox"
                checked={requestReinspection}
                onChange={(e) => setRequestReinspection(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span>Yêu cầu Tổ Thanh tra & Điều phối viên phúc tra lại hiện trường</span>
            </label>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-extrabold rounded-civic hover:bg-primary-hover transition shadow-sm min-h-[44px]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Đang gửi...' : 'Gửi Đánh Giá Nghiệm Thu'}</span>
          </button>
        </form>
      )}

      {submitMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{submitMessage}</span>
        </div>
      )}

      {/* Danh sách các đánh giá của người dân */}
      <div className="space-y-3">
        {feedbacks.length === 0 ? (
          <p className="text-xs text-content-muted italic text-center py-4">
            Chưa có phản hồi nghiệm thu nào từ người dân. Ý kiến đánh giá sẽ hiển thị tại đây khi vụ việc hoàn tất xử lý.
          </p>
        ) : (
          <div className="divide-y divide-border-subtle">
            {feedbacks.map((f: any) => (
              <div key={f.id} className="py-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-content-main">
                      {f.user_name || 'Người dân quan sát'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.is_satisfied
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {f.is_satisfied ? 'Đã nghiệm thu hài lòng' : 'Chưa đạt / Cần phúc tra'}
                    </span>
                  </div>
                  <span className="text-[11px] text-content-muted">
                    {new Date(f.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                {f.comment && (
                  <p className="text-content-sub bg-surface-ground p-2.5 rounded border border-border-subtle">
                    &ldquo;{f.comment}&rdquo;
                  </p>
                )}

                {f.request_reinspection === 1 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                    <AlertTriangle className="w-3 h-3" /> Đã gửi yêu cầu phúc tra hiện trường
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CitizenFeedbackSection;
