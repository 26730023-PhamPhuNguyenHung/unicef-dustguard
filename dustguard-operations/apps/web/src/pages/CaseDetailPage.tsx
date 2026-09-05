import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CaseHeader } from '../components/case/CaseHeader';
import { StatusBadge } from '../components/case/StatusBadge';
import { TimelineView } from '../components/case/TimelineView';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import {
  RecordWorkspace,
  RecordHeader,
  RecordNavigation,
  RecordContent,
} from '../components/workspace';
import {
  FileText,
  Radio,
  Image,
  Shield,
  ClipboardCheck,
  Wrench,
  Clock,
  MapPin,
  Calendar,
  User,
  Plus,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Upload,
  ExternalLink,
  RotateCcw,
  FolderCheck,
  Printer,
  CheckSquare,
  ChevronDown,
  Check,
  MoreHorizontal,
  Scale,
} from 'lucide-react';
import { Case, CaseStatus, StaffAssignment } from '@dustguard-operations/shared';
import { DecisionSupportSection } from '../components/decision-support/DecisionSupportSection';

const TABS = [
  { id: 'overview', label: 'Tổng quan', icon: <FileText className="w-4 h-4" /> },
  { id: 'timeline', label: 'Dòng thời gian', icon: <Clock className="w-4 h-4" /> },
  { id: 'signals', label: 'Phản ánh', icon: <Radio className="w-4 h-4" /> },
  { id: 'iot', label: 'IoT Quan trắc', icon: <Radio className="w-4 h-4" /> },
  { id: 'legal', label: 'Pháp lý', icon: <Shield className="w-4 h-4" /> },
  { id: 'inspection', label: 'Kiểm tra', icon: <ClipboardCheck className="w-4 h-4" /> },
  { id: 'evidence', label: 'Bằng chứng', icon: <Image className="w-4 h-4" /> },
  { id: 'actions', label: 'Khắc phục', icon: <Wrench className="w-4 h-4" /> },
  { id: 'dossier', label: 'Hồ sơ', icon: <FolderCheck className="w-4 h-4" /> },
];

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, can } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [nextActionData, setNextActionData] = useState<any>(null);
  const [evidenceGaps, setEvidenceGaps] = useState<any[]>([]);
  const [iotDevices, setIotDevices] = useState<any[]>([]);

  // Modals state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [assignNote, setAssignNote] = useState('');

  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [closureReason, setClosureReason] = useState('Đã khắc phục hoàn toàn vi phạm và nghiệm thu đạt chuẩn');
  const [closureSummary, setClosureSummary] = useState('');

  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadSourceType, setUploadSourceType] = useState('CASE');

  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionTitle, setActionTitle] = useState('');
  const [actionDesc, setActionDesc] = useState('');
  const [actionParty, setActionParty] = useState('');
  const [actionDue, setActionDue] = useState('');

  // Create Task Modal State
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState('FIELD_INSPECTION');
  const [taskPriority, setTaskPriority] = useState('NORMAL');
  const [taskDue, setTaskDue] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [submittingTask, setSubmittingTask] = useState(false);
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) loadCaseDetail();
  }, [id]);

  const loadCaseDetail = async () => {
    try {
      setLoading(true);
      const res = await api.cases.get(id!);
      setCaseData(res);
      if (res.case.contractor_name) {
        setActionParty(res.case.contractor_name);
      }
      try {
        const na = await api.cases.nextAction(id!);
        setNextActionData(na);
      } catch {}
      try {
        const eg = await api.legal.evidenceGaps(id!);
        setEvidenceGaps(eg.gaps || []);
      } catch {}
      try {
        const devs = await api.iot.devices();
        setIotDevices(devs.devices || []);
      } catch {}
    } catch (err: any) {
      error('Lỗi tải dữ liệu', err.detail || 'Không tìm thấy hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssignModal = async () => {
    try {
      const res = await api.admin.users();
      const staffMembers = (res.users || []).filter(
        (u: any) => ['staff', 'inspector', 'admin', 'supervisor', 'legal'].includes(u.role) && u.active === 1
      );
      setStaffList(staffMembers);
      if (staffMembers.length > 0) {
        setSelectedStaffId(staffMembers[0].id);
      } else {
        setSelectedStaffId('');
      }
      setAssignModalOpen(true);
    } catch {
      error('Lỗi', 'Không thể lấy danh sách cán bộ');
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.cases.assign(caseData.case.id, {
        staff_user_id: selectedStaffId,
        assignment_type: 'PRIMARY',
        note: assignNote || 'Phân công thụ lý chính hồ sơ',
      });
      success('Phân công thành công', 'Cán bộ đã nhận thông báo phụ trách vụ việc');
      setAssignModalOpen(false);
      loadCaseDetail();
    } catch (err: any) {
      error('Phân công thất bại', err.detail);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenTaskModal = async () => {
    try {
      if (staffList.length === 0) {
        const res = await api.admin.users();
        const staffMembers = res.users.filter((u: any) => u.role === 'staff' && u.active === 1);
        setStaffList(staffMembers);
        if (staffMembers.length > 0) setTaskAssigneeId(staffMembers[0].id);
      }
      setTaskTitle(`Kiểm tra thực địa vụ việc ${caseData?.case?.case_code}`);
      setTaskModalOpen(true);
    } catch {
      setTaskModalOpen(true);
    }
  };

  const handleCreateTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setSubmittingTask(true);
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      await api.tasks.create({
        case_id: id,
        title: taskTitle,
        description: taskNotes || `Nhiệm vụ nghiệp vụ xử lý hồ sơ ${caseData?.case?.case_code}`,
        task_type: taskType,
        priority: taskPriority,
        due_at: taskDue || tomorrow,
        assigned_to: taskAssigneeId || undefined,
        notes: taskNotes,
      });
      success('Tạo nhiệm vụ thành công', 'Nhiệm vụ mới đã được chuyển vào hàng đợi vận hành');
      setTaskModalOpen(false);
      setTaskTitle('');
      setTaskNotes('');
      loadCaseDetail();
    } catch (err: any) {
      error('Lỗi tạo nhiệm vụ', err.detail);
    } finally {
      setSubmittingTask(false);
    }
  };

  const handleCloseCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.cases.close(caseData.case.id, {
        closure_reason: closureReason,
        closure_summary: closureSummary,
      });
      success('Đã đóng hồ sơ', 'Hồ sơ vụ việc đã kết thúc thành công');
      setCloseModalOpen(false);
      loadCaseDetail();
    } catch (err: any) {
      error('Chưa đủ điều kiện đóng', err.detail);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReopenCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.cases.reopen(caseData.case.id, {
        reopen_reason: reopenReason,
      });
      success('Đã mở lại hồ sơ', 'Hồ sơ đã chuyển sang trạng thái REOPENED');
      setReopenModalOpen(false);
      loadCaseDetail();
    } catch (err: any) {
      error('Lỗi mở lại hồ sơ', err.detail);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    setSubmitting(true);
    try {
      await api.evidence.upload(caseData.case.id, uploadFile, uploadSourceType);
      success('Tải ảnh thành công', 'Ảnh minh chứng kèm mã băm SHA-256 đã được lưu trữ.');
      setUploadModalOpen(false);
      setUploadFile(null);
      loadCaseDetail();
    } catch (err: any) {
      error('Lỗi tải ảnh', err.detail);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.actions.create(caseData.case.id, {
        title: actionTitle,
        description: actionDesc,
        responsible_party: actionParty,
        due_at: actionDue,
      });
      success('Ban hành thành công', 'Yêu cầu khắc phục đã được gửi đến đơn vị chịu trách nhiệm');
      setActionModalOpen(false);
      loadCaseDetail();
    } catch (err: any) {
      error('Lỗi tạo yêu cầu', err.detail);
    } finally {
      setSubmitting(false);
    }
  };

  // Dominant Primary Action triggered from CaseHeader (Section 37)
  const handlePrimaryCtaClick = async () => {
    const c = caseData.case as Case;
    switch (c.status) {
      case 'NEW':
        // Triage action: advance to TRIAGED
        try {
          await api.cases.transition(c.id, {
            to_status: 'TRIAGED',
            note: 'Cán bộ đã tiếp nhận và xác thực thông tin sơ bộ ban đầu.',
          });
          success('Đã phân loại vụ việc', 'Hồ sơ chuyển sang trạng thái TRIAGED');
          loadCaseDetail();
        } catch (err: any) {
          error('Thất bại', err.detail);
        }
        break;
      case 'TRIAGED':
        handleOpenAssignModal();
        break;
      case 'ASSIGNED':
      case 'LEGAL_REVIEW':
        // Navigate or open modal to plan inspection
        navigate(`/cases/${c.id}/inspection/new`);
        break;
      case 'INSPECTION_PLANNED':
        // If inspection exists, navigate to field inspection
        if (caseData.inspections.length > 0) {
          navigate(`/inspections/${caseData.inspections[0].id}`);
        } else {
          navigate(`/cases/${c.id}/inspection/new`);
        }
        break;
      case 'INSPECTION_IN_PROGRESS':
        if (caseData.inspections.length > 0) {
          navigate(`/inspections/${caseData.inspections[0].id}`);
        }
        break;
      case 'ACTION_REQUIRED':
        setActionModalOpen(true);
        break;
      case 'REMEDIATION':
        setActiveTab('actions');
        break;
      case 'REINSPECTION':
        navigate(`/cases/${c.id}/inspection/new`);
        break;
      case 'READY_TO_CLOSE':
        setCloseModalOpen(true);
        break;
      case 'CLOSED':
        setReopenModalOpen(true);
        break;
      default:
        setActiveTab('timeline');
        break;
    }
  };

  if (loading || !caseData) {
    return (
      <div className="civic-card p-12 text-center text-slate-400 animate-pulse text-sm">
        Đang tải thông tin chi tiết vụ việc...
      </div>
    );
  }

  const { case: currentCase, timeline, assignments, evidence, legalReviews, inspections, actions, closure } = caseData;

  const createdAtMs = new Date(currentCase.created_at).getTime();
  const slaDeadlineMs = createdAtMs + 48 * 3600 * 1000;
  const slaDiffHours = Math.round((slaDeadlineMs - Date.now()) / (3600 * 1000));
  const isSlaBreached = slaDiffHours < 0;

  const caseHealthChecklist = [
    {
      label: 'Bằng chứng số xác thực (SHA-256)',
      done: Boolean(evidence && evidence.length > 0),
      desc: evidence && evidence.length > 0 ? `${evidence.length} tệp đã niêm phong` : 'Chưa có tệp minh chứng',
    },
    {
      label: 'Căn cứ pháp lý (Nghị định 45/2022)',
      done: Boolean(legalReviews && legalReviews.length > 0),
      desc: legalReviews && legalReviews.length > 0 ? 'Đã rà soát khung xử lý' : 'Chờ chuyên viên thẩm tra',
    },
    {
      label: 'Kiểm tra thực địa hiện trường',
      done: Boolean(inspections && inspections.length > 0),
      desc: inspections && inspections.length > 0 ? `${inspections.length} đợt kiểm tra ghi nhận` : 'Chưa lập lịch kiểm tra',
    },
    {
      label: 'Biện pháp khắc phục nhà thầu',
      done: Boolean(actions && actions.length > 0 && actions.every((a: any) => a.status === 'VERIFIED')),
      desc: !actions || actions.length === 0
        ? 'Chưa yêu cầu biện pháp'
        : actions.every((a: any) => a.status === 'VERIFIED')
        ? 'Đã nghiệm thu đạt chuẩn'
        : `${actions.filter((a: any) => a.status !== 'VERIFIED').length} yêu cầu đang xử lý`,
    },
    {
      label: 'Điều kiện kết thúc vụ việc',
      done: currentCase.status === 'READY_TO_CLOSE' || currentCase.status === 'CLOSED',
      desc: currentCase.status === 'CLOSED'
        ? 'Hồ sơ đã lưu trữ'
        : currentCase.status === 'READY_TO_CLOSE'
        ? 'Đủ điều kiện đóng hồ sơ'
        : 'Cần hoàn tất các bước trên',
    },
  ];

  const RECORD_TABS = [
    { id: 'overview', label: 'Tổng quan', icon: <FileText className="w-4 h-4" /> },
    { id: 'decision-support', label: 'Hỗ trợ thẩm tra', icon: <Scale className="w-4 h-4" /> },
    { id: 'dossier', label: 'Hồ sơ', icon: <FolderCheck className="w-4 h-4" /> },
    { id: 'legal', label: 'Pháp lý', icon: <Shield className="w-4 h-4" /> },
    { id: 'inspection', label: 'Hiện trường', icon: <ClipboardCheck className="w-4 h-4" />, count: inspections?.length },
    { id: 'actions', label: 'Khắc phục', icon: <Wrench className="w-4 h-4" />, count: actions?.length },
    { id: 'timeline', label: 'Lịch sử', icon: <Clock className="w-4 h-4" /> },
    { id: 'evidence', label: 'Bằng chứng', icon: <Image className="w-4 h-4" />, count: evidence?.length },
    { id: 'iot', label: 'IoT Quan trắc', icon: <Radio className="w-4 h-4" /> },
    { id: 'signals', label: 'Phản ánh', icon: <Radio className="w-4 h-4" /> },
  ];

  return (
    <RecordWorkspace>
      {/* Standardized Record Header */}
      <RecordHeader
        backTo="/cases"
        backLabel="Danh sách vụ việc"
        code={currentCase.case_code || currentCase.id}
        status={currentCase.status}
        title={currentCase.title}
        metadata={
          <>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-ink-400" />
              <span>{currentCase.location_text}</span>
            </span>
            {currentCase.contractor_name && (
              <>
                <span className="text-ink-300">•</span>
                <span>Nhà thầu: <strong className="text-ink-700">{currentCase.contractor_name}</strong></span>
              </>
            )}
            <span className="text-ink-300">•</span>
            <span>Cập nhật: {new Date(currentCase.updated_at).toLocaleDateString('vi-VN')}</span>
          </>
        }
        primaryAction={
          <Button
            variant="primary"
            size="md"
            onClick={handlePrimaryCtaClick}
            className="shadow-xs font-semibold"
          >
            {nextActionData?.title || 'Xử lý vụ việc'}
          </Button>
        }
        badges={
          currentCase.priority === 'URGENT' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
              Khẩn cấp
            </span>
          )
        }
      />

      {/* Streamlined Operations Action Bar */}
      <div className="civic-card p-3 bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wider">
            Điều phối vụ việc:
          </span>
          <span className="text-xs font-medium text-ink-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {currentCase.status}
          </span>
        </div>
        <div className="flex items-center gap-2 relative">
          <Button
            variant="secondary"
            size="sm"
            icon={<User className="w-3.5 h-3.5" />}
            onClick={handleOpenAssignModal}
          >
            Phân công
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<FileText className="w-3.5 h-3.5" />}
            onClick={() => {
              const token = localStorage.getItem('dustguard_token');
              const url = `/api/cases/${currentCase.id}/decision-pack${token ? `?token=${encodeURIComponent(token)}` : ''}`;
              window.open(url, '_blank');
            }}
          >
            Xuất hồ sơ
          </Button>

          {/* More Actions Dropdown */}
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              icon={<ChevronDown className="w-3.5 h-3.5" />}
              onClick={() => setMoreActionsOpen(!moreActionsOpen)}
            >
              Thao tác khác
            </Button>
            {moreActionsOpen && (
              <div 
                className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-40 text-xs font-medium divide-y divide-slate-100"
                onMouseLeave={() => setMoreActionsOpen(false)}
              >
                <div className="py-1">
                  <button
                    onClick={() => { setMoreActionsOpen(false); handleOpenTaskModal(); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <CheckSquare className="w-4 h-4 text-slate-500" />
                    Tạo nhiệm vụ hiện trường
                  </button>
                  <button
                    onClick={() => { setMoreActionsOpen(false); navigate(`/cases/${currentCase.id}/legal`); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Shield className="w-4 h-4 text-slate-500" />
                    Thẩm tra pháp lý (NĐ 45)
                  </button>
                  <button
                    onClick={() => { setMoreActionsOpen(false); navigate(`/cases/${currentCase.id}/inspection/new`); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Calendar className="w-4 h-4 text-slate-500" />
                    Lên lịch kiểm tra thực địa
                  </button>
                  <button
                    onClick={() => { setMoreActionsOpen(false); setUploadModalOpen(true); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Upload className="w-4 h-4 text-slate-500" />
                    Thêm tài liệu / Bằng chứng
                  </button>
                </div>
                <div className="py-1">
                  {currentCase.status !== 'CLOSED' ? (
                    <button
                      onClick={() => { setMoreActionsOpen(false); setCloseModalOpen(true); }}
                      className="w-full px-3 py-2 text-left hover:bg-rose-50 flex items-center gap-2 text-rose-700 font-semibold"
                    >
                      <CheckCircle2 className="w-4 h-4 text-rose-600" />
                      Đóng vụ việc
                    </button>
                  ) : (
                    <button
                      onClick={() => { setMoreActionsOpen(false); setReopenModalOpen(true); }}
                      className="w-full px-3 py-2 text-left hover:bg-amber-50 flex items-center gap-2 text-amber-700 font-semibold"
                    >
                      <RotateCcw className="w-4 h-4 text-amber-600" />
                      Mở lại vụ việc
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Action Engine Banner */}
      {nextActionData && (
        <div className="civic-card p-4 border-l-4 border-l-dustguard-red bg-rose-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-dustguard-red font-mono">
                BƯỚC TIẾP THEO (NEXT ACTION)
              </span>
              <span className="text-xs font-bold text-slate-900">• {nextActionData.title}</span>
            </div>
            <p className="text-xs text-slate-600">{nextActionData.reason}</p>
            {nextActionData.blockingIssues && nextActionData.blockingIssues.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Vấn đề cần hoàn tất: {nextActionData.blockingIssues.join('; ')}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {nextActionData.route && (
              <Link to={nextActionData.route}>
                <Button variant="primary" size="sm">
                  {nextActionData.title}
                </Button>
              </Link>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const token = localStorage.getItem('dustguard_token');
                const url = `/api/cases/${currentCase.id}/decision-pack${token ? `?token=${encodeURIComponent(token)}` : ''}`;
                window.open(url, '_blank');
              }}
              icon={<FileText className="w-3.5 h-3.5" />}
            >
              Xuất Decision Pack
            </Button>
          </div>
        </div>
      )}

      {/* Record Navigation */}
      <RecordNavigation
        tabs={RECORD_TABS}
        activeTab={activeTab}
        onTabChange={tabId => setActiveTab(tabId)}
      />

      {/* Record Content */}
      <RecordContent>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Summary & Operational Status */}
          <div className="lg:col-span-2 space-y-6">
            <div className="civic-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Tóm tắt vụ việc (Case Summary)
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {currentCase.description}
              </p>
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Địa bàn hành chính:</span>
                  <span className="font-semibold text-slate-800">{currentCase.district}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Nhà thầu / Đối tượng thi công:</span>
                  <span className="font-semibold text-slate-800">{currentCase.contractor_name || 'Đang cập nhật'}</span>
                </div>
              </div>
            </div>

            {/* Legal Status Overview */}
            <div className="civic-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-dustguard-teal" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Thẩm tra Pháp lý (Legal Intelligence)
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs h-7 bg-teal-700 hover:bg-teal-800 text-white"
                    onClick={() => setActiveTab('decision-support')}
                  >
                    Hỗ trợ thẩm tra &rarr;
                  </Button>
                  <Link to={`/cases/${currentCase.id}/legal`}>
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      Mở Legal Workspace
                    </Button>
                  </Link>
                </div>
              </div>

              {legalReviews.length > 0 ? (
                <div className="bg-teal-50/50 p-3.5 rounded-lg border border-teal-200 text-xs text-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-dustguard-teal">
                    <span>Trạng thái: {legalReviews[0].status}</span>
                    <span>Thẩm định: {legalReviews[0].reviewer_name}</span>
                  </div>
                  <p className="font-medium text-slate-700">{legalReviews[0].summary}</p>
                  {legalReviews[0].legal_basis_note && (
                    <p className="text-slate-500 font-mono text-[11px]">
                      Căn cứ: {legalReviews[0].legal_basis_note}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-200 flex items-center justify-between">
                  <span>Chưa có biên bản thẩm tra pháp lý chính thức.</span>
                  <Link to={`/cases/${currentCase.id}/legal`}>
                    <span className="text-dustguard-teal font-semibold hover:underline">
                      Tiến hành phân tích &rarr;
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* Inspection & Open Actions Summary */}
            <div className="civic-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Hiện trường & Yêu cầu Khắc phục
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 block">Đợt kiểm tra hiện trường:</span>
                  <span className="text-base font-bold text-slate-900 block mt-1">
                    {inspections.length} đợt
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {inspections.filter((i: any) => i.status === 'COMPLETED').length} đã hoàn thành biên bản
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 block">Yêu cầu khắc phục (Actions):</span>
                  <span className="text-base font-bold text-slate-900 block mt-1">
                    {actions.length} yêu cầu
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {actions.filter((a: any) => ['OPEN', 'IN_PROGRESS', 'SUBMITTED'].includes(a.status)).length} đang mở
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Current Stage, Assignee, Case Health Checklist, Evidence */}
          <div className="space-y-6">
            {/* Next Recommended Operational Action */}
            <div className="civic-card p-5 border-l-4 border-dustguard-red space-y-3 bg-red-50/20">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase text-dustguard-red tracking-wider">
                  Hành động khuyến nghị
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                  currentCase.status === 'CLOSED'
                    ? 'bg-slate-100 text-slate-700 border-slate-200'
                    : isSlaBreached
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {currentCase.status === 'CLOSED'
                    ? 'Đã kết thúc'
                    : isSlaBreached
                    ? `Trễ hạn ${Math.abs(slaDiffHours)}h (SLA 48h)`
                    : `Còn ${slaDiffHours}h (SLA 48h)`}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 leading-snug">
                {currentCase.status === 'NEW' && 'Cán bộ cần tiếp nhận hồ sơ, kiểm tra sơ bộ thông tin và chuyển sang TRIAGED.'}
                {currentCase.status === 'TRIAGED' && 'Lãnh đạo điều phối phân công cán bộ thụ lý chính cho vụ việc.'}
                {currentCase.status === 'ASSIGNED' && 'Cán bộ lập lịch kiểm tra hiện trường hoặc gửi yêu cầu thẩm tra pháp lý.'}
                {currentCase.status === 'LEGAL_REVIEW' && 'Chuyên viên pháp chế đối chiếu khung xử phạt Nghị định 45/2022.'}
                {currentCase.status === 'INSPECTION_PLANNED' && 'Đến công trình thực hiện checklist kiểm tra bằng thiết bị di động.'}
                {currentCase.status === 'INSPECTION_IN_PROGRESS' && 'Đánh giá các tiêu chí bắt buộc và nộp biên bản hoàn thành.'}
                {currentCase.status === 'ACTION_REQUIRED' && 'Ban hành thông báo yêu cầu nhà thầu khắc phục trong 48h.'}
                {currentCase.status === 'REMEDIATION' && 'Thẩm duyệt hình ảnh báo cáo khắc phục của nhà thầu.'}
                {currentCase.status === 'REINSPECTION' && 'Tái kiểm tra đột xuất hiện trường để đối chứng kết quả sửa chữa.'}
                {currentCase.status === 'READY_TO_CLOSE' && 'Ký biên bản kết thúc và đóng hồ sơ vụ việc.'}
                {currentCase.status === 'CLOSED' && 'Vụ việc đã khép kín toàn bộ quy trình.'}
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={handlePrimaryCtaClick}
                className="w-full mt-2 font-semibold"
              >
                Thực hiện hành động này
              </Button>
            </div>

            {/* Case Health Checklist */}
            <div className="civic-card p-5 space-y-3 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tình trạng hồ sơ vụ việc
                </span>
                <span className="text-[11px] font-semibold text-slate-500 font-mono">
                  {caseHealthChecklist.filter(item => item.done).length}/{caseHealthChecklist.length} tiêu chuẩn
                </span>
              </div>
              <div className="space-y-2.5 pt-1">
                {caseHealthChecklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">
                      {item.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold leading-tight ${item.done ? 'text-slate-800' : 'text-slate-500'}`}>
                        {item.label}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-none">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignee Card */}
            <div className="civic-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Cán bộ phụ trách</span>
                {can('case:assign') && (
                  <button
                    onClick={handleOpenAssignModal}
                    className="text-xs text-dustguard-red font-semibold hover:underline"
                  >
                    {currentCase.assigned_staff_id ? 'Điều chuyển' : 'Phân công'}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                  {currentCase.assigned_staff_name ? currentCase.assigned_staff_name.charAt(0) : '?'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {currentCase.assigned_staff_name || 'Chưa phân công'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {currentCase.assigned_staff_id ? 'Cán bộ thụ lý chính' : 'Chờ lãnh đạo giao việc'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Evidence Preview */}
            <div className="civic-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Minh chứng gần nhất</span>
                <button onClick={() => setActiveTab('evidence')} className="text-xs text-dustguard-red font-semibold">
                  Xem tất cả ({evidence.length})
                </button>
              </div>
              {evidence.length > 0 ? (
                <div className="space-y-2">
                  <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-video flex items-center justify-center">
                    <img
                      src={evidence[0].file_path}
                      alt={evidence[0].file_name}
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="80"><rect width="100" height="80" fill="%23f1f5f9"/><text x="50" y="45" font-size="12" fill="%2394a3b8" text-anchor="middle">Ảnh minh chứng</text></svg>';
                      }}
                    />
                  </div>
                  {evidence[0].sha256_hash && (
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                      <span>SHA-256: {evidence[0].sha256_hash.slice(0, 8)}...{evidence[0].sha256_hash.slice(-6)}</span>
                      <span className="text-emerald-700 font-sans font-semibold text-[10px]">ĐÃ XÁC THỰC</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded border border-slate-200">
                  Chưa có ảnh minh chứng.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: DECISION SUPPORT (HỖ TRỢ THẨM TRA) */}
      {activeTab === 'decision-support' && (
        <DecisionSupportSection
          caseId={currentCase.id}
          onRefreshCase={loadCaseDetail}
        />
      )}

      {/* TAB 2: SIGNALS */}
      {activeTab === 'signals' && (
        <div className="civic-card p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Tín hiệu & Nguồn tin Báo cáo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-1">Nguồn tiếp nhận thông tin:</span>
              <strong className="text-sm text-slate-800">{currentCase.source}</strong>
              <p className="text-slate-400 text-[11px] mt-1">Mã tham chiếu: {currentCase.source_reference || 'Không có'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-1">Số lượt phản ánh từ người dân:</span>
              <strong className="text-sm text-slate-800">{currentCase.source_report_count} phản ánh</strong>
              <p className="text-slate-400 text-[11px] mt-1">Đã kiểm chứng vị trí địa lý GPS</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-1">Tọa độ WGS84:</span>
              <strong className="text-sm font-mono text-slate-800">
                {currentCase.latitude}, {currentCase.longitude}
              </strong>
              <p className="text-slate-400 text-[11px] mt-1">Hệ tọa độ chuẩn xác thực địa</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EVIDENCE */}
      {activeTab === 'evidence' && (
        <div className="civic-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Kho Minh chứng & Dữ liệu Số</h3>
              <p className="text-xs text-slate-500">Toàn bộ tệp ảnh được băm mã SHA-256 Web Crypto đối chứng tính toàn vẹn</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => setUploadModalOpen(true)}
            >
              Tải ảnh minh chứng mới
            </Button>
          </div>

          {evidence.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Hồ sơ này chưa có tệp minh chứng nào được tải lên.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {evidence.map((ev: any) => (
                <div key={ev.id} className="civic-card overflow-hidden border border-slate-200 flex flex-col">
                  <div className="aspect-video bg-slate-100 relative">
                    <img
                      src={ev.file_path}
                      alt={ev.file_name}
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="80"><rect width="100" height="80" fill="%23f1f5f9"/><text x="50" y="45" font-size="12" fill="%2394a3b8" text-anchor="middle">Tệp chứng cứ</text></svg>';
                      }}
                    />
                    <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {ev.source_type}
                    </span>
                  </div>
                  <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800 truncate">{ev.file_name}</p>
                      <p className="text-slate-400 text-[11px]">Bởi: {ev.uploaded_by_name}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-mono truncate" title={ev.sha256}>
                        SHA-256: {ev.sha256 ? `${ev.sha256.substring(0, 16)}...` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: LEGAL */}
      {activeTab === 'legal' && (
        <div className="civic-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Không gian Thẩm tra Pháp lý (Legal Space)</h3>
              <p className="text-xs text-slate-500">Đối chiếu điều khoản luật và xác lập căn cứ pháp lý vi phạm</p>
            </div>
            <Link to={`/cases/${currentCase.id}/legal`}>
              <Button variant="primary" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
                Mở Giao diện 3 Cột Toàn Màn hình
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {legalReviews.map((lr: any) => (
              <div key={lr.id} className="p-4 bg-teal-50/40 rounded-lg border border-teal-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-teal-900">
                  <span>Kết luận: {lr.status}</span>
                  <span>Chuyên viên: {lr.reviewer_name}</span>
                </div>
                <p className="text-sm font-medium text-slate-800">{lr.summary}</p>
                {lr.legal_basis_note && (
                  <p className="text-slate-600 bg-white p-2.5 rounded border border-teal-100 font-mono text-[11px]">
                    Căn cứ pháp lý: {lr.legal_basis_note}
                  </p>
                )}
                <time className="text-[11px] text-slate-400 block">
                  Ngày thẩm định: {new Date(lr.created_at).toLocaleString('vi-VN')}
                </time>
              </div>
            ))}
          </div>

          {/* Evidence Gaps (Section 25 & 32: Khung xem xét dự kiến & Thông tin còn thiếu) */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Khung xem xét dự kiến & Thông tin cần thu thập bổ sung ({evidenceGaps.length})
            </h4>
            {evidenceGaps.length === 0 ? (
              <p className="text-xs text-slate-500">Hồ sơ pháp lý cơ bản đầy đủ, không ghi nhận thiếu hụt chứng cứ trọng yếu.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {evidenceGaps.map((gap: any, gIdx: number) => (
                  <div key={gIdx} className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-xs space-y-1">
                    <span className="font-bold text-amber-900 block">{gap.description}</span>
                    <p className="text-amber-800 text-[11px]">{gap.reason}</p>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      Biện pháp thu thập: {gap.suggestedCollectionMethod || 'Kiểm tra hiện trường & Chụp ảnh'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: IOT (Section 15 & 48) */}
      {activeTab === 'iot' && (
        <div className="civic-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Mạng lưới Cảm biến Quan trắc Khả nghi liên quan</h3>
              <p className="text-xs text-slate-500">
                Đối soát dữ liệu vi khí hậu và nồng độ PM2.5 / PM10 thực thu từ các trạm quan trắc xung quanh hiện trường vụ việc
              </p>
            </div>
            <Link to="/iot">
              <Button variant="outline" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
                Xem Toàn bộ Trạm IoT
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {iotDevices.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Chưa có trạm quan trắc nào trong khu vực này.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {iotDevices.slice(0, 4).map(dev => (
                  <div key={dev.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-800">{dev.device_code}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        dev.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {dev.status}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900">{dev.name}</p>
                    <p className="text-slate-500 text-[11px]">{dev.location_text}</p>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                      <span>PM2.5: <strong className="text-rose-600">{dev.latest_pm25 ?? '--'}</strong> µg/m³</span>
                      <span>PM10: <strong>{dev.latest_pm10 ?? '--'}</strong> µg/m³</span>
                      <Link to={`/iot/devices/${dev.id}`} className="text-dustguard-teal font-semibold hover:underline">
                        Chi tiết trạm →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: INSPECTION */}
      {activeTab === 'inspection' && (
        <div className="civic-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Đợt Kiểm tra Hiện trường</h3>
              <p className="text-xs text-slate-500">Lịch thanh tra, biên bản kiểm tra và đánh giá tiêu chí</p>
            </div>
            <Link to={`/cases/${currentCase.id}/inspection/new`}>
              <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
                Lập kế hoạch kiểm tra mới
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {inspections.map((insp: any) => (
              <div key={insp.id} className="civic-card p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{insp.template_name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${insp.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {insp.status}
                    </span>
                  </div>
                  <p className="text-slate-600">Cán bộ kiểm tra: <strong>{insp.inspector_name}</strong> | Loại: {insp.inspection_type}</p>
                  <p className="text-slate-400">Ngày dự kiến: {insp.scheduled_date} | Thực tế: {insp.performed_at || 'Chưa thực hiện'}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/inspections/${insp.id}`}>
                    <Button variant="outline" size="sm">
                      {insp.status === 'COMPLETED' ? 'Xem kết quả' : 'Mở Field Check'} &rarr;
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ACTIONS */}
      {activeTab === 'actions' && (
        <div className="civic-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Yêu cầu Khắc phục & Nghiệm thu</h3>
              <p className="text-xs text-slate-500">Biện pháp khắc phục đã ban hành cho nhà thầu và tiến độ nghiệm thu</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setActionModalOpen(true)}
            >
              Tạo yêu cầu khắc phục
            </Button>
          </div>

          <div className="space-y-4">
            {actions.map((act: any) => (
              <div key={act.id} className="civic-card p-4 border border-slate-200 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 text-sm">{act.title}</span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    act.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {act.status}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">{act.description}</p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-slate-500">
                  <span>Đơn vị chịu trách nhiệm: <strong className="text-slate-800">{act.responsible_party}</strong></span>
                  <span>Hạn chót: <strong className="text-rose-700">{act.due_at}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="civic-card p-6">
          <h3 className="text-base font-bold text-slate-900 mb-6">Dòng thời gian Vụ việc (SSOT Timeline)</h3>
          <TimelineView timeline={timeline} />
        </div>
      )}

      {/* TAB 9: DOSSIER (Hồ sơ Vụ việc & Quyết định xử lý) */}
      {activeTab === 'dossier' && (
        <div className="civic-card p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FolderCheck className="w-5 h-5 text-dustguard-teal" />
                <h3 className="text-base font-bold text-slate-900">Hồ Sơ Nghiệp Vụ Vụ Việc (Case Dossier & Decision Pack)</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Tập hợp toàn bộ chứng cứ pháp lý, biên bản hiện trường và tiến trình xử lý vụ việc</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Printer className="w-4 h-4" />}
                onClick={() => window.print()}
              >
                In Hồ Sơ
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<FileText className="w-4 h-4" />}
                onClick={() => {
                  const token = localStorage.getItem('dustguard_token');
                  const url = `/api/cases/${currentCase.id}/decision-pack${token ? `?token=${encodeURIComponent(token)}` : ''}`;
                  window.open(url, '_blank');
                }}
              >
                Tải Decision Pack JSON
              </Button>
            </div>
          </div>

          {/* Dossier sections grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* 1. Legal Review Summary */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                1. Thẩm tra Pháp lý & Căn cứ Xử lý
              </span>
              {legalReviews.length > 0 ? (
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">Trạng thái: <span className="text-dustguard-teal">{legalReviews[0].status}</span></p>
                  <p className="text-slate-700">{legalReviews[0].summary}</p>
                  {legalReviews[0].legal_basis_note && (
                    <p className="text-slate-500 font-mono text-[11px]">Căn cứ: {legalReviews[0].legal_basis_note}</p>
                  )}
                  <p className="text-[11px] text-slate-400">Chuyên viên: {legalReviews[0].reviewer_name}</p>
                </div>
              ) : (
                <p className="text-slate-400 italic">Chưa có kết luận thẩm tra pháp lý.</p>
              )}
            </div>

            {/* 2. Field Inspections Summary */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                2. Thanh tra Hiện trường ({inspections.length} đợt)
              </span>
              {inspections.length > 0 ? (
                <div className="space-y-1.5">
                  {inspections.map((insp: any) => (
                    <div key={insp.id} className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">{insp.template_name}</p>
                        <p className="text-[11px] text-slate-500">Ngày: {insp.scheduled_date} • Cán bộ: {insp.inspector_name}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        insp.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {insp.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic">Chưa có đợt kiểm tra hiện trường nào.</p>
              )}
            </div>

            {/* 3. Evidence Integrity Summary */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                3. Toàn vẹn Bằng chứng Số ({evidence.length} tệp)
              </span>
              {evidence.length > 0 ? (
                <div className="space-y-1">
                  <p className="text-slate-700">Tất cả tệp minh chứng đều được tính toán mã băm SHA-256 đối chứng.</p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {evidence.map((ev: any) => (
                      <div key={ev.id} className="text-[11px] font-mono text-slate-600 bg-white p-1.5 rounded border border-slate-200 truncate">
                        ✓ {ev.file_name} [{ev.source_type}] - {ev.sha256.substring(0, 16)}...
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 italic">Chưa có bằng chứng số nào được tải lên.</p>
              )}
            </div>

            {/* 4. Remediation & Closure Summary */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                4. Khắc phục & Nghiệm thu ({actions.length} yêu cầu)
              </span>
              {actions.length > 0 ? (
                <div className="space-y-1">
                  {actions.map((act: any) => (
                    <div key={act.id} className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                      <span className="font-medium text-slate-800 truncate">{act.title}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        act.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {act.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic">Không có yêu cầu khắc phục nào được ghi nhận.</p>
              )}
              {closure && (
                <div className="pt-2 border-t border-slate-200 text-emerald-800">
                  <p className="font-bold">Đã đóng vụ việc ngày: {closure.closed_at}</p>
                  <p className="text-[11px]">Lý do: {closure.closure_reason}</p>
                  <p className="text-[11px]">Người ký duyệt: {closure.closed_by_name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN STAFF */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Phân Công Cán Bộ Thụ Lý Vụ Việc"
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs sm:text-sm">
          {staffList.length === 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                Chưa có cán bộ phù hợp
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hệ thống chưa ghi nhận tài khoản cán bộ vận hành nào. Vui lòng tạo tài khoản cán bộ mới tại danh mục Quản lý Người dùng để thực hiện phân công vụ việc.
              </p>
              <div className="pt-1">
                <Link
                  to="/admin/users"
                  className="inline-flex items-center text-xs font-semibold text-dustguard-red hover:underline"
                >
                  Quản lý nhân sự & Người dùng &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Chọn Cán bộ tiếp nhận <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={selectedStaffId}
                onChange={e => setSelectedStaffId(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-dustguard-red"
              >
                {staffList.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.full_name} ({st.department}) - Đang thụ lý: {st.assigned_cases_count || 0} hồ sơ
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ghi chú chỉ đạo</label>
            <textarea
              rows={3}
              value={assignNote}
              onChange={e => setAssignNote(e.target.value)}
              placeholder="Yêu cầu cán bộ khẩn trương kiểm tra thực địa..."
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setAssignModalOpen(false)}>
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={staffList.length === 0}
            >
              Xác nhận Phân công
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: CLOSE CASE */}
      <Modal
        isOpen={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        title="Ký Quyết Định Đóng Hồ Sơ Vụ Việc"
        maxWidth="lg"
      >
        <form onSubmit={handleCloseCase} className="space-y-4 text-xs sm:text-sm">
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs">
            <p className="font-bold mb-1">Điều kiện tiên quyết trước khi đóng:</p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              <li>Tất cả đợt kiểm tra hiện trường đã hoàn tất biên bản.</li>
              <li>Toàn bộ yêu cầu khắc phục (Actions) đã được nghiệm thu (0 vi phạm mở).</li>
              <li>Đã có ý kiến thẩm tra pháp lý chính thức.</li>
            </ul>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Lý do kết thúc vụ việc</label>
            <input
              type="text"
              required
              value={closureReason}
              onChange={e => setClosureReason(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tóm tắt kết quả xử lý và căn cứ đóng hồ sơ</label>
            <textarea
              required
              rows={4}
              value={closureSummary}
              onChange={e => setClosureSummary(e.target.value)}
              placeholder="Ghi nhận đơn vị đã hoàn tất sửa chữa, chấp hành hình thức xử phạt theo quy định..."
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setCloseModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Ký Quyết Định Đóng Hồ Sơ
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: REOPEN CASE */}
      <Modal
        isOpen={reopenModalOpen}
        onClose={() => setReopenModalOpen(false)}
        title="Mở Lại Hồ Sơ Vụ Việc Đã Đóng"
      >
        <form onSubmit={handleReopenCase} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Lý do mở lại hồ sơ</label>
            <textarea
              required
              rows={3}
              value={reopenReason}
              onChange={e => setReopenReason(e.target.value)}
              placeholder="Có phản ánh tái vi phạm hoặc có tình tiết chứng cứ mới..."
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setReopenModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="danger" loading={submitting}>
              Xác nhận Mở lại Vụ việc
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: UPLOAD EVIDENCE */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Tải Ảnh Minh Chứng Hiện Trường"
      >
        <form onSubmit={handleUploadEvidence} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Chọn ảnh minh chứng (JPG, PNG, SVG)</label>
            <input
              type="file"
              required
              accept="image/*"
              onChange={e => setUploadFile(e.target.files?.[0] || null)}
              className="w-full p-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nguồn minh chứng</label>
            <select
              value={uploadSourceType}
              onChange={e => setUploadSourceType(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white"
            >
              <option value="CASE">Minh chứng phản ánh ban đầu (CASE)</option>
              <option value="INSPECTION">Ảnh thực địa kiểm tra (INSPECTION)</option>
              <option value="REMEDIATION">Ảnh nghiệm thu khắc phục (REMEDIATION)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setUploadModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" loading={submitting} disabled={!uploadFile}>
              Tải lên & Tính mã SHA-256
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: CREATE CORRECTIVE ACTION */}
      <Modal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        title="Ban Hành Yêu Cầu Khắc Phục Vi Phạm"
      >
        <form onSubmit={handleCreateAction} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tiêu đề yêu cầu</label>
            <input
              type="text"
              required
              value={actionTitle}
              onChange={e => setActionTitle(e.target.value)}
              placeholder="VD: Lắp đặt lưới chắn bụi và sửa chữa trạm rửa xe..."
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nội dung khắc phục chi tiết</label>
            <textarea
              required
              rows={3}
              value={actionDesc}
              onChange={e => setActionDesc(e.target.value)}
              placeholder="Yêu cầu đơn vị thi công phải giăng lưới 3 lớp phủ kín mặt tiền..."
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Đơn vị chịu trách nhiệm</label>
              <input
                type="text"
                required
                value={actionParty}
                onChange={e => setActionParty(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hạn chót hoàn thành</label>
              <input
                type="date"
                required
                value={actionDue}
                onChange={e => setActionDue(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setActionModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Ban Hành Yêu Cầu
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: CREATE OPERATIONAL TASK */}
      <Modal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        title="Tạo Nhiệm Vụ Vận Hành Mới"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tiêu đề nhiệm vụ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
              placeholder="VD: Kiểm tra thực địa tại công trình..."
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Loại nhiệm vụ</label>
              <select
                value={taskType}
                onChange={e => setTaskType(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-dustguard-red text-xs sm:text-sm"
              >
                <option value="FIELD_INSPECTION">Kiểm tra hiện trường (FIELD_INSPECTION)</option>
                <option value="VERIFICATION">Xác minh thông tin (VERIFICATION)</option>
                <option value="LEGAL_REVIEW">Rà soát pháp lý (LEGAL_REVIEW)</option>
                <option value="CHECKLIST_PREP">Chuẩn bị checklist (CHECKLIST_PREP)</option>
                <option value="EVIDENCE_COLLECTION">Thu thập bằng chứng (EVIDENCE_COLLECTION)</option>
                <option value="CONTRACTOR_LIAISON">Liên hệ nhà thầu (CONTRACTOR_LIAISON)</option>
                <option value="REMEDIATION_FOLLOWUP">Theo dõi khắc phục (REMEDIATION_FOLLOWUP)</option>
                <option value="REINSPECTION">Tái kiểm tra (REINSPECTION)</option>
                <option value="DOSSIER_COMPLETION">Hoàn thiện hồ sơ (DOSSIER_COMPLETION)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mức độ ưu tiên</label>
              <select
                value={taskPriority}
                onChange={e => setTaskPriority(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-dustguard-red text-xs sm:text-sm"
              >
                <option value="LOW">Thấp (LOW)</option>
                <option value="NORMAL">Bình thường (NORMAL)</option>
                <option value="HIGH">Cao (HIGH)</option>
                <option value="URGENT">Khẩn cấp (URGENT)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cán bộ phụ trách</label>
              <select
                value={taskAssigneeId}
                onChange={e => setTaskAssigneeId(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-dustguard-red text-xs sm:text-sm"
              >
                <option value="">-- Chưa giao (Hàng đợi chung) --</option>
                {staffList.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.full_name} ({st.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hạn hoàn thành</label>
              <input
                type="date"
                value={taskDue}
                onChange={e => setTaskDue(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ghi chú chỉ đạo</label>
            <textarea
              rows={3}
              value={taskNotes}
              onChange={e => setTaskNotes(e.target.value)}
              placeholder="Yêu cầu cụ thể cho cán bộ xử lý..."
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red text-xs sm:text-sm"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setTaskModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" loading={submittingTask}>
              Tạo Nhiệm Vụ
            </Button>
          </div>
        </form>
      </Modal>
    </RecordContent>
    </RecordWorkspace>
  );
};
