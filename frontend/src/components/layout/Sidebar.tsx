import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  X,
  BarChart3,
  List,
  Users,
  User,
  Trophy,
  Search,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: undefined,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    badge: undefined,
  },
  {
    name: 'Trades',
    href: '/trades',
    icon: List,
    badge: undefined,
  },
  {
    name: 'Add Trade',
    href: '/trades/add',
    icon: PlusCircle,
    badge: undefined,
  },
  {
    name: 'Community',
    href: '/community',
    icon: Users,
    badge: undefined,
  },
  {
    name: 'Leaderboard',
    href: '/leaderboard',
    icon: Trophy,
    badge: undefined,
  },
  {
    name: 'Find Traders',
    href: '/search',
    icon: Search,
    badge: undefined,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    badge: undefined,
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:fixed lg:z-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-16 lg:mt-5 px-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={(e) => {
                if (item.badge) {
                  e.preventDefault();
                } else {
                  onClose();
                }
              }}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                  item.badge && 'opacity-60 cursor-not-allowed'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-3">
                    <item.icon
                      className={cn(
                        'h-5 w-5',
                        isActive ? 'text-blue-600' : 'text-gray-500'
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
