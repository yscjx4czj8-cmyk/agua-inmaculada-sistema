import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Droplet,
  Wrench,
  Calendar,
  DollarSign,
  BookOpen,
  FileText,
  ClipboardCheck,
  Bell,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const notificaciones = useStore((state) => state.notificaciones);
  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida).length;

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/visita', icon: ClipboardCheck, label: 'Mi Visita' },
    { to: '/calidad', icon: Droplet, label: 'Calidad' },
    { to: '/mantenimientos', icon: Wrench, label: 'Mantenimientos' },
    { to: '/agenda', icon: Calendar, label: 'Agenda' },
    { to: '/finanzas', icon: DollarSign, label: 'Finanzas' },
    { to: '/manual', icon: BookOpen, label: 'Manual' },
    { to: '/reportes', icon: FileText, label: 'Reportes' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white shadow-xl transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-pink-500 bg-clip-text text-transparent">
                  Agua Inmaculada
                </h1>
                <p className="text-xs text-gray-500 mt-1">Sistema de Gestión</p>
              </div>
            ) : (
              <Droplet className="w-8 h-8 text-primary-500" />
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
              {item.to === '/visita' && sidebarOpen && (
                <span className="ml-auto bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                  NUEVO
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-pink-500 flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <p className="font-medium text-gray-800">Soto</p>
                <p className="text-xs text-gray-500">Propietario</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-pink-500 flex items-center justify-center text-white font-bold mx-auto">
              S
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                ¡Bienvenido, Soto! 👋
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('es-MX', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Notificaciones */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                {notificacionesNoLeidas > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {notificacionesNoLeidas}
                  </span>
                )}
              </button>

              {/* Status Badge */}
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">
                  Sistema Operando
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
