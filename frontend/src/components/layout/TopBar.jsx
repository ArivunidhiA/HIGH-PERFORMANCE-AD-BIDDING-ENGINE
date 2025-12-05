import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut } from 'lucide-react';

export default function TopBar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-surface border-b border-surface-light px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-text-primary">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-surface-light rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-text-secondary" />
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-light rounded-lg">
          <User className="w-4 h-4 text-text-secondary" />
          <span className="text-sm text-text-primary">{user?.email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-surface-light rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 text-text-secondary" />
        </button>
      </div>
    </header>
  );
}

