import React from 'react';
import { 
  Store, 
  LayoutDashboard, 
  Package, 
  ClipboardList,
  Users, 
  TrendingUp, 
  FileText,
  Building2,
  Settings,
  LogOut,
  Receipt,
  UsersRound,
  DollarSign,
  Bell,
  ChevronDown,
  CreditCard,
  User,
  Shield,
  HelpCircle
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { 
    icon: ClipboardList, 
    label: 'Order Management', 
    path: '/dashboard/orders',
    description: 'Manage orders and payments'
  },
  { 
    icon: Package, 
    label: 'Inventory', 
    path: '/dashboard/inventory',
    description: 'Manage products and stock'
  },
  { 
    icon: Users, 
    label: 'Customers', 
    path: '/dashboard/customers',
    description: 'Customer relationship management'
  },
  { 
    icon: Building2, 
    label: 'Suppliers', 
    path: '/dashboard/suppliers',
    description: 'Manage supplier relationships'
  },
  { 
    icon: DollarSign, 
    label: 'Expenses', 
    path: '/dashboard/expenses',
    description: 'Track and manage expenses'
  },
  { 
    icon: CreditCard, 
    label: 'Payments', 
    path: '/dashboard/payments',
    description: 'Track payment transactions'
  },
  { 
    icon: TrendingUp, 
    label: 'Analytics', 
    path: '/dashboard/analytics',
    description: 'Business insights and reports'
  },
  { 
    icon: FileText, 
    label: 'Documents', 
    path: '/dashboard/documents',
    description: 'Records and documentation'
  },
  { 
    icon: UsersRound, 
    label: 'Team', 
    path: '/dashboard/team',
    description: 'Team management'
  },
  { 
    icon: Settings, 
    label: 'Settings', 
    path: '/dashboard/settings',
    description: 'System preferences'
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const profileMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full bg-card border-r border-gray-800 sm:translate-x-0">
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-800">
            <Store className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-white">GigMan</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {profile?.full_name?.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{profile?.full_name}</p>
                <p className="text-xs text-text-secondary">{profile?.business_name}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="sm:ml-64">
        {/* Header */}
        <header className="h-16 bg-card border-b border-gray-800 flex items-center justify-between px-4 sm:px-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Right Section */}
          <div className="flex items-center ml-auto space-x-4">
            {/* Notifications */}
            <button className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>

            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {profile?.full_name?.charAt(0)}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-gray-800 py-1">
                  <Link
                    to="/dashboard/settings"
                    className="flex items-center px-4 py-2 text-text-secondary hover:text-white hover:bg-gray-800"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className="flex items-center px-4 py-2 text-text-secondary hover:text-white hover:bg-gray-800"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </Link>
                  <Link
                    to="/help"
                    className="flex items-center px-4 py-2 text-text-secondary hover:text-white hover:bg-gray-800"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-error hover:bg-gray-800"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-gray-800">
            <div className="h-full flex flex-col">
              <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
                <div className="flex items-center">
                  <Store className="h-8 w-8 text-primary" />
                  <span className="ml-2 text-xl font-bold text-white">GigMan</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-text-secondary hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}