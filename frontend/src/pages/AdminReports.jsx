import { useState, useEffect, useCallback } from 'react';
import ReportTable from '../components/ReportTable';
import { getAllReports } from '../services/adminService';
import toast from 'react-hot-toast';

const DEPARTMENTS = [
  'All Departments',
  'Computer Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
];

const ACADEMIC_YEARS = [
  'All Years',
  '2026-27', '2025-26', '2024-25', '2023-24', '2022-23', '2021-22',
];

const COLUMNS = [
  { key: 'reportId', label: 'Report ID' },
  { key: 'alumniName', label: 'Alumni Name' },
  { key: 'sessionTitle', label: 'Session Title' },
  { key: 'department', label: 'Department' },
  { key: 'academicYear', label: 'Academic Year' },
  { key: 'studentCount', label: 'Students' },
  { key: 'uploadedAt', label: 'Uploaded Date' },
];

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalElements: 0 });

  const [filters, setFilters] = useState({
    department: '',
    academicYear: '',
    search: '',
  });

  const fetchReports = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await getAllReports(page, 10);
      const pageData = res.data;
      let content = pageData.content ?? [];

      // Client-side filtering (server-side filtering endpoints can be added later)
      if (filters.department && filters.department !== 'All Departments') {
        content = content.filter((r) => r.department === filters.department);
      }
      if (filters.academicYear && filters.academicYear !== 'All Years') {
        content = content.filter((r) => r.academicYear === filters.academicYear);
      }
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        content = content.filter((r) => r.alumniName?.toLowerCase().includes(q));
      }

      setReports(content);
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
  }, [filters]);

  useEffect(() => {
    fetchReports(0);
  }, [fetchReports]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ department: '', academicYear: '', search: '' });
  };

  const hasFilters = filters.department || filters.academicYear || filters.search;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">All Reports</h2>
          <p className="text-gray-500 text-sm mt-1">Manage and view all alumni activity reports</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
          <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-semibold text-emerald-700">{pagination.totalElements} Total Reports</span>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          <span className="text-sm font-semibold text-gray-600">Filter Reports</span>
          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="ml-auto text-xs text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
            >
              Clear all filters ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Department Filter */}
          <div>
            <label className="form-label">Department</label>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="form-input"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d === 'All Departments' ? '' : d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Academic Year Filter */}
          <div>
            <label className="form-label">Academic Year</label>
            <select
              name="academicYear"
              value={filters.academicYear}
              onChange={handleFilterChange}
              className="form-input"
            >
              {ACADEMIC_YEARS.map((y) => (
                <option key={y} value={y === 'All Years' ? '' : y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="form-label">Search Alumni Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="e.g. Rahul Sharma"
                className="form-input pl-9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <ReportTable
        data={reports}
        columns={COLUMNS}
        loading={loading}
        isAdmin={true}
        pagination={pagination}
        onPageChange={(page) => fetchReports(page)}
      />
    </div>
  );
}
