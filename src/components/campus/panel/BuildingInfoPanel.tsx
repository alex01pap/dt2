import { X, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Building as BuildingType } from '@/types/building';
import { BuildingOverviewCards } from './BuildingOverviewCards';
import { RealTimeMetrics } from './RealTimeMetrics';
import { RoomList } from './RoomList';
import { EnergyProgressBar } from './EnergyProgressBar';

interface BuildingInfoPanelProps {
    building: BuildingType | null;
    onClose: () => void;
}

export const BuildingInfoPanel = ({ building, onClose }: BuildingInfoPanelProps) => {
    if (!building) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed top-0 right-0 bottom-0 w-full md:w-[380px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50 animate-in slide-in-from-right duration-300 ease-out overflow-hidden flex flex-col border-l border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                                <Building className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {building.nameGr}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {building.nameEn}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Building Overview Cards */}
                    <BuildingOverviewCards
                        sqMeters={building.sqMeters}
                        totalRooms={building.totalRooms}
                        floors={building.floors}
                    />

                    {/* Real-Time Metrics */}
                    <RealTimeMetrics
                        currentConsumption={building.currentConsumption}
                        avgTemperature={building.avgTemperature}
                        avgHumidity={building.avgHumidity}
                        occupancyPercent={building.occupancyPercent}
                    />

                    {/* Energy Progress Bar */}
                    <EnergyProgressBar
                        currentConsumption={building.currentConsumption}
                        dailyAverage={building.currentConsumption * 1.2}
                    />

                    {/* Room List */}
                    <RoomList
                        rooms={building.rooms}
                        roomsWithSensors={building.roomsWithSensors}
                        totalRooms={building.totalRooms}
                    />
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                        Τελευταία ενημέρωση: {new Date().toLocaleTimeString('el-GR')}
                    </div>
                </div>
            </div>
        </>
    );
};
