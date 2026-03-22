import { useState } from 'react';
import { getDownloadUrl, deleteFile } from '../services/adminService';
import toast from 'react-hot-toast';

export default function FileListModal({ files = [], reportId, isAdmin = false, onClose, onDeleted }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDownload = (fileId) => {
    window.open(getDownloadUrl(fileId), '_blank');
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) return;
    setDeletingId(fileId);
    try {
      await deleteFile(fileId);
      toast.success('File deleted successfully');
      if (onDeleted) onDeleted(fileId);
    } catch {
      toast.error('Failed to delete file. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const getFileIcon = (fileType) => {
    const type = fileType?.toUpperCase();
    if (type === 'MAIN') return '📄';
    if (type === 'EXTRA' || type === 'ADDITIONAL') return '📎';
    return '📁';
  };

  const getBadgeStyle = (fileType) => {
    const type = fileType?.toUpperCase();
    if (type === 'MAIN') return 'bg-blue-100 text-blue-700 border border-blue-200';
    return 'bg-amber-100 text-amber-700 border border-amber-200';
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Report Files</h2>
            <p className="text-sm text-gray-500">{files.length} file{files.length !== 1 ? 's' : ''} attached</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* File List */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {files.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No files found for this report</p>
            </div>
          ) : (
            files.map((file) => (
              <div
                key={file.fileId}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
              >
                {/* File Icon */}
                <span className="text-2xl flex-shrink-0">{getFileIcon(file.fileType)}</span>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {file.structuredFileName || 'Unknown file'}
                  </p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${getBadgeStyle(file.fileType)}`}>
                    {file.fileType || 'FILE'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleDownload(file.fileId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 border border-blue-200"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(file.fileId)}
                      disabled={deletingId === file.fileId}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === file.fileId ? (
                        <span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
