import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getMyReports,
  getMyReportById,
  updateMyReport,
  replaceReportFile,
} from '../services/reportService';
import { getDownloadUrl } from '../services/adminService';
import { DEPARTMENTS, ACADEMIC_YEARS } from '../utils/formConstants';
import CustomSelect from '../components/CustomSelect';
import toast from 'react-hot-toast';



const formatDate = (val) => {
  if (!val) return '—';
  try {
    return new Date(val).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return val; }
};

// ─── Edit Report Modal ─────────────────────────────────────────────────────
function EditModal({ report, onClose, onSaved }) {
  const [form, setForm] = useState({
    alumniName: report.alumniName ?? '',
    sessionTitle: report.sessionTitle ?? '',
    sessionObjective: report.sessionObjective ?? '',
    academicYear: report.academicYear ?? '',
    department: report.department ?? '',
    studentCount: report.studentCount ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [files, setFiles] = useState(report.files ?? []);
  const [replacingFileId, setReplacingFileId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const fileInputRef = useRef(null);
  const [pendingReplaceFileId, setPendingReplaceFileId] = useState(null);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const id = toast.loading('Saving changes...');
    try {
      await updateMyReport(report.reportId, {
        alumniName: form.alumniName.trim(),
        sessionTitle: form.sessionTitle.trim(),
        sessionObjective: form.sessionObjective.trim(),
        academicYear: form.academicYear,
        department: form.department,
        studentCount: form.studentCount ? Number(form.studentCount) : null,
      });
      toast.success('Report updated!', { id });
      onSaved();
      onClose();
    } catch (err) {
      const msg = err?.response?.data;
      toast.error(typeof msg === 'string' ? msg : 'Failed to update.', { id });
    } finally {
      setSaving(false);
    }
  };

  const triggerReplace = (fileId) => {
    setPendingReplaceFileId(fileId);
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e) => {
    const newFile = e.target.files?.[0];
    if (!newFile || !pendingReplaceFileId) return;
    e.target.value = '';

    setReplacingFileId(pendingReplaceFileId);
    const id = toast.loading('Replacing file...');
    try {
      await replaceReportFile(report.reportId, pendingReplaceFileId, newFile);
      toast.success('File replaced successfully!', { id });
      // refresh file list from server
      const res = await getMyReportById(report.reportId);
      setFiles(res.data.files ?? []);
    } catch (err) {
      const msg = err?.response?.data;
      toast.error(typeof msg === 'string' ? msg : 'Failed to replace file.', { id });
    } finally {
      setReplacingFileId(null);
      setPendingReplaceFileId(null);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    setDownloadingId(fileId);
    try {
      const res = await getDownloadUrl(fileId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      const cd = res.headers['content-disposition'];
      let name = fileName || `file_${fileId}`;
      if (cd?.includes('filename=')) name = cd.split('filename=')[1].replace(/['"]/g, '');
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Download failed. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const inputCls =
    'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white';
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Edit Report</h2>
            <p className="text-xs text-gray-400 mt-0.5">Report #{report.reportId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Alumni Name */}
          <div>
            <label className={labelCls}>Alumni Name</label>
            <input name="alumniName" value={form.alumniName} onChange={handleChange} className={inputCls} placeholder="e.g. Dr. Rahul Kulkarni" />
          </div>

          {/* Session Title */}
          <div>
            <label className={labelCls}>Session Title</label>
            <input name="sessionTitle" value={form.sessionTitle} onChange={handleChange} className={inputCls} placeholder="e.g. Career Pathways in AI" />
          </div>

          {/* Session Objective */}
          <div>
            <label className={labelCls}>Session Objective</label>
            <textarea
              name="sessionObjective"
              value={form.sessionObjective}
              onChange={handleChange}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Briefly describe the objective..."
            />
          </div>

          {/* Department + Academic Year row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Department</label>
              <CustomSelect
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Select department"
                options={DEPARTMENTS}
              />
            </div>
            <div>
              <label className={labelCls}>Academic Year</label>
              <CustomSelect
                name="academicYear"
                value={form.academicYear}
                onChange={handleChange}
                placeholder="Select year"
                options={ACADEMIC_YEARS}
              />
            </div>
          </div>

          {/* Student Count */}
          <div>
            <label className={labelCls}>Student Count</label>
            <input
              type="number"
              name="studentCount"
              value={form.studentCount}
              onChange={handleChange}
              className={inputCls}
              placeholder="e.g. 60"
              min={1}
            />
          </div>

          {/* Attached Files */}
          {files.length > 0 && (
            <div>
              <label className={labelCls}>Attached Files</label>
              <div className="space-y-2 mt-1">
                {files.map((f) => (
                  <div
                    key={f.fileId}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-all"
                  >
                    <span className="text-xl flex-shrink-0">{f.fileType === 'MAIN' ? '📄' : '📎'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{f.structuredFileName || 'File'}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 inline-block ${
                        f.fileType === 'MAIN'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {f.fileType}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleDownload(f.fileId, f.structuredFileName)}
                        disabled={downloadingId === f.fileId}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors disabled:opacity-50"
                      >
                        {downloadingId === f.fileId
                          ? <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                          : <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
                        Download
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerReplace(f.fileId)}
                        disabled={replacingFileId === f.fileId}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg border border-violet-200 transition-colors disabled:opacity-50"
                      >
                        {replacingFileId === f.fileId
                          ? <span className="w-3 h-3 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                          : <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
                        Replace
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Hidden file input for replace */}
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelected} />
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 rounded-xl shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function FacultyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalElements: 0 });
  const [editingReport, setEditingReport] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(null); // reportId being loaded for edit

  const fetchReports = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await getMyReports(page, 10);
      const pageData = res.data;
      setReports(pageData.content ?? []);
      setPagination({
        page: pageData.number ?? 0,
        totalPages: pageData.totalPages ?? 1,
        totalElements: pageData.totalElements ?? 0,
      });
    } catch {
      toast.error('Could not load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReports(0); }, [fetchReports]);

  const handleEdit = async (report) => {
    // Fetch full details (including files) before opening modal
    setLoadingDetail(report.reportId);
    try {
      const res = await getMyReportById(report.reportId);
      setEditingReport(res.data);
    } catch {
      // Fallback to row data if detail fetch fails
      setEditingReport(report);
    } finally {
      setLoadingDetail(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Reports</h2>
          <p className="text-gray-500 text-sm mt-1">All reports submitted by you</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-semibold text-blue-700">{pagination.totalElements} Total</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  {['Alumni Name', 'Session Title', 'Department', 'Academic Year', 'Students', 'Uploaded', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-sm font-medium">No reports found</p>
                      <p className="text-xs mt-1">Upload your first activity report to get started.</p>
                    </td>
                  </tr>
                ) : (
                  reports.map((row) => (
                    <tr key={row.reportId} className="hover:bg-blue-50/40 transition-colors duration-150">
                      <td className="px-5 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">{row.alumniName ?? '—'}</td>
                      <td className="px-5 py-4 text-sm text-gray-700 max-w-[200px] truncate">{row.sessionTitle ?? '—'}</td>
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{row.department ?? '—'}</td>
                      <td className="px-5 py-4 text-sm whitespace-nowrap">
                        {row.academicYear
                          ? <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-100">{row.academicYear}</span>
                          : '—'}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 text-center">{row.studentCount ?? '—'}</td>
                      <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(row.uploadedAt)}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleEdit(row)}
                          disabled={loadingDetail === row.reportId}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-wait"
                        >
                          {loadingDetail === row.reportId ? (
                            <span className="w-3.5 h-3.5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          )}
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-between mt-4 px-1 gap-4">
            <p className="text-sm text-gray-500">
              Page <span className="font-medium text-gray-700">{pagination.page + 1}</span> of{' '}
              <span className="font-medium text-gray-700">{pagination.totalPages || 1}</span>
              {' '}·{' '}
              <span className="font-medium text-gray-700">{pagination.totalElements ?? reports.length}</span> total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchReports(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
              >
                ← Prev
              </button>
              <button
                onClick={() => fetchReports(pagination.page + 1)}
                disabled={pagination.page >= (pagination.totalPages - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editingReport && (
        <EditModal
          report={editingReport}
          onClose={() => setEditingReport(null)}
          onSaved={() => fetchReports(pagination.page)}
        />
      )}
    </div>
  );
}
