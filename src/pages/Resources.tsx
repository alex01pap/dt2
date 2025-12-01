import { motion } from "framer-motion";
import { FileText, ExternalLink, Github, BookOpen, Video, Code } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Resources() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const researchPapers = [
    {
      title: "Digital Twin Technology in IoT",
      description: "Comprehensive overview of digital twin implementations in IoT infrastructure",
      type: "Research Paper",
      icon: FileText,
    },
    {
      title: "Real-time Data Synchronization Patterns",
      description: "Best practices for WebSocket-based real-time data streaming",
      type: "Technical Article",
      icon: BookOpen,
    },
    {
      title: "OpenHAB Integration Architecture",
      description: "Design patterns for integrating OpenHAB with external platforms",
      type: "Case Study",
      icon: Code,
    },
  ];

  const tools = [
    {
      name: "Supabase",
      description: "Open source Firebase alternative - Backend as a Service",
      url: "https://supabase.com",
      category: "Backend",
    },
    {
      name: "OpenHAB",
      description: "Open source smart home automation platform",
      url: "https://www.openhab.org",
      category: "IoT Platform",
    },
    {
      name: "Three.js",
      description: "JavaScript 3D library for digital twin visualization",
      url: "https://threejs.org",
      category: "3D Graphics",
    },
    {
      name: "React Three Fiber",
      description: "React renderer for Three.js",
      url: "https://docs.pmnd.rs/react-three-fiber",
      category: "3D Framework",
    },
    {
      name: "TanStack Query",
      description: "Powerful data synchronization for React applications",
      url: "https://tanstack.com/query",
      category: "Data Fetching",
    },
    {
      name: "Framer Motion",
      description: "Production-ready animation library for React",
      url: "https://www.framer.com/motion",
      category: "Animation",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-6 space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
          Resources & Research
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Tools, technologies, and research that powered this digital twin platform
        </p>
      </motion.div>

      {/* Research Section */}
      <motion.div variants={itemVariants}>
        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="h-6 w-6 text-primary" />
              Research & References
            </CardTitle>
            <CardDescription>
              Academic papers and technical articles that informed our architecture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchPapers.map((paper, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <paper.icon className="h-8 w-8 text-primary" />
                      <Badge variant="secondary">{paper.type}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-4">{paper.title}</CardTitle>
                    <CardDescription>{paper.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" size="sm" className="gap-2">
                      Read More
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tools Section */}
      <motion.div variants={itemVariants}>
        <Card className="card-enterprise">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Code className="h-6 w-6 text-primary" />
              Technology Stack & Tools
            </CardTitle>
            <CardDescription>
              Open source tools and frameworks used to build this platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <Badge variant="outline" className="mt-2">{tool.category}</Badge>
                      </div>
                    </div>
                    <CardDescription className="mt-3">{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => window.open(tool.url, '_blank')}
                    >
                      Visit Site
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Resources */}
      <motion.div variants={itemVariants}>
        <Card className="card-enterprise bg-gradient-to-br from-primary/5 to-purple-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Github className="h-6 w-6 text-primary" />
              Open Source & Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Documentation</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span>OpenHAB REST API documentation and integration patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span>Supabase real-time subscriptions and Edge Functions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span>Three.js and React Three Fiber for 3D visualization</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Community Resources</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span>OpenHAB Community Forum for integration support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span>Supabase Discord for real-time architecture discussions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                    <span>Three.js examples and digital twin implementations</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
