import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TimeEntry } from "@shared/schema";

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: entries } = useQuery<TimeEntry[]>({
    queryKey: ["/api/time-entries"],
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold">Calendar View</h1>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="w-full md:w-auto bg-card p-3 md:p-4 rounded-lg border">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Entries for {date?.toLocaleDateString()}
          </h2>
          <div className="grid gap-3">
            {entries?.filter(entry => 
              new Date(entry.startTime).toDateString() === date?.toDateString()
            ).map(entry => (
              <div
                key={entry.id}
                className="p-3 md:p-4 bg-card rounded-lg border"
              >
                <div className="font-medium">{entry.description || "No description"}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(entry.startTime).toLocaleTimeString()} - 
                  {entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : "Running"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}