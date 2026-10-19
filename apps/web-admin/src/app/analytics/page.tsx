import {
  BarChart3,
  Users,
  ShieldCheck,
  Heart,
  TrendingUp,
  Award
} from 'lucide-react';

export default function AnalyticsPage() {
  const stats = [
    { title: 'Total Verified Candidates', value: '42,850', change: '+18% this month', icon: Users },
    { title: 'Verified Identity Badges Issued', value: '38,120', change: '94% verification rate', icon: ShieldCheck },
    { title: 'Active Family Workspaces', value: '16,400', change: '2.4 average guardians/candidate', icon: Award },
    { title: 'Successful Engagements', value: '1,420', change: '18 day avg match cycle', icon: Heart }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          Wasl Platform Analytics & Key Performance Indicators
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time metrics on verification throughput, family participation, and matching velocity.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{s.title}</span>
                <div className="p-2 rounded-xl bg-slate-900 text-emerald-400 border border-slate-800">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white">{s.value}</div>
              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {s.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* City Breakdown */}
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-white">Verified Profiles Distribution by City</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { city: 'Lahore', count: '16,200', pct: '38%' },
            { city: 'Karachi', count: '14,500', pct: '34%' },
            { city: 'Islamabad / Rawalpindi', count: '8,400', pct: '20%' },
            { city: 'Faisalabad / Other', count: '3,750', pct: '8%' }
          ].map(c => (
            <div key={c.city} className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-slate-400">{c.city}</div>
              <div className="text-xl font-bold text-white">{c.count}</div>
              <div className="text-[10px] text-emerald-400 font-bold">{c.pct} of total network</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
