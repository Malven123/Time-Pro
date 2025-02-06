import Timer from "@/components/timer";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { TimeEntry } from "@shared/schema";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export default function Dashboard() {
  const { data: entries } = useQuery<TimeEntry[]>({
    queryKey: ["/api/time-entries"],
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-900">
          {getGreeting()}!
        </h1>
        <p className="text-sm md:text-base text-purple-600">
          {formatDate(new Date())}
        </p>
      </div>

      <Timer />

      <div>
        <h2 className="text-xl font-semibold mb-4 text-purple-900">Recent Entries</h2>
        <div className="grid gap-4">
          {entries?.slice(0, 5).map(entry => (
            <Card key={entry.id} className="bg-white border-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-purple-900">
                  {entry.description || "No description"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-purple-600">
                  Started: {new Date(entry.startTime).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="text-sm text-purple-600">
                  Duration: {Math.floor((entry.duration || 0) / 60)} minutes
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}