import { Card } from '@/components/ui/card';
import { Zap, Thermometer, Droplet, Users } from 'lucide-react';

interface RealTimeMetricsProps {
    currentConsumption: number;
    avgTemperature: number;
    avgHumidity: number;
    occupancyPercent: number;
}

export const RealTimeMetrics = ({
    currentConsumption,
    avgTemperature,
    avgHumidity,
    occupancyPercent
}: RealTimeMetricsProps) => {
    return (
        <Card className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900/30 border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Πραγματικός Χρόνος</h3>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                        <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Κατανάλωση</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{currentConsumption}kWh</div>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30">
                        <Thermometer className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Μ.Ο Θερμοκρασία</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{avgTemperature}°C</div>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Droplet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Μ.Ο Υγρασία</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{avgHumidity}%</div>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Πληρότητα</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{occupancyPercent}%</div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
