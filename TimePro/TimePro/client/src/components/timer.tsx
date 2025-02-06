import { useState, useEffect } from "react";
import { Play, Pause, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { TimeEntry } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function Timer() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const createEntry = useMutation({
    mutationFn: async (data: Partial<TimeEntry>) => {
      const res = await apiRequest("POST", "/api/time-entries", data);
      return res.json();
    },
  });

  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = window.setInterval(() => {
        setElapsed(e => e + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    createEntry.mutate({
      startTime: new Date(),
      isRunning: true,
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    setElapsed(0);
    createEntry.mutate({
      endTime: new Date(),
      isRunning: false,
      duration: elapsed,
    });
    toast({
      title: "Time entry saved",
      description: `Tracked ${formatTime(elapsed)}`,
    });
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-purple-900">Time Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-mono font-bold text-center mb-6 text-purple-900">
          {formatTime(elapsed)}
        </div>
        <div className="flex justify-center space-x-3">
          <Button
            size="lg"
            className={cn(
              "min-w-[120px] transition-all",
              isRunning
                ? "bg-purple-100 text-purple-900 hover:bg-purple-200"
                : "bg-purple-600 hover:bg-purple-700"
            )}
            onClick={() => isRunning ? setIsRunning(false) : handleStart()}
          >
            {isRunning ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
            {isRunning ? "Pause" : "Start"}
          </Button>
          {isRunning && (
            <Button
              variant="destructive"
              size="lg"
              className="min-w-[120px] bg-red-500 hover:bg-red-600"
              onClick={handleStop}
            >
              <Square className="h-5 w-5 mr-2" />
              Stop
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}