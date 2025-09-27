import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Upload, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyStateCard, CardSkeleton } from "@/components/ui/card-grid";

export default function Playback() {
  const [isLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState([0]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Playback</h1>
            <p className="text-muted-foreground">Replay historical data and events</p>
          </div>
        </div>
        
        <div className="grid gap-6">
          <CardSkeleton className="h-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Playback</h1>
          <p className="text-muted-foreground">Replay historical data and events</p>
        </div>
        
        <Button className="btn-enterprise">
          <Upload className="h-4 w-4 mr-2" />
          Upload Data
        </Button>
      </div>

      {/* Playback Controls */}
      <Card className="card-enterprise">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Playback Controls
          </CardTitle>
          <CardDescription>
            Control historical data playback and timeline navigation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentTime([Math.max(0, currentTime[0] - 10)])}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button 
              variant={isPlaying ? "secondary" : "default"}
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className={isPlaying ? "" : "btn-enterprise"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentTime([Math.min(100, currentTime[0] + 10)])}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 px-4">
              <Slider
                value={currentTime}
                onValueChange={setCurrentTime}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            
            <Badge variant="outline">
              {currentTime[0]}% Complete
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Start: --:--:--</span>
            <span>Current: --:--:--</span>
            <span>End: --:--:--</span>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      <div className="flex justify-center items-center min-h-[400px]">
        <EmptyStateCard
          icon={Calendar}
          title="No playback data available"
          description="Upload historical data files to start replaying past events and scenarios"
          action={{
            label: "Upload Data",
            onClick: () => console.log("Upload data clicked")
          }}
        />
      </div>
    </div>
  );
}