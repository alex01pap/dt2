import { useDigitalTwins } from '@/hooks/useDigitalTwins';
import { TwinGridCard } from './TwinGridCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface TwinsGridViewProps {
  onConfigureTwin?: (twinId: string) => void;
}

export function TwinsGridView({ onConfigureTwin }: TwinsGridViewProps) {
  const { twins, isLoading } = useDigitalTwins();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (twins.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-muted">
            <Box className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No Digital Twins Yet</h3>
            <p className="text-muted-foreground">
              Create your first digital twin to start monitoring your spaces
            </p>
          </div>
          <Button asChild>
            <Link to="/admin">
              <Plus className="h-4 w-4 mr-2" />
              Create Digital Twin
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {twins.map((twin, index) => (
        <motion.div
          key={twin.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <TwinGridCard
            twin={twin}
            sensorCount={0} // TODO: Get sensor count from useRealtimeSensors
            onConfigure={onConfigureTwin ? () => onConfigureTwin(twin.id) : undefined}
          />
        </motion.div>
      ))}

      {/* Create New Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: twins.length * 0.05 }}
      >
        <Link to="/admin">
          <Card className="h-full min-h-[240px] flex items-center justify-center hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer group">
            <CardContent className="text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Create New Twin
              </p>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    </div>
  );
}
