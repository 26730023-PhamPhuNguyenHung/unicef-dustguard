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
  Upload,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { Case, CaseStatus, StaffAssignment } from '@dustguard-operations/shared';

const TABS = [
  { id: 'overview', label: 'Tổng quan', icon: <FileText className="w-4 h-4" /> },
  { id: 'signals', label: 'Tín hiệu', icon: <Radio className="w-4 h-4" /> },
  { id: 'evidence', label: 'Bằng chứng', icon: <Image className="w-4 h-4" /> },
  { id: 'legal', label: 'Pháp lý', icon: <Shield className="w-4 h-4" /> },
  { id: 'inspection', label: 'Kiểm tra', icon: <ClipboardCheck className="w-4 h-4" /> },
  { id: 'actions', label: 'Khắc phục', icon: <Wrench className="w-4 h-4" /> },
  { id: 'timeline', label: 'Dòng thời gian', icon: <Clock className="w-4 h-4" /> },
];

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, can } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

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
    } catch (err: any) {
      error('Lỗi tải dữ liệu', err.detail || 'Không tìm thấy hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssignModal = async () => {
    try {
      const res = await api.admin.users();
      const staffMembers = res.users.filter((u: any) => u.role === 'staff' && u.active === 1);
      setStaffList(staffMembers);
      if (staffMembers.length > 0) setSelectedStaffId(staffMembers[0].id);
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

  return (
    <div className="space-y-6">
      {/* Case Header (Section 37) */}
      <CaseHeader
        caseData={currentCase}
        onPrimaryAction={handlePrimaryCtaClick}
        onSecondaryAction={() => handleOpenAssignModal()}
      />

      {/* 7 Tabs (Section 9) */}
      <div className="border-b border-slate-200 overflow-x-auto scrollbar-thin">
        <nav className="flex space-x-3 pb-px">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors touch-target ${
                  isActive
                    ? 'border-dustguard-red text-dustguard-red'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id === 'evidence' && evidence.length > 0 && (
                  <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {evidence.length}
                  </span>
                )}
                {tab.id === 'actions' && actions.length > 0 && (
                  <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {actions.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

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
                <Link to={`/cases/${currentCase.id}/legal`}>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    Mở Legal Workspace &rarr;
                  </Button>
                </Link>
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

          {/* Right Col: Current Stage, Assignee, Next Action */}
          <div className="space-y-6">
            {/* Next Recommended Operational Action */}
            <div className="civic-card p-5 border-l-4 border-dustguard-red space-y-3 bg-red-50/20">
              <span className="text-xs font-bold uppercase text-dustguard-red tracking-wider">
                Hành động khuyến nghị tiếp theo
              </span>
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
              ) : (
                <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded border border-slate-200">
                  Chưa có ảnh minh chứng.
                </div>
              )}
            </div>
          </div>
        </div>
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
              <Button variant="teal" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
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

      {/* TAB 7: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="civic-card p-6">
          <h3 className="text-base font-bold text-slate-900 mb-6">Dòng thời gian Vụ việc (SSOT Timeline)</h3>
          <TimelineView timeline={timeline} />
        </div>
      )}

      {/* MODAL: ASSIGN STAFF */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Phân Công Cán Bộ Thụ Lý Vụ Việc"
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs sm:text-sm">
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
            <Button type="submit" variant="primary" loading={submitting}>
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
    </div>
  );
};
