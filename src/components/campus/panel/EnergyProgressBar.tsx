import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface EnergyProgressBarProps {
    currentConsumption: number;
    dailyAverage?: number;
}

export const EnergyProgressBar = ({ currentConsumption, dailyAverage = 75 }: EnergyProgressBarProps) => {
    const percentage = (currentConsumption / dailyAverage) * 100;

    const getColor = () => {
        if (percentage < 80) return 'bg-green-500';
        if (percentage < 100) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getBgColor = () => {
        if (percentage < 80) return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
        if (percentage < 100) return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800';
        return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
    };

    return (
        <Card className={`p-4 ${getBgColor()}`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Κατανάλωση Ενέργειας</h3>
                <span className="text-xs text-gray-600 dark:text-gray-400">Σήμερα vs Μ.Ο.</span>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{currentConsumption}kWh / {dailyAverage}kWh</span>
                    <span className="font-bold text-gray-900 dark:text-white">{Math.round(percentage)}%</span>
                </div>

                <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${getColor()} transition-all duration-500 ease-out rounded-full`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Χαμηλή</span>
                    <span>Μέση</span>
                    <span>Υψηλή</span>
                </div>
            </div>
        </Card>
    );
};
