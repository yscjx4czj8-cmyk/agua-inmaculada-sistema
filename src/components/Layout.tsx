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
  Settings,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useLocation } from 'react-router-dom';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const location = useLocation();
  const notificaciones = useStore((state) => state.notificaciones);
  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida).length;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Panel Principal' },
    { to: '/visita', icon: ClipboardCheck, label: 'Mi Visita' },
    { to: '/calidad', icon: Droplet, label: 'Control de Calidad' },
    { to: '/mantenimientos', icon: Wrench, label: 'Mantenimientos' },
    { to: '/agenda', icon: Calendar, label: 'Agenda de Visitas' },
    { to: '/finanzas', icon: DollarSign, label: 'Gestión Financiera' },
    { to: '/configuracion', icon: Settings, label: 'Configuración' },
    { to: '/manual', icon: BookOpen, label: 'Manual Técnico' },
    { to: '/reportes', icon: FileText, label: 'Centro de Reportes' },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden relative">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 lg:relative z-50 transform ${sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 w-0 lg:w-24'
          } glass-card m-0 lg:m-4 lg:mr-0 transition-all duration-500 ease-in-out flex flex-col overflow-hidden bg-white/95 lg:bg-white/70`}
      >
        {/* Logo */}
        <div className="p-8 pb-6">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="animate-fade-in">
                <h1 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
                  <div className="p-1.5 bg-primary-500 rounded-lg shadow-lg shadow-primary-500/30">
                    <Droplet className="w-5 h-5 text-white fill-white/20" />
                  </div>
                  Agua Inmaculada
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1.5 ml-9">
                  Enterprise v1.0
                </p>
              </div>
            ) : (
              <div className="mx-auto p-2.5 bg-primary-500 rounded-xl shadow-lg shadow-primary-500/30">
                <Droplet className="w-6 h-6 text-white fill-white/20" />
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive
                  ? 'nav-link-active'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-primary-600'
                }`
              }
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${sidebarOpen ? '' : 'mx-auto'}`} />
              {sidebarOpen && (
                <span className="font-semibold text-sm tracking-tight">{item.label}</span>
              )}
              {item.to === '/visita' && sidebarOpen && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-rose-500/20">
                  NEW
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-6 border-t border-slate-100/50">
          {sidebarOpen ? (
            <div className="flex items-center gap-4 group cursor-pointer p-2 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
                S
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 truncate">Soto</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Propietario</p>
              </div>
            </div>
          ) : (
            <div className="w-11 h-11 mx-auto rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
              S
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full h-full">
        {/* Header */}
        <header className="px-4 lg:px-8 py-4 lg:py-6 lg:h-28 flex items-center bg-white/50 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border-b border-slate-100 lg:border-none">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-600 hover:bg-slate-50 hover:shadow transition-all active:scale-95"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {sidebarOpen ? '¡Bienvenido de nuevo, Soto!' : 'Panel de Control'}
                </h2>
                <p className="text-sm font-medium text-slate-400">
                  {new Date().toLocaleDateString('es-MX', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-6">
              {/* Notificaciones */}
              <button className="relative p-2.5 lg:p-3 bg-white border border-slate-100 shadow-sm rounded-xl text-slate-600 hover:bg-slate-50 hover:shadow transition-all group active:scale-95">
                <Bell className="w-5 h-5 group-hover:shake" />
                {notificacionesNoLeidas > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold min-w-[20px] h-5 px-1 rounded-lg flex items-center justify-center shadow-lg shadow-rose-500/30">
                    {notificacionesNoLeidas}
                  </span>
                )}
              </button>

              {/* Status Badge (Desktop only or icon only on mobile) */}
              <div className="hidden sm:flex items-center gap-2.5 px-4 lg:px-5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl shadow-sm text-emerald-700">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[10px] lg:text-xs font-bold tracking-wide uppercase">
                  Sistema Activo
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto py-6 lg:py-0 space-y-8 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
