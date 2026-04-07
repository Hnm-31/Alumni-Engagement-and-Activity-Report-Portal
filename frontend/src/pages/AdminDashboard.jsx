import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { getAllReports } from '../services/adminService';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, departments: 0, recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAllReports(0, 100);
        const pageData = res.data;
        const content = pageData.content ?? [];
        const total = pageData.totalElements ?? content.length;
        const departments = new Set(content.map((r) => r.department).filter(Boolean)).size;
        const recent = content.slice(0, 5);
        setStats({ total, departments, recent });
      } catch {
        toast.error('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Overview of alumni activity reports</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <StatCard
          icon="📊"
          label="Total Reports"
          value={loading ? '...' : stats.total}
          color="blue"
          sub="All time submissions"
        />
        <StatCard
          icon="🏛️"
          label="Departments"
          value={loading ? '...' : stats.departments}
          color="emerald"
          sub="Unique departments covered"
        />
        <StatCard
          icon="📅"
          label="Recent Uploads"
          value={loading ? '...' : stats.recent.length}
          color="violet"
          sub="In the last batch"
        />
      </div>

      {/* Recent Uploads */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-gray-700 mb-5 flex items-center gap-2">
          <span className="w-2 h-5 bg-blue-500 rounded-full" />
          Recent Uploads
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : stats.recent.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">No reports uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {stats.recent.map((report, idx) => (
              <div
                key={report.reportId ?? idx}
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50/40 border border-gray-100 hover:border-blue-100 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-white text-sm font-bold">
                    {(report.alumniName ?? 'A').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{report.alumniName}</p>
                  <p className="text-xs text-gray-500 truncate">{report.sessionTitle}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-medium px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {report.department ?? 'N/A'}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(report.uploadedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
