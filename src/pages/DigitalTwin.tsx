import { useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Settings, Play, Pause, RotateCcw, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardSkeleton } from "@/components/ui/card-grid";
import { Link } from "react-router-dom";

export default function DigitalTwin() {
  const { id } = useParams();
  const [isLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/assets">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Digital Twin</h1>
            <p className="text-muted-foreground">Loading twin configuration...</p>
          </div>
        </div>
        
        <div className="grid gap-6">
          <CardSkeleton className="h-64" />
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
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/assets">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Digital Twin #{id}</h1>
            <p className="text-muted-foreground">Interactive digital replica and simulation environment</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isRunning ? "default" : "secondary"}>
            {isRunning ? "Running" : "Stopped"}
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Twin Viewer */}
      <Card className="card-enterprise">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>3D Twin Environment</CardTitle>
              <CardDescription>Real-time digital twin visualization and interaction</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center border-2 border-dashed border-muted">
            <div className="text-center text-muted-foreground">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium">Digital Twin Viewer</p>
              <p className="text-sm">3D environment will be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Twin Properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle className="text-base">Twin Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">ID:</span>
              <span className="text-sm font-medium">{id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge variant={isRunning ? "default" : "secondary"} className="text-xs">
                {isRunning ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Created:</span>
              <span className="text-sm">Just now</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Type:</span>
              <span className="text-sm">Generic</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle className="text-base">Connected Sensors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No sensors connected</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle className="text-base">Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No recent events</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}