export default function StatCard({ icon, label, value, color = 'blue', sub }) {
  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    violet: 'from-violet-500 to-violet-600',
    amber: 'from-amber-500 to-amber-600',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5 hover:shadow-md transition-shadow duration-200">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorMap[color] || colorMap.blue} flex items-center justify-center shadow-md flex-shrink-0`}>
        <span className="text-white text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value ?? '—'}</p>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
