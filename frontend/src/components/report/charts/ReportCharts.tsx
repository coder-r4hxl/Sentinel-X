import { CartesianGrid, Cell, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, LineChart, Line } from 'recharts';

interface ReportChartsProps {
  overview: Array<{ subject: string; score: number }>;
  capabilities: Array<{ name: string; value: number }>;
  permissions: Array<{ name: string; value: number }>;
  stages: Array<{ name: string; value: number }>;
}

const palette = ['#00B8FF', '#14F195', '#8bdbff', '#f5c76b', '#ff7a59'];

export function ReportCharts({ overview, capabilities, permissions, stages }: ReportChartsProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-[1.5rem] border border-white/10 bg-[#0B1118]/85 p-4">
        <p className="mb-4 text-lg font-semibold text-white">Security posture radar</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={overview}>
              <PolarGrid stroke="rgba(255,255,255,0.12)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
              <PolarRadiusAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Radar dataKey="score" stroke="#00B8FF" fill="#00B8FF" fillOpacity={0.24} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-white/10 bg-[#0B1118]/85 p-4">
        <p className="mb-4 text-lg font-semibold text-white">Browser capabilities detected</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={capabilities}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#14F195" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-white/10 bg-[#0B1118]/85 p-4">
        <p className="mb-4 text-lg font-semibold text-white">Permission states</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={permissions} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={3}>
                {permissions.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-white/10 bg-[#0B1118]/85 p-4">
        <p className="mb-4 text-lg font-semibold text-white">Assessment execution stages</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stages}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#00B8FF" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
