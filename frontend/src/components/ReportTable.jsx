import { useState } from 'react';
import FileListModal from './FileListModal';
import { getReportFiles } from '../services/adminService';
import toast from 'react-hot-toast';

export default function ReportTable({
  data = [],
  columns = [],
  loading = false,
  isAdmin = false,
  pagination,
  onPageChange,
}) {
  const [modalFiles, setModalFiles] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const handleViewFiles = async (reportId) => {
    setLoadingFiles(true);
    setSelectedReportId(reportId);
    try {
      const res = await getReportFiles(reportId);
      const responseData = res.data;
      // Backend returns List<AdminReportResponse> – grab files from first item
      const files = Array.isArray(responseData)
        ? responseData[0]?.files ?? []
        : responseData?.files ?? [];
      setModalFiles(files);
    } catch {
      toast.error('Could not load files. Please try again.');
      setLoadingFiles(false);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleFileDeleted = (fileId) => {
    setModalFiles((prev) => prev?.filter((f) => f.fileId !== fileId));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3.5 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                Files
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-16 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-sm font-medium">No records found</p>
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={row.reportId ?? idx} className="hover:bg-blue-50/40 transition-colors duration-150">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {col.key === 'uploadedAt' || col.key === 'createdAt'
                        ? formatDate(row[col.key])
                        : row[col.key] ?? '—'}
                    </td>
                  ))}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleViewFiles(row.reportId)}
                      disabled={loadingFiles && selectedReportId === row.reportId}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-wait"
                    >
                      {loadingFiles && selectedReportId === row.reportId ? (
                        <span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                      View Files
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center sm:justify-between mt-4 px-1 gap-4">
          <p className="text-sm text-gray-500">
            Page <span className="font-medium text-gray-700">{pagination.page + 1}</span> of{' '}
            <span className="font-medium text-gray-700">{pagination.totalPages || 1}</span>
            {' '}·{' '}
            <span className="font-medium text-gray-700">{pagination.totalElements ?? data.length}</span> total
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
            >
              ← Prev
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= (pagination.totalPages - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* File Modal */}
      {modalFiles !== null && (
        <FileListModal
          files={modalFiles}
          reportId={selectedReportId}
          isAdmin={isAdmin}
          onClose={() => { setModalFiles(null); setSelectedReportId(null); }}
          onDeleted={handleFileDeleted}
        />
      )}
    </>
  );
}
