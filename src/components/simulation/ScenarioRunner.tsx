import React, { useState, useCallback, useMemo } from 'react';
import { Play, Square, RotateCcw, Download, Upload, Settings, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ScenarioInput {
  id: string;
  name: string;
  type: 'number' | 'text' | 'boolean' | 'range' | 'selection';
  value: any;
  min?: number;
  max?: number;
  options?: string[];
  required?: boolean;
}

interface ScenarioResult {
  timestamp: Date;
  metrics: Record<string, number>;
  events: Array<{
    time: Date;
    severity: 'info' | 'warning' | 'error';
    message: string;
  }>;
  status: 'success' | 'warning' | 'error';
}

interface ScenarioConfig {
  id?: string;
  name: string;
  description?: string;
  duration: number; // seconds
  inputs: ScenarioInput[];
  expectedOutputs?: string[];
}

interface ScenarioComparison {
  baseline: ScenarioResult;
  current: ScenarioResult;
  differences: Array<{
    metric: string;
    baselineValue: number;
    currentValue: number;
    difference: number;
    percentChange: number;
  }>;
}

interface ScenarioRunnerProps {
  scenario?: ScenarioConfig;
  onScenarioSave?: (scenario: ScenarioConfig) => void;
  onResultsExport?: (results: ScenarioResult[]) => void;
  className?: string;
}

const defaultScenario: ScenarioConfig = {
  name: 'New Scenario',
  description: '',
  duration: 300, // 5 minutes
  inputs: [
    {
      id: 'temperature',
      name: 'Temperature (°C)',
      type: 'range',
      value: [20, 25],
      min: -10,
      max: 50,
      required: true
    },
    {
      id: 'sensor_count',
      name: 'Active Sensors',
      type: 'number',
      value: 10,
      min: 1,
      max: 100,
      required: true
    }
  ]
};

const InputEditor: React.FC<{
  input: ScenarioInput;
  onChange: (input: ScenarioInput) => void;
  onDelete: () => void;
}> = ({ input, onChange, onDelete }) => {
  const handleValueChange = (value: any) => {
    onChange({ ...input, value });
  };

  const renderValueInput = () => {
    switch (input.type) {
      case 'number':
        return (
          <Input
            type="number"
            value={input.value || 0}
            onChange={(e) => handleValueChange(parseFloat(e.target.value) || 0)}
            min={input.min}
            max={input.max}
          />
        );

      case 'text':
        return (
          <Input
            type="text"
            value={input.value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
          />
        );

      case 'boolean':
        return (
          <Select value={input.value?.toString()} onValueChange={(v) => handleValueChange(v === 'true')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        );

      case 'range':
        const [min, max] = Array.isArray(input.value) ? input.value : [input.min || 0, input.max || 100];
        return (
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={min}
              onChange={(e) => handleValueChange([parseFloat(e.target.value) || 0, max])}
            />
            <Input
              type="number"
              placeholder="Max"
              value={max}
              onChange={(e) => handleValueChange([min, parseFloat(e.target.value) || 0])}
            />
          </div>
        );

      case 'selection':
        return (
          <Select value={input.value} onValueChange={handleValueChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {input.options?.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return <Input value={input.value || ''} onChange={(e) => handleValueChange(e.target.value)} />;
    }
  };

  return (
    <Card className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label>Name</Label>
          <Input
            value={input.name}
            onChange={(e) => onChange({ ...input, name: e.target.value })}
          />
        </div>

        <div>
          <Label>Type</Label>
          <Select value={input.type} onValueChange={(type: any) => onChange({ ...input, type })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="range">Range</SelectItem>
              <SelectItem value="selection">Selection</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Value</Label>
          {renderValueInput()}
        </div>

        <div className="flex items-end">
          <Button variant="destructive" size="sm" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

const ResultsViewer: React.FC<{
  results: ScenarioResult[];
  comparison?: ScenarioComparison;
}> = ({ results, comparison }) => {
  const latestResult = results[results.length - 1];

  if (!latestResult) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No results available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            {latestResult.status === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{latestResult.status}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold">{latestResult.events.length}</p>
          </div>
        </Card>

        <Card className="p-4">
          <div>
            <p className="text-sm text-muted-foreground">Metrics</p>
            <p className="text-2xl font-bold">{Object.keys(latestResult.metrics).length}</p>
          </div>
        </Card>
      </div>

      {/* Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(latestResult.metrics).map(([key, value]) => (
              <div key={key} className="text-center">
                <p className="text-sm text-muted-foreground">{key}</p>
                <p className="text-xl font-bold">{value.toFixed(2)}</p>
                {comparison && (
                  <div className="text-xs">
                    {comparison.differences.find(d => d.metric === key) && (
                      <Badge
                        variant={
                          (comparison.differences.find(d => d.metric === key)?.difference || 0) > 0
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {(comparison.differences.find(d => d.metric === key)?.percentChange || 0) > 0 ? '+' : ''}
                        {(comparison.differences.find(d => d.metric === key)?.percentChange || 0).toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Events */}
      <Card>
        <CardHeader>
          <CardTitle>Events Log</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {latestResult.events.map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-2 border rounded">
                  <Badge
                    variant={
                      event.severity === 'error' ? 'destructive' :
                      event.severity === 'warning' ? 'secondary' : 'outline'
                    }
                  >
                    {event.severity}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {event.time.toLocaleTimeString()}
                  </span>
                  <span className="flex-1">{event.message}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Comparison */}
      {comparison && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison with Baseline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comparison.differences.map((diff) => (
                <div key={diff.metric} className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">{diff.metric}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span>Baseline: {diff.baselineValue.toFixed(2)}</span>
                    <span>Current: {diff.currentValue.toFixed(2)}</span>
                    <Badge
                      variant={diff.difference > 0 ? 'default' : 'secondary'}
                    >
                      {diff.difference > 0 ? '+' : ''}{diff.percentChange.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const ScenarioRunner: React.FC<ScenarioRunnerProps> = ({
  scenario: initialScenario,
  onScenarioSave,
  onResultsExport,
  className = ''
}) => {
  const [scenario, setScenario] = useState<ScenarioConfig>(initialScenario || defaultScenario);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScenarioResult[]>([]);
  const [comparison, setComparison] = useState<ScenarioComparison | null>(null);

  const runScenario = useCallback(async () => {
    setIsRunning(true);
    setProgress(0);

    // Simulate scenario execution
    const totalSteps = 100;
    const stepDuration = (scenario.duration * 1000) / totalSteps;

    for (let i = 0; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      setProgress((i / totalSteps) * 100);
    }

    // Generate mock results
    const mockResult: ScenarioResult = {
      timestamp: new Date(),
      metrics: {
        avgTemperature: 22.5 + Math.random() * 3,
        maxPressure: 101.3 + Math.random() * 2,
        efficiency: 85 + Math.random() * 10,
        errorRate: Math.random() * 5
      },
      events: [
        {
          time: new Date(Date.now() - Math.random() * 300000),
          severity: 'info',
          message: 'Scenario started successfully'
        },
        {
          time: new Date(Date.now() - Math.random() * 200000),
          severity: 'warning',
          message: 'Temperature threshold approached'
        },
        {
          time: new Date(),
          severity: 'info',
          message: 'Scenario completed'
        }
      ],
      status: Math.random() > 0.2 ? 'success' : 'warning'
    };

    setResults(prev => [...prev, mockResult]);
    setIsRunning(false);
  }, [scenario]);

  const stopScenario = useCallback(() => {
    setIsRunning(false);
    setProgress(0);
  }, []);

  const resetResults = useCallback(() => {
    setResults([]);
    setComparison(null);
    setProgress(0);
  }, []);

  const addInput = useCallback(() => {
    const newInput: ScenarioInput = {
      id: Date.now().toString(),
      name: 'New Input',
      type: 'number',
      value: 0
    };
    setScenario(prev => ({
      ...prev,
      inputs: [...prev.inputs, newInput]
    }));
  }, []);

  const updateInput = useCallback((index: number, input: ScenarioInput) => {
    setScenario(prev => ({
      ...prev,
      inputs: prev.inputs.map((inp, i) => i === index ? input : inp)
    }));
  }, []);

  const deleteInput = useCallback((index: number) => {
    setScenario(prev => ({
      ...prev,
      inputs: prev.inputs.filter((_, i) => i !== index)
    }));
  }, []);

  const handleSave = useCallback(() => {
    if (onScenarioSave) {
      onScenarioSave(scenario);
    }
  }, [scenario, onScenarioSave]);

  const handleExport = useCallback(() => {
    if (onResultsExport) {
      onResultsExport(results);
    }
  }, [results, onResultsExport]);

  const canRun = scenario.inputs.every(input => 
    !input.required || (input.value !== null && input.value !== undefined && input.value !== '')
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Scenario Runner
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="configure" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="run">Run</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="configure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={scenario.name}
                    onChange={(e) => setScenario(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={scenario.duration}
                    onChange={(e) => setScenario(prev => ({ ...prev, duration: parseInt(e.target.value) || 300 }))}
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  value={scenario.description || ''}
                  onChange={(e) => setScenario(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Input Parameters</CardTitle>
                <Button onClick={addInput} size="sm">
                  Add Input
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scenario.inputs.map((input, index) => (
                  <InputEditor
                    key={input.id}
                    input={input}
                    onChange={(updated) => updateInput(index, updated)}
                    onDelete={() => deleteInput(index)}
                  />
                ))}

                {scenario.inputs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No inputs configured. Add some parameters to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleSave}>
              Save Scenario
            </Button>
          </div>
        </TabsContent>

        {/* Run Tab */}
        <TabsContent value="run" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{scenario.name}</CardTitle>
              {scenario.description && (
                <p className="text-muted-foreground">{scenario.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={isRunning ? stopScenario : runScenario}
                    disabled={!canRun && !isRunning}
                    className={isRunning ? '' : 'btn-enterprise'}
                  >
                    {isRunning ? (
                      <>
                        <Square className="h-4 w-4 mr-2" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Scenario
                      </>
                    )}
                  </Button>

                  <Button variant="outline" onClick={resetResults}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  Duration: {scenario.duration}s
                </div>
              </div>

              {(isRunning || progress > 0) && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {!canRun && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    Please fill in all required input parameters before running the scenario.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Input Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Current Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {scenario.inputs.map(input => (
                  <div key={input.id} className="p-3 border rounded">
                    <p className="font-medium">{input.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {Array.isArray(input.value) 
                        ? `${input.value[0]} - ${input.value[1]}`
                        : input.value?.toString() || 'Not set'
                      }
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              Simulation Results ({results.length} runs)
            </h3>
            {results.length > 0 && (
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            )}
          </div>

          <ResultsViewer results={results} comparison={comparison} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScenarioRunner;