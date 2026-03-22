import { useState, useEffect, useCallback } from 'react';
import ReportTable from '../components/ReportTable';
import { getMyReports } from '../services/reportService';
import toast from 'react-hot-toast';

const COLUMNS = [
  { key: 'alumniName', label: 'Alumni Name' },
  { key: 'sessionTitle', label: 'Session Title' },
  { key: 'department', label: 'Department' },
  { key: 'academicYear', label: 'Academic Year' },
  { key: 'uploadedAt', label: 'Uploaded Date' },
];

export default function FacultyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalElements: 0 });

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

  useEffect(() => {
    fetchReports(0);
  }, [fetchReports]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Reports</h2>
          <p className="text-gray-500 text-sm mt-1">All reports submitted by you</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-semibold text-blue-700">{pagination.totalElements} Total</span>
        </div>
      </div>

      {/* Table */}
      <ReportTable
        data={reports}
        columns={COLUMNS}
        loading={loading}
        isAdmin={false}
        pagination={pagination}
        onPageChange={(page) => fetchReports(page)}
      />
    </div>
  );
}
