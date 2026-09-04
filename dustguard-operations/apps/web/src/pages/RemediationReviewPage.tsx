import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, Calendar, User } from 'lucide-react';
import { Button } from '../components/common/Button';

export const RemediationReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // remediation submission id
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewStatus, setReviewStatus] = useState<'APPROVED' | 'REJECTED' | 'MORE_EVIDENCE_REQUESTED'>('APPROVED');
  const [reviewNote, setReviewNote] = useState('Đã nghiệm thu hiện trường đạt yêu cầu cam kết bảo vệ môi trường.');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // We can fetch via actions list or detail
    api.actions.list().then(res => {
      for (const act of res.actions) {
        const sub = act.submissions?.find((s: any) => s.id === id);
        if (sub) {
          setSubmission({ ...sub, action_title: act.title, case_id: act.case_id });
          break;
        }
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    try {
      await api.actions.reviewRemediation(id, {
        review_status: reviewStatus,
        review_note: reviewNote,
      });

      success('Thẩm duyệt hoàn tất', `Báo cáo khắc phục đã được xác nhận "${reviewStatus}"`);
      navigate(submission ? `/cases/${submission.case_id}` : '/actions');
    } catch (err: any) {
      error('Lỗi', err.detail);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="civic-card p-12 text-center text-slate-400 text-sm animate-pulse">Đang nạp dữ liệu thẩm duyệt...</div>;
  }

  if (!submission) {
    return (
      <div className="civic-card p-12 text-center text-slate-500 text-sm">
        Không tìm thấy báo cáo khắc phục này.
        <div className="mt-3">
          <Link to="/actions"><Button variant="outline">Quay lại danh sách</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to={`/cases/${submission.case_id}`} className="text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase">Thẩm duyệt Báo cáo Khắc phục</span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">{submission.action_title}</h1>
        </div>
      </div>

      <div className="civic-card p-6 space-y-5">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800">Người nộp: {submission.submitted_by}</span>
            <span className="text-slate-400">{new Date(submission.submitted_at).toLocaleString('vi-VN')}</span>
          </div>
          <p className="text-sm font-medium text-slate-900 leading-relaxed">
            {submission.description}
          </p>
        </div>

        <form onSubmit={handleReview} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-2">
              Quyết định Thẩm định của Cán bộ Hiện trường <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setReviewStatus('APPROVED')}
                className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  reviewStatus === 'APPROVED'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" /> NGHIỆM THU ĐẠT
              </button>

              <button
                type="button"
                onClick={() => setReviewStatus('MORE_EVIDENCE_REQUESTED')}
                className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  reviewStatus === 'MORE_EVIDENCE_REQUESTED'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-50'
                }`}
              >
                <AlertCircle className="w-4 h-4" /> BỔ SUNG MINH CHỨNG
              </button>

              <button
                type="button"
                onClick={() => setReviewStatus('REJECTED')}
                className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  reviewStatus === 'REJECTED'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-white text-rose-800 border-rose-300 hover:bg-rose-50'
                }`}
              >
                <XCircle className="w-4 h-4" /> CHƯA ĐẠT (TÁI KIỂM)
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nhận xét & Hướng dẫn của cán bộ <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={reviewNote}
              onChange={e => setReviewNote(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Link to="/actions">
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </Link>
            <Button type="submit" variant="primary" loading={submitting}>
              Xác Nhận Đánh Giá Nghiệm Thu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
