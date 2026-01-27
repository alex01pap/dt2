import { Card } from '@/components/ui/card';
import { Square, DoorOpen, Layers } from 'lucide-react';

interface BuildingOverviewCardsProps {
    sqMeters: number;
    totalRooms: number;
    floors: number;
}

export const BuildingOverviewCards = ({ sqMeters, totalRooms, floors }: BuildingOverviewCardsProps) => {
    return (
        <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-900/50 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                    <Square className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Τετραγωνικά</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{sqMeters}m²</div>
            </Card>

            <Card className="p-3 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-900/50 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-1">
                    <DoorOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Αίθουσες</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalRooms}</div>
            </Card>

            <Card className="p-3 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900/50 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-1">
                    <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Όροφοι</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{floors}</div>
            </Card>
        </div>
    );
};
