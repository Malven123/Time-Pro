import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { TimeEntry } from "@shared/schema";
import { format } from "date-fns";

export default function Reports() {
  const { data: entries } = useQuery<TimeEntry[]>({
    queryKey: ["/api/time-entries"],
  });

  const dailyData = entries?.reduce((acc, entry) => {
    const date = format(new Date(entry.startTime), 'MMM d, yyyy');
    acc[date] = (acc[date] || 0) + (entry.duration || 0);
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(dailyData || {}).map(([date, duration]) => ({
    date,
    hours: Math.round(duration / 3600 * 100) / 100,
  }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-purple-900">Reports</h1>

      <div className="h-[400px] bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="date" stroke="#6B21A8" />
            <YAxis stroke="#6B21A8" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #E9D5FF',
                borderRadius: '0.5rem'
              }}
            />
            <Bar dataKey="hours" fill="#7C3AED" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-purple-900">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-900">
              {entries?.length || 0}
            </div>
            <div className="text-sm text-purple-600">Total Entries</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-900">
              {Math.round(
                (entries?.reduce((acc, e) => acc + (e.duration || 0), 0) || 0) / 3600
              )}
            </div>
            <div className="text-sm text-purple-600">Total Hours</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-900">
              {entries?.filter(e => e.isRunning).length || 0}
            </div>
            <div className="text-sm text-purple-600">Running Timers</div>
          </div>
        </div>
      </div>
    </div>
  );
}