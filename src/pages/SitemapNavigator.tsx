import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Home,
    Lock,
    LayoutDashboard,
    Box,
    User,
    Building2,
    BookOpen,
    Mail,
    Shield,
    FileText,
    Users,
    Database,
    Video,
    UserPlus,
    Calendar,
    Activity,
    Layers,
    Play,
    Settings,
    AlertCircle,
    Zap,
    Target
} from 'lucide-react';

const allPages = [
    {
        category: 'Public Pages',
        pages: [
            { name: 'Home', path: '/', icon: Home, description: 'Landing page with hero and features' },
            { name: 'Authentication', path: '/auth', icon: Lock, description: 'Sign in / Sign up page' },
            { name: 'Architecture', path: '/architecture', icon: Building2, description: 'System architecture documentation' },
            { name: 'Case Study', path: '/case-study', icon: BookOpen, description: 'Resources and case studies' },
            { name: 'Request Access', path: '/request-access', icon: Mail, description: 'Request platform access form' },
            { name: 'Author', path: '/author', icon: UserPlus, description: 'About the author' },
            { name: 'Book Meeting', path: '/book-meeting', icon: Calendar, description: 'Schedule a demo meeting' },
        ],
    },
    {
        category: 'Protected Dashboard Pages',
        pages: [
            { name: 'Immersive Dashboard', path: '/dashboard', icon: LayoutDashboard, description: 'Main interactive dashboard with 3D campus' },
            { name: 'Digital Twin View', path: '/twin/kindergarten', icon: Box, description: 'Individual building digital twin (example: kindergarten)' },
            { name: 'Profile', path: '/profile', icon: User, description: 'User profile and settings' },
        ],
    },
    {
        category: 'Admin Pages',
        pages: [
            { name: 'Admin Overview', path: '/admin', icon: Shield, description: 'Admin dashboard overview' },
            { name: 'Admin - Requests', path: '/admin/requests', icon: FileText, description: 'Manage access requests' },
            { name: 'Admin - Organizations', path: '/admin/orgs', icon: Users, description: 'Manage organizations' },
            { name: 'Admin - Users', path: '/admin/users', icon: Users, description: 'User management' },
            { name: 'Admin - Digital Twins', path: '/admin/digital-twins', icon: Database, description: 'Manage digital twins and sensors' },
        ],
    },
    {
        category: 'Demo & Presentation',
        pages: [
            { name: 'Client Demo', path: '/client-demo', icon: Video, description: 'Interactive client demonstration' },
        ],
    },
    {
        category: 'Legacy/Redirected Pages',
        pages: [
            { name: 'Dashboard (Old)', path: '/sensors', icon: Activity, description: 'Redirects to /dashboard' },
            { name: 'Assets', path: '/assets', icon: Layers, description: 'Redirects to /dashboard' },
            { name: 'Rules', path: '/rules', icon: Zap, description: 'Redirects to /dashboard' },
            { name: 'Scenarios', path: '/scenarios', icon: Target, description: 'Redirects to /dashboard' },
            { name: 'Playback', path: '/playback', icon: Play, description: 'Redirects to /dashboard' },
            { name: 'Settings', path: '/settings', icon: Settings, description: 'Redirects to /dashboard' },
            { name: 'Tutorials', path: '/tutorials', icon: BookOpen, description: 'Redirects to /case-study' },
            { name: 'Status', path: '/status', icon: AlertCircle, description: 'Redirects to /dashboard' },
        ],
    },
];

export default function SitemapNavigator() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        🗺️ Complete Sitemap Navigator
                    </h1>
                    <p className="text-xl text-gray-300">
                        Explore all pages in the Digital Twin Platform
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        Click any button to navigate to that page
                    </p>
                </div>

                {/* Page Categories */}
                <div className="space-y-8">
                    {allPages.map((category, catIndex) => (
                        <Card key={catIndex} className="p-6 bg-white/10 backdrop-blur-md border-white/20">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <div className="w-2 h-8 bg-blue-500 rounded" />
                                {category.category}
                                <span className="text-sm font-normal text-gray-400 ml-2">
                                    ({category.pages.length} pages)
                                </span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {category.pages.map((page, pageIndex) => {
                                    const IconComponent = page.icon;
                                    return (
                                        <Button
                                            key={pageIndex}
                                            onClick={() => navigate(page.path)}
                                            variant="outline"
                                            className="h-auto p-4 flex flex-col items-start gap-2 bg-white/5 hover:bg-white/20 border-white/20 hover:border-white/40 transition-all group"
                                        >
                                            <div className="flex items-center gap-2 w-full">
                                                <IconComponent className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                                                <span className="font-semibold text-white text-left flex-1">
                                                    {page.name}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 text-left w-full">
                                                {page.description}
                                            </p>
                                            <code className="text-xs text-purple-300 bg-black/20 px-2 py-1 rounded">
                                                {page.path}
                                            </code>
                                        </Button>
                                    );
                                })}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Stats Section */}
                <Card className="mt-12 p-6 bg-white/10 backdrop-blur-md border-white/20">
                    <h2 className="text-xl font-bold text-white mb-4">📊 Statistics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-500/20 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-blue-300">
                                {allPages.reduce((acc, cat) => acc + cat.pages.length, 0)}
                            </div>
                            <div className="text-sm text-gray-300">Total Pages</div>
                        </div>
                        <div className="bg-green-500/20 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-green-300">
                                {allPages.find(c => c.category === 'Public Pages')?.pages.length || 0}
                            </div>
                            <div className="text-sm text-gray-300">Public Pages</div>
                        </div>
                        <div className="bg-purple-500/20 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-purple-300">
                                {allPages.find(c => c.category === 'Protected Dashboard Pages')?.pages.length || 0}
                            </div>
                            <div className="text-sm text-gray-300">Dashboard Pages</div>
                        </div>
                        <div className="bg-orange-500/20 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-orange-300">
                                {allPages.find(c => c.category === 'Admin Pages')?.pages.length || 0}
                            </div>
                            <div className="text-sm text-gray-300">Admin Pages</div>
                        </div>
                    </div>
                </Card>

                {/* Features List */}
                <Card className="mt-8 p-6 bg-white/10 backdrop-blur-md border-white/20">
                    <h2 className="text-xl font-bold text-white mb-4">✨ Key Features Implemented</h2>
                    <div className="grid md:grid-cols-2 gap-3 text-gray-200">
                        <div className="flex items-start gap-2">
                            <span className="text-green-400">✓</span>
                            <span>3D Interactive Campus Visualization</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Digital Twin Management</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Supabase Authentication & Database</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Admin Panel with RBAC</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Sensor Data Integration</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-400">✓</span>
                            <span>OpenHAB IoT Integration</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Real-time Analytics Dashboard</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Building Info Panels with Sensors</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Dark/Light Theme Support</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Multi-language Support</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Responsive Design (Mobile/Desktop)</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Asset Tree Visualization</span>
                        </div>
                    </div>
                </Card>

                {/* Back to Home */}
                <div className="mt-8 text-center">
                    <Button
                        onClick={() => navigate('/')}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
