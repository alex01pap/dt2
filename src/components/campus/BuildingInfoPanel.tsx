import { X, Thermometer, Droplet, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BuildingInfo {
    id: string;
    name: string;
    floors: number;
    rooms: Array<{
        name: string;
        floor: number;
        sensors: {
            temperature: number;
            humidity: number;
            occupancy: number;
        };
    }>;
}

interface BuildingInfoPanelProps {
    building: BuildingInfo | null;
    onClose: () => void;
}

export const BuildingInfoPanel = ({ building, onClose }: BuildingInfoPanelProps) => {
    if (!building) return null;

    return (
        <div className="absolute right-4 top-4 bottom-4 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg text-gray-900">{building.name}</h3>
                    <p className="text-sm text-gray-600">{building.floors} {building.floors === 1 ? 'Όροφος' : 'Όροφοι'}</p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="hover:bg-gray-100"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            {/* Rooms list */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                    {building.rooms.map((room, index) => (
                        <Card key={index} className="p-3 hover:shadow-md transition-shadow">
                            <div className="font-semibold text-sm text-gray-800 mb-2">
                                {room.name}
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                                Όροφος {room.floor}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="flex items-center gap-1 text-xs">
                                    <Thermometer className="w-3 h-3 text-orange-500" />
                                    <span className="font-medium">{room.sensors.temperature}°C</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <Droplet className="w-3 h-3 text-blue-500" />
                                    <span className="font-medium">{room.sensors.humidity}%</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    <Users className="w-3 h-3 text-green-500" />
                                    <span className="font-medium">{room.sensors.occupancy}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};
