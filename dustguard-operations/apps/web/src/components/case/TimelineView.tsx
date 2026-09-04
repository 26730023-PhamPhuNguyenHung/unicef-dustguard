import React from 'react';
import { CaseTimeline } from '@dustguard-operations/shared';
import { Clock, CheckCircle2, UserCheck, Shield, AlertCircle, FileText, Check, RotateCcw } from 'lucide-react';

export const TimelineView: React.FC<{ timeline: CaseTimeline[] }> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        Chưa có sự kiện nào được ghi nhận trên dòng thời gian.
      </div>
    );
  }

  const getEventIcon = (type: string, stage: string) => {
    switch (type) {
      case 'CASE_CREATED':
      case 'CASE_IMPORTED':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'STAFF_ASSIGNED':
      case 'STAFF_REASSIGNED':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'LEGAL_REVIEW_COMPLETED':
        return <Shield className="w-4 h-4 text-amber-600" />;
      case 'INSPECTION_SCHEDULED':
      case 'INSPECTION_SUBMITTED':
        return <CheckCircle2 className="w-4 h-4 text-teal-600" />;
      case 'ACTION_ISSUED':
      case 'REMEDIATION_SUBMITTED':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case 'CASE_CLOSED':
        return <Check className="w-4 h-4 text-emerald-700" />;
      case 'CASE_REOPENED':
        return <RotateCcw className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {timeline.map((item, idx) => (
        <div key={item.id || idx} className="relative group">
          {/* Timeline Dot */}
          <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center group-hover:border-slate-500 transition-colors shadow-xs">
            {getEventIcon(item.event_type, item.stage)}
          </div>

          <div className="civic-card p-4 hover:border-slate-300 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                  {item.stage || 'TIẾN TRÌNH'}
                </span>
                <span className="text-xs text-slate-600">
                  bởi <strong className="text-slate-800">{item.actor_name || 'Hệ thống'}</strong>
                  {item.actor_role && ` (${item.actor_role})`}
                </span>
              </div>
              <time className="text-xs text-slate-400 font-mono">
                {new Date(item.created_at).toLocaleString('vi-VN')}
              </time>
            </div>

            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
