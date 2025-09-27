import { useState } from "react";
import { Search, Filter, GraduationCap, Play, Clock, Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CardGrid, StatsCard, CardSkeleton } from "@/components/ui/card-grid";

export default function Tutorials() {
  const [isLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const tutorialStats = [
    { title: "Available", value: "12", description: "Total tutorials", icon: GraduationCap },
    { title: "Completed", value: "0", description: "Finished", icon: Star },
    { title: "In Progress", value: "0", description: "Currently learning", icon: Play },
    { title: "Est. Time", value: "2h", description: "To complete all", icon: Clock },
  ];

  const tutorialCategories = [
    {
      title: "Getting Started",
      description: "Essential basics to get you up and running",
      count: 4,
      difficulty: "Beginner",
      estimatedTime: "30 min",
    },
    {
      title: "Asset Management",
      description: "Learn to create and manage digital assets",
      count: 3,
      difficulty: "Intermediate",
      estimatedTime: "45 min",
    },
    {
      title: "Sensor Integration",
      description: "Connect and configure IoT sensors",
      count: 2,
      difficulty: "Intermediate", 
      estimatedTime: "25 min",
    },
    {
      title: "Automation Rules",
      description: "Build powerful automation workflows",
      count: 2,
      difficulty: "Advanced",
      estimatedTime: "35 min",
    },
    {
      title: "Advanced Scenarios",
      description: "Complex simulation and testing scenarios",
      count: 1,
      difficulty: "Advanced",
      estimatedTime: "20 min",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tutorials</h1>
            <p className="text-muted-foreground">Learn to master the platform</p>
          </div>
        </div>
        
        <CardGrid>
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </CardGrid>
        
        <CardGrid>
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </CardGrid>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success text-success-foreground';
      case 'Intermediate': return 'bg-warning text-warning-foreground';
      case 'Advanced': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tutorials</h1>
          <p className="text-muted-foreground">Learn to master the platform with step-by-step guides</p>
        </div>
      </div>

      <CardGrid className="lg:grid-cols-4">
        {tutorialStats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </CardGrid>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <CardGrid className="lg:grid-cols-2">
        {tutorialCategories.map((category) => (
          <Card key={category.title} className="card-enterprise hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
                <Badge 
                  className={getDifficultyColor(category.difficulty)}
                  variant="secondary"
                >
                  {category.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{category.count} tutorials</span>
                  <span>~{category.estimatedTime}</span>
                </div>
                <Button size="sm" className="btn-enterprise">
                  Start Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardGrid>
    </div>
  );
}