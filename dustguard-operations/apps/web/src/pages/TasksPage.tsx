import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Filter,
  ArrowRight,
  ExternalLink,
  Search,
  RotateCcw,
  UserCheck,
  Calendar,
  FileText,
  ShieldAlert,
  MapPin,
  Flame,
  Check,
  ChevronDown,
  X,
  BookOpen,
} from 'lucide-react';
import { Button } from '../components/common/Button';

// Task Types dictionary
const TASK_TYPES: Record<string, { label: string; color: string }> = {
  GENERAL: { label: 'Nhiệm vụ chung', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  TRIAGE: { label: 'Triage phản ánh', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  VERIFICATION: { label: 'Xác minh thông tin', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  LEGAL_REVIEW: { label: 'Rà soát pháp lý', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  CHECKLIST_PREP: { label: 'Chuẩn bị checklist', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  FIELD_INSPECTION: { label: 'Kiểm tra hiện trường', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  EVIDENCE_COLLECTION: { label: 'Thu thập bằng chứng', color: 'bg-teal-50 text-teal-800 border-teal-200' },
  CONTRACTOR_LIAISON: { label: 'Liên hệ đơn vị thi công', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
  REMEDIATION_FOLLOWUP: { label: 'Theo dõi khắc phục', color: 'bg-orange-50 text-orange-800 border-orange-200' },
  REINSPECTION: { label: 'Tái kiểm tra', color: 'bg-rose-50 text-rose-800 border-rose-200' },
  DOSSIER_COMPLETION: { label: 'Hoàn thiện hồ sơ', color: 'bg-slate-100 text-slate-800 border-slate-200' },
  CLOSURE_APPROVAL: { label: 'Phê duyệt đóng vụ việc', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
};

export const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Auxiliary data
  const [usersList, setUsersList] = useState<any[]>([]);
  const [casesList, setCasesList] = useState<any[]>([]);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTaskType, setNewTaskType] = useState('GENERAL');
  const [newPriority, setNewPriority] = useState('NORMAL');
  const [newDueAt, setNewDueAt] = useState('');
  const [newCaseId, setNewCaseId] = useState('');
  const [newAssignee, setNewAssignee] = useState('');

  // Initial load
  useEffect(() => {
    loadAuxiliaryData();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [filterTab, statusFilter, priorityFilter, typeFilter, searchQuery]);

  const loadAuxiliaryData = async () => {
    try {
      const [uRes, cRes] = await Promise.allSettled([
        api.admin.users(),
        api.cases.list({ pageSize: '50' }),
      ]);
      if (uRes.status === 'fulfilled' && uRes.value?.users) {
        setUsersList(uRes.value.users);
      }
      if (cRes.status === 'fulfilled' && cRes.value?.cases) {
        setCasesList(cRes.value.cases);
      }
    } catch {
      // Non-blocking
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const params: Record<string, string | undefined> = {};
      if (filterTab !== 'ALL') params.filter = filterTab;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (priorityFilter !== 'ALL') params.priority = priorityFilter;
      if (typeFilter !== 'ALL') params.task_type = typeFilter;
      if (searchQuery.trim()) params.q = searchQuery.trim();

      const res: any = await api.tasks.list(params);
      const taskArray = res.tasks || res.data || [];
      setTasks(taskArray);
    } catch (err: any) {
      addToast(err.detail || err.message || 'Không thể tải danh sách nhiệm vụ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (task: any) => {
    try {
      const isCurrentlyDone = task.status === 'DONE' || task.status === 'COMPLETED' || task.is_done;
      const nextStatus = isCurrentlyDone ? 'OPEN' : 'COMPLETED';
      await api.tasks.update(task.id, { status: nextStatus });
      addToast(
        `Đã chuyển nhiệm vụ "${task.title.slice(0, 30)}..." sang "${nextStatus === 'COMPLETED' ? 'Hoàn thành' : 'Chưa hoàn thành'}"`,
        'success'
      );
      loadTasks();
    } catch (err: any) {
      addToast(err.detail || 'Lỗi cập nhật nhiệm vụ', 'error');
    }
  };

  const handleQuickStatusChange = async (taskId: string, newStatus: string) => {
    try {
      let targetStatus = newStatus;
      if (newStatus === 'TODO') targetStatus = 'OPEN';
      if (newStatus === 'DONE') targetStatus = 'COMPLETED';
      await api.tasks.update(taskId, { status: targetStatus });
      addToast(`Đã cập nhật trạng thái nhiệm vụ`, 'success');
      loadTasks();
    } catch (err: any) {
      addToast(err.detail || 'Lỗi cập nhật trạng thái', 'error');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      addToast('Vui lòng nhập tiêu đề nhiệm vụ', 'error');
      return;
    }
    try {
      setCreating(true);
      await api.tasks.create({
        title: newTitle.trim(),
        description: newDesc.trim() || undefined,
        task_type: newTaskType,
        priority: newPriority,
        due_at: newDueAt ? new Date(newDueAt).toISOString() : undefined,
        case_id: newCaseId.trim() || undefined,
        assigned_to: newAssignee || user?.id,
        source: 'MANUAL',
      });
      addToast('Đã tạo nhiệm vụ vận hành thành công', 'success');
      setShowCreateModal(false);
      resetNewForm();
      loadTasks();
    } catch (err: any) {
      addToast(err.detail || 'Không thể tạo nhiệm vụ', 'error');
    } finally {
      setCreating(false);
    }
  };

  const resetNewForm = () => {
    setNewTitle('');
    setNewDesc('');
    setNewTaskType('GENERAL');
    setNewPriority('NORMAL');
    setNewDueAt('');
    setNewCaseId('');
    setNewAssignee('');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    try {
      setUpdating(true);
      await api.tasks.update(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description,
        task_type: editingTask.task_type,
        priority: editingTask.priority,
        status: editingTask.status,
        due_at: editingTask.due_at,
        assigned_to: editingTask.assigned_to,
      });
      addToast('Đã lưu thay đổi nhiệm vụ', 'success');
      setEditingTask(null);
      loadTasks();
    } catch (err: any) {
      addToast(err.detail || 'Lỗi cập nhật nhiệm vụ', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleResetFilters = () => {
    setFilterTab('ALL');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setTypeFilter('ALL');
    setSearchQuery('');
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = tasks.length;
    const overdue = tasks.filter(t => t.is_overdue).length;
    const pending = tasks.filter(t => t.status !== 'DONE' && t.status !== 'COMPLETED').length;
    const done = tasks.filter(t => t.status === 'DONE' || t.status === 'COMPLETED').length;
    return { total, overdue, pending, done };
  }, [tasks]);

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'URGENT':
        return <span className="px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 rounded flex items-center gap-1"><Flame className="w-3 h-3 text-rose-600" /> Khẩn cấp</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 rounded">Ưu tiên cao</span>;
      case 'NORMAL':
        return <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 rounded">Bình thường</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200 rounded">Thấp</span>;
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'DONE':
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full inline-flex items-center gap-1"><Check className="w-3 h-3" /> Đã xong</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full inline-flex items-center gap-1"><Clock className="w-3 h-3" /> Đang làm</span>;
      case 'BLOCKED':
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 rounded-full inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Bị nghẽn</span>;
      case 'WAITING':
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-full inline-flex items-center gap-1"><Clock className="w-3 h-3" /> Chờ xử lý</span>;
      case 'TODO':
      case 'OPEN':
      default:
        return <span className="px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 rounded-full">Cần làm</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hàng đợi Nhiệm vụ Vận hành</h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-200 text-slate-800 rounded-full">
              {stats.pending} việc cần làm
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Điều phối và giám sát toàn diện các nhiệm vụ hiện trường, rà soát pháp lý, xử lý IoT và đôn đốc khắc phục
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="danger"
            onClick={() => setShowCreateModal(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Thêm nhiệm vụ mới
          </Button>
        </div>
      </div>

      {/* Primary Semantic Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 pb-px scrollbar-thin">
        {[
          { id: 'ALL', label: 'Tất cả' },
          { id: 'MINE', label: 'Giao cho tôi' },
          { id: 'TEAM', label: 'Toàn đội' },
          { id: 'UNASSIGNED', label: 'Chưa phân công' },
          { id: 'OVERDUE', label: 'Quá hạn', badge: stats.overdue > 0 ? stats.overdue : undefined, badgeColor: 'bg-rose-600 text-white' },
          { id: 'TODAY', label: 'Hôm nay' },
          { id: 'LEGAL', label: 'Pháp lý' },
          { id: 'FIELD', label: 'Hiện trường' },
          { id: 'FOLLOWUP', label: 'Khắc phục' },
          { id: 'DONE', label: 'Đã hoàn thành' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-1.5 touch-target ${
              filterTab === tab.id
                ? 'border-b-2 border-dustguard-red text-dustguard-red bg-rose-50/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${tab.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Secondary Controls & Search */}
      <div className="civic-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề nhiệm vụ, nội dung hoặc mã vụ việc..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-dustguard-teal"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-medium"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="TODO">Cần làm (TODO)</option>
              <option value="IN_PROGRESS">Đang làm (IN_PROGRESS)</option>
              <option value="BLOCKED">Bị nghẽn (BLOCKED)</option>
              <option value="WAITING">Chờ xử lý (WAITING)</option>
              <option value="DONE">Đã xong (DONE)</option>
            </select>

            {/* Priority */}
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-medium"
            >
              <option value="ALL">Tất cả mức độ</option>
              <option value="URGENT">Khẩn cấp</option>
              <option value="HIGH">Ưu tiên cao</option>
              <option value="NORMAL">Bình thường</option>
              <option value="LOW">Thấp</option>
            </select>

            {/* Task Type */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-medium"
            >
              <option value="ALL">Tất cả loại nghiệp vụ</option>
              {Object.entries(TASK_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>

            {(filterTab !== 'ALL' || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || typeFilter !== 'ALL' || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded hover:bg-slate-50 flex items-center gap-1 font-medium transition-colors"
                title="Đặt lại toàn bộ bộ lọc"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="civic-card divide-y divide-slate-100">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-dustguard-red mb-2"></div>
            <p>Đang đồng bộ hàng đợi nhiệm vụ...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Chưa có nhiệm vụ nào phù hợp bộ lọc</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Hiện tại không có công việc nào trong danh mục này hoặc toàn bộ các nhiệm vụ đã được xử lý hoàn tất.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <Button variant="secondary" size="sm" onClick={handleResetFilters} icon={<RotateCcw className="w-3.5 h-3.5" />}>
                Đặt lại bộ lọc
              </Button>
              <Button variant="danger" size="sm" onClick={() => setShowCreateModal(true)} icon={<Plus className="w-3.5 h-3.5" />}>
                Thêm nhiệm vụ mới
              </Button>
              {user?.role === 'legal_reviewer' && (
                <Link to="/legal/import">
                  <Button variant="secondary" size="sm" icon={<BookOpen className="w-3.5 h-3.5" />}>
                    Nhập văn bản pháp lý
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          tasks.map(t => {
            const isDone = t.status === 'DONE' || t.status === 'COMPLETED';
            const typeConfig = TASK_TYPES[t.task_type] || TASK_TYPES.GENERAL;

            return (
              <div
                key={t.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  isDone ? 'bg-slate-50/40 opacity-80' : 'hover:bg-slate-50/70'
                }`}
              >
                {/* Left side: Checkbox + Content */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleStatus(t)}
                    className={`mt-1 p-1 rounded transition-colors touch-target flex-shrink-0 ${
                      isDone
                        ? 'text-emerald-600 hover:text-emerald-700'
                        : 'text-slate-300 hover:text-slate-500'
                    }`}
                    title={isDone ? 'Đánh dấu chưa xong' : 'Đánh dấu hoàn thành'}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${isDone ? 'fill-emerald-100 text-emerald-600' : ''}`}
                    />
                  </button>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    {/* Header line: Title + Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-bold tracking-tight cursor-pointer hover:text-dustguard-teal ${
                          isDone ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                        onClick={() => setEditingTask(t)}
                      >
                        {t.title}
                      </span>

                      {/* Type Badge */}
                      <span className={`px-2 py-0.5 text-[11px] font-medium border rounded ${typeConfig.color}`}>
                        {typeConfig.label}
                      </span>

                      {/* Priority Badge */}
                      {getPriorityBadge(t.priority)}

                      {/* Status Badge with quick toggle */}
                      {getStatusBadge(t.status)}

                      {/* Overdue Warning */}
                      {t.is_overdue && (
                        <span className="px-2 py-0.5 text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 rounded flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Quá hạn
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {t.description && (
                      <p className={`text-xs ${isDone ? 'text-slate-400' : 'text-slate-600'} line-clamp-2`}>
                        {t.description}
                      </p>
                    )}

                    {/* Metadata line: Due Date, Assignee, Linked Case */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 pt-1">
                      {t.due_at && (
                        <span className={`flex items-center gap-1 font-medium ${t.is_overdue ? 'text-rose-700 font-bold' : 'text-slate-600'}`}>
                          <Clock className="w-3.5 h-3.5" />
                          Hạn: {new Date(t.due_at).toLocaleDateString('vi-VN')}
                        </span>
                      )}

                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        Giao cho: <strong className="text-slate-800 font-semibold">{t.assigned_to_name || 'Chưa phân công'}</strong>
                      </span>

                      {t.case_code && (
                        <Link
                          to={`/cases/${t.case_id}`}
                          className="inline-flex items-center gap-1 text-dustguard-teal font-semibold hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {t.case_code}
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </Link>
                      )}

                      {t.source && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                          Nguồn: {t.source}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  {/* Deep link direct action */}
                  {t.task_type === 'LEGAL_REVIEW' && t.case_id && (
                    <Link to={`/cases/${t.case_id}/legal`}>
                      <button className="px-2.5 py-1 text-xs font-semibold rounded border border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100 transition-colors touch-target">
                        Rà soát luật
                      </button>
                    </Link>
                  )}

                  {t.task_type === 'FIELD_INSPECTION' && t.case_id && (
                    <Link to={`/cases/${t.case_id}?tab=inspections`}>
                      <button className="px-2.5 py-1 text-xs font-semibold rounded border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors touch-target">
                        Hiện trường
                      </button>
                    </Link>
                  )}

                  {/* Status Dropdown */}
                  <select
                    value={t.status}
                    onChange={e => handleQuickStatusChange(t.id, e.target.value)}
                    className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 font-medium hover:border-slate-400 focus:outline-none"
                  >
                    <option value="TODO">Cần làm</option>
                    <option value="IN_PROGRESS">Đang làm</option>
                    <option value="BLOCKED">Bị nghẽn</option>
                    <option value="WAITING">Chờ xử lý</option>
                    <option value="DONE">Hoàn thành</option>
                    <option value="CANCELLED">Hủy bỏ</option>
                  </select>

                  <button
                    onClick={() => setEditingTask(t)}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded hover:bg-slate-100 transition-colors touch-target"
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE TASK MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-none flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-dustguard-red" />
                Thêm nhiệm vụ vận hành mới
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề nhiệm vụ <span className="text-dustguard-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Rà soát biên bản hiện trường công trình Masteri..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-dustguard-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Loại nghiệp vụ</label>
                  <select
                    value={newTaskType}
                    onChange={e => setNewTaskType(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded px-3 py-2 bg-white text-slate-800"
                  >
                    {Object.entries(TASK_TYPES).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mức ưu tiên</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded px-3 py-2 bg-white text-slate-800"
                  >
                    <option value="LOW">Thấp</option>
                    <option value="NORMAL">Bình thường</option>
                    <option value="HIGH">Ưu tiên cao</option>
                    <option value="URGENT">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Người phụ trách</label>
                  <select
                    value={newAssignee}
                    onChange={e => setNewAssignee(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded px-3 py-2 bg-white text-slate-800"
                  >
                    <option value="">Giao cho tôi ({user?.full_name})</option>
                    {usersList.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.full_name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hạn hoàn thành</label>
                  <input
                    type="date"
                    value={newDueAt}
                    onChange={e => setNewDueAt(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded px-3 py-2 bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vụ việc liên quan (tùy chọn)</label>
                <select
                  value={newCaseId}
                  onChange={e => setNewCaseId(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-3 py-2 bg-white text-slate-800"
                >
                  <option value="">Không liên kết vụ việc cụ thể</option>
                  {casesList.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.case_code} - {c.title.slice(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú hướng dẫn</label>
                <textarea
                  rows={3}
                  placeholder="Ghi chú chi tiết yêu cầu, các bước thực hiện cần lưu ý..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-dustguard-teal"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <Button variant="secondary" type="button" onClick={() => setShowCreateModal(false)}>
                  Hủy bỏ
                </Button>
                <Button variant="danger" type="submit" loading={creating}>
                  Tạo nhiệm vụ
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT / DETAILS MODAL */}
      {editingTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-none flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">
                Chi tiết & Cập nhật nhiệm vụ
              </h3>
              <button
                onClick={() => setEditingTask(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  required
                  value={editingTask.title}
                  onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-dustguard-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái</label>
                  <select
                    value={editingTask.status}
                    onChange={e => setEditingTask({ ...editingTask, status: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 font-semibold"
                  >
                    <option value="TODO">Cần làm (TODO)</option>
                    <option value="IN_PROGRESS">Đang làm (IN_PROGRESS)</option>
                    <option value="BLOCKED">Bị nghẽn (BLOCKED)</option>
                    <option value="WAITING">Chờ xử lý (WAITING)</option>
                    <option value="DONE">Hoàn thành (DONE)</option>
                    <option value="CANCELLED">Hủy bỏ (CANCELLED)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mức ưu tiên</label>
                  <select
                    value={editingTask.priority}
                    onChange={e => setEditingTask({ ...editingTask, priority: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded px-3 py-2 bg-white text-slate-800"
                  >
                    <option value="LOW">Thấp</option>
                    <option value="NORMAL">Bình thường</option>
                    <option value="HIGH">Ưu tiên cao</option>
                    <option value="URGENT">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Loại nghiệp vụ</label>
                  <select
                    value={editingTask.task_type || 'GENERAL'}
                    onChange={e => setEditingTask({ ...editingTask, task_type: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded px-3 py-2 bg-white text-slate-800"
                  >
                    {Object.entries(TASK_TYPES).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Người phụ trách</label>
                  <select
                    value={editingTask.assigned_to || ''}
                    onChange={e => setEditingTask({ ...editingTask, assigned_to: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded px-3 py-2 bg-white text-slate-800"
                  >
                    <option value="">Chưa phân công</option>
                    {usersList.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.full_name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hạn xử lý</label>
                <input
                  type="date"
                  value={editingTask.due_at ? editingTask.due_at.split('T')[0] : ''}
                  onChange={e => setEditingTask({ ...editingTask, due_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="w-full text-xs border border-slate-300 rounded px-3 py-2 bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả / Ghi chú</label>
                <textarea
                  rows={3}
                  value={editingTask.description || ''}
                  onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-dustguard-teal"
                />
              </div>

              {editingTask.case_code && (
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-slate-500">Vụ việc liên quan:</span>{' '}
                    <strong className="text-slate-800">{editingTask.case_code}</strong>
                  </div>
                  <Link
                    to={`/cases/${editingTask.case_id}`}
                    className="text-dustguard-teal font-semibold hover:underline flex items-center gap-1"
                  >
                    Xem vụ việc <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <Button variant="secondary" type="button" onClick={() => setEditingTask(null)}>
                  Đóng
                </Button>
                <Button variant="primary" type="submit" loading={updating}>
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
