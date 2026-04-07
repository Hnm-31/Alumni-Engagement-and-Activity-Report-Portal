import { useState, useEffect, useMemo } from 'react';
import { getAllReports } from '../services/adminService';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

// ─── Palette (driven by data length at render time) ──────────────────────────
const PALETTE = [
  '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#84cc16',
  '#3b82f6', '#a855f7', '#f43f5e', '#22d3ee', '#4ade80',
];

// Generic label truncation — no hardcoded string replacements
const trunc = (s, n = 18) => (!s ? '—' : s.length > n ? s.slice(0, n - 1) + '…' : s);

// ─── Custom tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-blue-300 text-xs font-semibold mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name}: <span className="text-white">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

// Pie labels — only show % when slice is big enough to avoid overlap
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  return (
    <text
      x={cx + r * Math.cos(-midAngle * RADIAN)}
      y={cy + r * Math.sin(-midAngle * RADIAN)}
      fill="#fff" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ─── KPI Stat Card ────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, gradient }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${gradient}`}>
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
      <div className="absolute -bottom-6 -right-2 w-16 h-16 bg-white/5 rounded-full" />
      <div className="relative">
        <div className="text-3xl mb-1">{icon}</div>
        <p className="text-4xl font-extrabold tracking-tight">{value}</p>
        <p className="text-sm font-semibold opacity-90 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Chart container card ─────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children, hint }) {
  const [showHint, setShowHint] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-gray-800">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {hint && (
          <div className="relative flex-shrink-0">
            <button
              onMouseEnter={() => setShowHint(true)}
              onMouseLeave={() => setShowHint(false)}
              className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 hover:bg-indigo-50 hover:text-indigo-500 flex items-center justify-center text-xs font-bold transition-colors"
            >
              ?
            </button>
            {showHint && (
              <div className="absolute right-0 top-7 z-30 w-64 bg-[#1e293b] text-white text-xs rounded-xl p-3 shadow-2xl leading-relaxed">
                {hint}
              </div>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminInsights() {
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading]       = useState(true);

  // Fetch everything in one shot — size=10000 gives us all records
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const first = await getAllReports(0, 1);
        const total = first.data?.totalElements ?? 50;
        // Now fetch all records in one page
        const full  = await getAllReports(0, Math.max(total, 1));
        setAllReports(full.data?.content ?? []);
      } catch {
        toast.error('Could not load data for insights.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── KPI stats ─────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!allReports.length) return {};
    const uniqueAlumni = new Set(
      allReports.map((r) => r.alumniName?.trim().toLowerCase()).filter(Boolean)
    ).size;
    const departments = new Set(allReports.map((r) => r.department).filter(Boolean)).size;
    const academicYears = new Set(allReports.map((r) => r.academicYear).filter(Boolean)).size;
    const totalStudents = allReports.reduce((s, r) => s + (r.studentCount ?? 0), 0);
    const reportsWithStudents = allReports.filter((r) => r.studentCount).length;
    return {
      totalReports: allReports.length,
      uniqueAlumni,
      departments,
      academicYears,
      totalStudents,
      avgStudents: reportsWithStudents
        ? Math.round(totalStudents / reportsWithStudents)
        : 0,
    };
  }, [allReports]);

  // ── Reports per Academic Year ──────────────────────────────────
  const byYear = useMemo(() => {
    const map = {};
    allReports.forEach((r) => {
      const y = r.academicYear?.trim() || 'Unspecified';
      map[y] = (map[y] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, Reports]) => ({ year, Reports }));
  }, [allReports]);

  // ── Sessions per Department ────────────────────────────────────
  const byDept = useMemo(() => {
    const map = {};
    allReports.forEach((r) => {
      const d = r.department?.trim() || 'Unspecified';
      map[d] = (map[d] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .map(([dept, Sessions]) => ({ dept, Sessions }));
  }, [allReports]);

  // ── Pie data (department share) ────────────────────────────────
  const deptPie = useMemo(
    () => byDept.map((d) => ({ name: d.dept, value: d.Sessions })),
    [byDept]
  );

  // ── Students reached per Academic Year ────────────────────────
  const studentsByYear = useMemo(() => {
    const map = {};
    allReports.forEach((r) => {
      const y = r.academicYear?.trim() || 'Unspecified';
      map[y] = (map[y] || 0) + (r.studentCount ?? 0);
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, Students]) => ({ year, Students }));
  }, [allReports]);

  // ── Upload trend by month ──────────────────────────────────────
  const uploadTrend = useMemo(() => {
    const map = {};
    allReports.forEach((r) => {
      if (!r.uploadedAt) return;
      const d   = new Date(r.uploadedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map[key]  = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, Uploads]) => ({ month, Uploads }));
  }, [allReports]);

  // ── Top 8 most active alumni ──────────────────────────────────
  const topAlumni = useMemo(() => {
    const map = {};
    allReports.forEach((r) => {
      const name = r.alumniName?.trim() || 'Unknown';
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, Sessions]) => ({ name: trunc(name, 22), fullName: name, Sessions }));
  }, [allReports]);

  // ── Radar data: normalized Sessions & Avg Students per dept ───
  // Both metrics are normalised to 0–100 (% of the max in that metric)
  // so they sit on the same scale and the shape is meaningful.
  const radarData = useMemo(() => {
    const map = {};
    allReports.forEach((r) => {
      const d = r.department?.trim() || 'Unspecified';
      if (!map[d]) map[d] = { dept: d, sessions: 0, totalStudents: 0, count: 0 };
      map[d].sessions      += 1;
      map[d].totalStudents += r.studentCount ?? 0;
      map[d].count         += r.studentCount != null ? 1 : 0;
    });
    const rows = Object.values(map).map((v) => ({
      dept:        trunc(v.dept, 14),
      fullDept:    v.dept,
      sessions:    v.sessions,
      avgStudents: v.count ? Math.round(v.totalStudents / v.count) : 0,
    }));

    // Normalise each metric independently to 0–100
    const maxSessions    = Math.max(...rows.map((r) => r.sessions),    1);
    const maxAvgStudents = Math.max(...rows.map((r) => r.avgStudents), 1);

    return rows.map((r) => ({
      dept:                  r.dept,
      fullDept:              r.fullDept,
      'Activity Level':      Math.round((r.sessions    / maxSessions)    * 100),
      'Student Reach Score': Math.round((r.avgStudents / maxAvgStudents) * 100),
      _rawSessions:          r.sessions,
      _rawAvgStudents:       r.avgStudents,
    }));
  }, [allReports]);

  // ── Full department summary for table ─────────────────────────
  const deptSummary = useMemo(() => {
    const map = {};
    allReports.forEach((r) => {
      const d = r.department?.trim() || 'Unspecified';
      if (!map[d]) map[d] = { dept: d, sessions: 0, totalStudents: 0, countWithStudents: 0 };
      map[d].sessions += 1;
      if (r.studentCount != null) {
        map[d].totalStudents    += r.studentCount;
        map[d].countWithStudents += 1;
      }
    });
    return Object.values(map)
      .sort((a, b) => b.sessions - a.sessions)
      .map((v) => ({
        dept:        v.dept,
        sessions:    v.sessions,
        students:    v.totalStudents,
        avgStudents: v.countWithStudents
          ? Math.round(v.totalStudents / v.countWithStudents)
          : '—',
        share: stats.totalReports
          ? ((v.sessions / stats.totalReports) * 100).toFixed(1)
          : '0.0',
      }));
  }, [allReports, stats.totalReports]);

  // ─────────────────────────────────────────────────────────────
  // Loading & empty states
  // ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading insights…</p>
      </div>
    );
  }

  if (!allReports.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-gray-400">
        <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
        <p className="text-sm font-medium">No report data available yet.</p>
        <p className="text-xs">Insights appear once faculty upload activity reports.</p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">Insights</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Live analytics across{' '}
            <span className="font-semibold text-indigo-600">{stats.totalReports}</span> reports
            — all data sourced directly from the database
          </p>
        </div>

      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Total Reports"    value={stats.totalReports}               icon="📋" gradient="bg-gradient-to-br from-indigo-500 to-indigo-700" />
        <StatCard label="Unique Alumni"    value={stats.uniqueAlumni}               icon="🎓" gradient="bg-gradient-to-br from-cyan-500 to-cyan-700" />
        <StatCard label="Departments"      value={stats.departments}                icon="🏛️" gradient="bg-gradient-to-br from-violet-500 to-violet-700" />
        <StatCard label="Academic Years"   value={stats.academicYears}              icon="📅" gradient="bg-gradient-to-br from-emerald-500 to-emerald-700" />
        <StatCard label="Students Reached" value={stats.totalStudents.toLocaleString()} icon="👥" gradient="bg-gradient-to-br from-amber-500 to-amber-600" />
        <StatCard label="Avg / Session"    value={stats.avgStudents}               icon="📊" gradient="bg-gradient-to-br from-rose-500 to-rose-700" />
      </div>

      {/* ── Row 1: Reports per year (bar) + Dept share (pie) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <ChartCard
            title="Reports per Academic Year"
            subtitle="Number of alumni activity sessions recorded each year"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byYear} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Reports" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="lg:col-span-2">
          <ChartCard
            title="Sessions by Department"
            subtitle="Share of reports per department — sourced from DB"
          >
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={deptPie}
                  cx="50%" cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  labelLine={false}
                  label={<PieLabel />}
                >
                  {deptPie.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="bg-[#1e293b] rounded-xl px-3 py-2 text-white text-sm shadow-xl">
                        <p className="font-bold">{payload[0].name}</p>
                        <p>{payload[0].value} sessions</p>
                      </div>
                    ) : null
                  }
                />
                <Legend
                  iconType="circle" iconSize={8}
                  formatter={(v) => <span className="text-xs text-gray-600">{trunc(v, 24)}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* ── Row 2: Students per year (area) + Upload trend (line) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard
          title="Total Students Reached per Year"
          subtitle="Cumulative student footfall across all sessions each academic year"
        >
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={studentsByYear} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="studGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year"    tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis                   tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Students" stroke="#06b6d4" strokeWidth={2.5}
                    fill="url(#studGrad)" dot={{ fill: '#06b6d4', r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Report Upload Trend (Monthly)"
          subtitle="How many reports were submitted each calendar month"
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={uploadTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="Uploads" stroke="#10b981" strokeWidth={2.5}
                    dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Row 3: Top alumni (horizontal bar) + Radar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <ChartCard
            title="Most Active Alumni"
            subtitle="Alumni who conducted the highest number of sessions"
          >
            <ResponsiveContainer width="100%" height={Math.max(280, topAlumni.length * 36)}>
              <BarChart
                data={topAlumni}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="alumniGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#374151' }} width={120} />
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="bg-[#1e293b] rounded-xl px-3 py-2 text-white text-sm shadow-xl">
                        <p className="font-bold">{payload[0].payload.fullName}</p>
                        <p>{payload[0].value} session{payload[0].value !== 1 ? 's' : ''}</p>
                      </div>
                    ) : null
                  }
                />
                <Bar dataKey="Sessions" fill="url(#alumniGrad)" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="lg:col-span-2">
          <ChartCard
            title="Department Engagement Radar"
            subtitle="Normalised comparison of activity level vs student reach"
            hint={
              `This radar compares each department on two normalised scores (0–100):\n\n` +
              `• Activity Level — how many sessions that dept ran, relative to the most active dept (100 = highest).\n\n` +
              `• Student Reach Score — the average students per session in that dept, relative to the dept with the highest average (100 = highest).\n\n` +
              `Both metrics are scaled to the same 0–100 range so the shape is fair. A dept that scores high on both axes is both frequently active AND reaches many students per session.`
            }
          >
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart cx="50%" cy="50%" outerRadius={90} data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="dept" tick={{ fontSize: 10, fill: '#64748b' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} tickCount={3} />
                <Radar name="Activity Level"     dataKey="Activity Level"     stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                <Radar name="Student Reach Score" dataKey="Student Reach Score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="bg-[#1e293b] rounded-xl px-3 py-2.5 text-white text-xs shadow-xl space-y-1">
                        <p className="font-bold text-sm mb-1">{payload[0]?.payload?.fullDept}</p>
                        <p>🔵 Activity Level: <b>{payload[0]?.payload?.['Activity Level']}</b>/100
                          <span className="text-gray-400"> ({payload[0]?.payload?._rawSessions} sessions)</span>
                        </p>
                        <p>🟡 Reach Score: <b>{payload[0]?.payload?.['Student Reach Score']}</b>/100
                          <span className="text-gray-400"> ({payload[0]?.payload?._rawAvgStudents} avg students)</span>
                        </p>
                      </div>
                    ) : null
                  }
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* ── Department summary table ── */}
      <ChartCard
        title="Department Summary"
        subtitle="Full breakdown per department — all figures from the database"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-violet-50">
                {['#', 'Department', 'Sessions', 'Students Reached', 'Avg Students / Session', 'Share of All Reports'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {deptSummary.map((row, i) => (
                <tr key={row.dept} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-5 py-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{row.dept}</td>
                  <td className="px-5 py-3 text-gray-600">{row.sessions}</td>
                  <td className="px-5 py-3 text-gray-600">{row.students.toLocaleString()}</td>
                  <td className="px-5 py-3 text-gray-600">{row.avgStudents}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-[80px]">
                        <div
                          className="h-2 rounded-full transition-all duration-700"
                          style={{
                            width: `${row.share}%`,
                            background: PALETTE[i % PALETTE.length],
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 w-10">{row.share}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
