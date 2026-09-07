import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Send, 
  Wrench, 
  Award,
  AlertCircle
} from 'lucide-react';

export interface TimelineStep {
  id: string;
  label: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  timestamp?: string;
}

interface ProcessingTimelineProps {
  currentStatus?: string;
  isLinkedCase?: boolean;
  className?: string;
}

export const ProcessingTimeline: React.FC<ProcessingTimelineProps> = ({
  currentStatus = 'submitted',
  isLinkedCase = false,
  className = ''
}) => {
  // Chuẩn hóa status thành nấc tương ứng (1 -> 6)
  // 1: Đã ghi nhận
  // 2: Đang chuẩn hóa thông tin
  // 3: Đang xem xét
  // 4: Đã chuyển xử lý
  // 5: Đang cập nhật
  // 6: Đã có kết quả
  const s = (currentStatus || '').toLowerCase();

  let activeIndex = 1; // mặc định đã ghi nhận
  if (['draft'].includes(s)) {
    activeIndex = 0;
  } else if (['submitted', 'new'].includes(s)) {
    activeIndex = isLinkedCase ? 2 : 1;
  } else if (['reviewing', 'triaged', 'community_verifying'].includes(s)) {
    activeIndex = 2;
  } else if (['verified', 'confirmed_signal', 'ready_for_assignment'].includes(s)) {
    activeIndex = 3;
  } else if (['forwarded', 'assigned', 'inspection_planned', 'inspection_in_progress'].includes(s)) {
    activeIndex = 4;
  } else if (['in_progress', 'action_required', 'remediation', 'reinspection', 'waiting_update'].includes(s)) {
    activeIndex = 5;
  } else if (['resolved', 'closed', 'ready_to_close', 'archived', 'accepted'].includes(s)) {
    activeIndex = 6;
  }

  const steps: { label: string; desc: string; icon: React.ReactNode }[] = [
    {
      label: 'Đã ghi nhận',
      desc: 'Tín hiệu ghi nhận vào hệ thống',
      icon: <Send className="w-4 h-4" />
    },
    {
      label: 'Đang chuẩn hóa',
      desc: 'Đối soát vị trí & lập hồ sơ theo dõi',
      icon: <FileText className="w-4 h-4" />
    },
    {
      label: 'Đang xem xét',
      desc: 'Kiểm tra bằng chứng & mức ưu tiên',
      icon: <Layers className="w-4 h-4" />
    },
    {
      label: 'Đã chuyển xử lý',
      desc: 'Chuyển thông tin tới cán bộ phụ trách',
      icon: <ShieldCheck className="w-4 h-4" />
    },
    {
      label: 'Đang cập nhật',
      desc: 'Hiện trường triển khai giải pháp dập bụi',
      icon: <Wrench className="w-4 h-4" />
    },
    {
      label: 'Đã có kết quả',
      desc: 'Nghiệm thu hoàn tất khắc phục',
      icon: <CheckCircle2 className="w-4 h-4" />
    }
  ];

  return (
    <div className={`bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 mb-5 border-b border-border-subtle">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-0.5 rounded-full inline-block">
            Tiến trình xử lý minh bạch
          </span>
          <h3 className="text-base font-bold text-content-main mt-1">
            Phản ánh của bạn đang được theo dõi
          </h3>
        </div>
        <div className="text-xs text-content-sub flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-content-muted" />
          <span>Cập nhật theo chuỗi sự kiện thực tế</span>
        </div>
      </div>

      {/* Desktop / Tablet Timeline (Horizontal) */}
      <div className="hidden md:grid md:grid-cols-6 gap-2 relative">
        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isDone = stepNumber < activeIndex;
          const isCurrent = stepNumber === activeIndex;

          return (
            <div key={idx} className="flex flex-col items-center text-center relative group">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-0.5 -z-0 transition-colors ${
                    stepNumber < activeIndex ? 'bg-primary' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Node Icon Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all shadow-xs ${
                  isDone
                    ? 'bg-primary text-white'
                    : isCurrent
                    ? 'bg-primary-light text-primary border-2 border-primary ring-4 ring-primary/10'
                    : 'bg-slate-100 text-content-muted border border-slate-200'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.icon}
              </div>

              {/* Step Label */}
              <span
                className={`mt-2.5 text-xs font-bold leading-snug transition-colors text-pretty ${
                  isCurrent
                    ? 'text-primary'
                    : isDone
                    ? 'text-content-main'
                    : 'text-content-muted'
                }`}
              >
                {step.label}
              </span>

              {/* Step Description */}
              <span className="text-[10px] text-content-sub mt-0.5 line-clamp-2 leading-tight">
                {step.desc}
              </span>

              {isCurrent && (
                <span className="mt-1.5 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                  Đang diễn ra
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Timeline (Vertical) */}
      <div className="md:hidden space-y-3">
        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isDone = stepNumber < activeIndex;
          const isCurrent = stepNumber === activeIndex;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                isCurrent
                  ? 'bg-primary-light/50 border border-primary/30'
                  : isDone
                  ? 'bg-surface-secondary/40'
                  : 'opacity-60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                  isDone
                    ? 'bg-primary text-white'
                    : isCurrent
                    ? 'bg-primary text-white ring-2 ring-primary/20'
                    : 'bg-slate-200 text-content-muted'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-primary'
                        : isDone
                        ? 'text-content-main'
                        : 'text-content-muted'
                    }`}
                  >
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      Hiện tại
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[10px] text-primary font-medium">Hoàn tất</span>
                  )}
                </div>
                <p className="text-[11px] text-content-sub mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] text-content-sub">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Hồ sơ theo dõi minh bạch vì cộng đồng
        </span>
        <span className="text-content-muted">
          Không phải văn bản xử phạt hành chính
        </span>
      </div>
    </div>
  );
};
