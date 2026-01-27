import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, Thermometer, Droplet } from 'lucide-react';
import { Room } from '@/types/building';

interface RoomListProps {
    rooms: Room[];
    roomsWithSensors: number;
    totalRooms: number;
}

export const RoomList = ({ rooms, roomsWithSensors, totalRooms }: RoomListProps) => {
    const getStatusColor = (status: Room['sensorStatus']) => {
        switch (status) {
            case 'online':
                return 'bg-green-500';
            case 'warning':
                return 'bg-yellow-500';
            case 'offline':
                return 'bg-red-500';
            default:
                return 'bg-gray-400';
        }
    };

    const getStatusLabel = (status: Room['sensorStatus']) => {
        switch (status) {
            case 'online':
                return 'Ενεργό';
            case 'warning':
                return 'Προειδοποίηση';
            case 'offline':
                return 'Εκτός Λειτουργίας';
            default:
                return 'Άγνωστο';
        }
    };

    return (
        <Card className="p-4 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    ΧΩΡΟΙ ΜΕ ΑΙΣΘΗΤΗΡΕΣ
                </h3>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {roomsWithSensors}/{totalRooms}
                </span>
            </div>

            <ScrollArea className="h-[280px] pr-4">
                <div className="space-y-2">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="relative flex-shrink-0">
                                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(room.sensorStatus)} ring-2 ring-offset-2 ring-white dark:ring-gray-800`} />
                                    {room.sensorStatus === 'online' && (
                                        <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${getStatusColor(room.sensorStatus)} animate-ping opacity-75`} />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {room.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Όροφος {room.floor} • {getStatusLabel(room.sensorStatus)}
                                    </div>
                                </div>
                            </div>

                            {room.hasSensors && room.temperature && room.humidity && (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                                        <Thermometer className="w-3.5 h-3.5" />
                                        <span className="text-sm font-medium">{room.temperature}°</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                        <Droplet className="w-3.5 h-3.5" />
                                        <span className="text-sm font-medium">{room.humidity}%</span>
                                    </div>
                                </div>
                            )}

                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" />
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </Card>
    );
};
