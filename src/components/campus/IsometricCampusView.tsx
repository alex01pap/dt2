import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Layers, ZoomIn, ZoomOut, RotateCcw, ChevronRight, Wifi, Building2 } from "lucide-react";
import { campusBuildings, campusConfig, CampusBuilding, getBuildingSensorCount, getTotalCampusSensors } from "@/data/campusLayout";
import { IsometricBuilding } from "./IsometricBuilding";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface IsometricCampusViewProps {
  onBuildingSelect?: (buildingId: string) => void;
  className?: string;
}

export function IsometricCampusView({ onBuildingSelect, className }: IsometricCampusViewProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const selectedBuildingData = campusBuildings.find(b => b.id === selectedBuilding);
  const totalSensors = getTotalCampusSensors();

  const handleBuildingSelect = (buildingId: string) => {
    setSelectedBuilding(prev => prev === buildingId ? null : buildingId);
  };

  const handleEnterBuilding = () => {
    if (selectedBuilding && onBuildingSelect) {
      onBuildingSelect(selectedBuilding);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.6));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className={cn("relative", className)}>
      <div className="flex gap-4 h-[600px]">
        {/* Main Campus View */}
        <Card className="flex-1 overflow-hidden">
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{campusConfig.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {campusBuildings.length} κτίρια • {totalSensors} αισθητήρες
                </p>
              </div>
            </div>
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleZoomOut}
                disabled={zoom <= 0.6}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleResetZoom}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleZoomIn}
                disabled={zoom >= 1.5}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 h-[calc(100%-80px)] overflow-auto">
            {/* Isometric Canvas */}
            <div 
              className="relative min-h-full flex items-center justify-center p-8"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--muted)/0.3) 0%, hsl(var(--background)) 100%)',
              }}
            >
              {/* Ground Plane */}
              <motion.div
                className="relative"
                style={{
                  width: campusConfig.gridSize.width * campusConfig.cellSize * zoom,
                  height: campusConfig.gridSize.height * campusConfig.cellSize * zoom,
                  transformOrigin: 'center center',
                }}
                animate={{ scale: zoom }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {/* Grid Background */}
                <div 
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        hsl(142 76% 36% / 0.15) 0%, 
                        hsl(142 76% 46% / 0.08) 100%
                      )
                    `,
                    boxShadow: 'inset 0 0 60px rgba(0,0,0,0.1)',
                  }}
                />
                
                {/* Grid Lines */}
                <svg 
                  className="absolute inset-0 w-full h-full opacity-20"
                  style={{ pointerEvents: 'none' }}
                >
                  {/* Vertical lines */}
                  {Array.from({ length: campusConfig.gridSize.width + 1 }).map((_, i) => (
                    <line
                      key={`v-${i}`}
                      x1={i * campusConfig.cellSize}
                      y1={0}
                      x2={i * campusConfig.cellSize}
                      y2={campusConfig.gridSize.height * campusConfig.cellSize}
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  ))}
                  {/* Horizontal lines */}
                  {Array.from({ length: campusConfig.gridSize.height + 1 }).map((_, i) => (
                    <line
                      key={`h-${i}`}
                      x1={0}
                      y1={i * campusConfig.cellSize}
                      x2={campusConfig.gridSize.width * campusConfig.cellSize}
                      y2={i * campusConfig.cellSize}
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  ))}
                </svg>

                {/* Decorative Elements - Trees/Paths */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Main pathway */}
                  <div 
                    className="absolute bg-stone-300/40 rounded"
                    style={{
                      left: campusConfig.cellSize * 5,
                      top: campusConfig.cellSize * 2,
                      width: campusConfig.cellSize * 0.5,
                      height: campusConfig.cellSize * 8,
                    }}
                  />
                  {/* Cross pathway */}
                  <div 
                    className="absolute bg-stone-300/40 rounded"
                    style={{
                      left: campusConfig.cellSize * 0.5,
                      top: campusConfig.cellSize * 6,
                      width: campusConfig.cellSize * 9,
                      height: campusConfig.cellSize * 0.5,
                    }}
                  />
                </div>

                {/* Buildings */}
                {campusBuildings.map((building) => (
                  <IsometricBuilding
                    key={building.id}
                    building={building}
                    isSelected={selectedBuilding === building.id}
                    isHovered={hoveredBuilding === building.id}
                    onSelect={() => handleBuildingSelect(building.id)}
                    onHover={(hovered) => setHoveredBuilding(hovered ? building.id : null)}
                    cellSize={campusConfig.cellSize}
                  />
                ))}
              </motion.div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Layers className="h-4 w-4" />
                  <span>Κάντε κλικ σε ένα κτίριο για λεπτομέρειες</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Building Details Sidebar */}
        <AnimatePresence mode="wait">
          {selectedBuildingData ? (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 320 }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Card className="h-full w-80">
                <CardHeader className="pb-3">
                  <div 
                    className="w-full h-2 rounded-full mb-3"
                    style={{ backgroundColor: selectedBuildingData.color }}
                  />
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {selectedBuildingData.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedBuildingData.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{selectedBuildingData.floors}</p>
                      <p className="text-xs text-muted-foreground">Όροφοι</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{getBuildingSensorCount(selectedBuildingData)}</p>
                      <p className="text-xs text-muted-foreground">Αισθητήρες</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Rooms List */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Χώροι ({selectedBuildingData.rooms.length})</h4>
                    <ScrollArea className="h-[280px]">
                      <div className="space-y-2 pr-4">
                        {selectedBuildingData.rooms.map((room) => (
                          <div 
                            key={room.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                          >
                            <div>
                              <p className="text-sm font-medium">{room.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Όροφος {room.floor}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {room.sensorCount && room.sensorCount > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  <Wifi className="h-3 w-3 mr-1" />
                                  {room.sensorCount}
                                </Badge>
                              )}
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <Separator />

                  {/* Enter Building Button */}
                  <Button 
                    className="w-full rounded-full"
                    onClick={handleEnterBuilding}
                  >
                    Είσοδος στο κτίριο
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-80"
            >
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <div className="p-4 rounded-full bg-muted/50 inline-block mb-4">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Επιλέξτε κτίριο</h3>
                  <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                    Κάντε κλικ σε ένα κτίριο στον χάρτη για να δείτε λεπτομέρειες
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
