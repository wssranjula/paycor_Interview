import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Home, 
  Plus, 
  FileText, 
  UserCheck, 
  Briefcase 
} from 'lucide-react';
import SmartHireLogo from "../assets/SmartHireLogo.png";

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/create-interviews',
      label: 'Interview Management',
      icon: Home,
      description: 'Create and manage interviews'
    },
    {
      path: '/intern_software_engineer',
      label: 'Software Engineer',
      icon: FileText,
      description: 'Intern Software Engineer CV Upload'
    },
    {
      path: '/business_analyst',
      label: 'Business Analyst', 
      icon: UserCheck,
      description: 'Business Analyst CV Upload'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img width={180} height={75} src={SmartHireLogo} className="inline-block mx-auto mb-4" alt="SmartHire Logo" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SmartHire Platform</h1>
          <p className="text-gray-600">Choose your interview approach</p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                  isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-white'
                }`}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      isActive ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {item.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                    {isActive && (
                      <div className="mt-3">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Current Page
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Info */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <Plus className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">Dynamic Interview Creation</h3>
                  <p>Create custom interviews with any job description and title</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">CV-Based Questions</h3>
                  <p>AI generates personalized questions based on uploaded CVs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserCheck className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">Real-time Evaluation</h3>
                  <p>Comprehensive assessment with detailed feedback</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">Multiple Job Roles</h3>
                  <p>Support for various positions and experience levels</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Navigation;