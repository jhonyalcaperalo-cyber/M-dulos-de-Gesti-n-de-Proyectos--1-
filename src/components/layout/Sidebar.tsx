import { Users, Handshake, ClipboardCheck, LayoutDashboard } from 'lucide-react';

type ModuloActivo = 'caracterizacion' | 'apalancamiento' | 'gestion';

interface SidebarProps {
  moduloActivo: ModuloActivo;
  setModuloActivo: (modulo: ModuloActivo) => void;
}

export function Sidebar({ moduloActivo, setModuloActivo }: SidebarProps) {
  const menuItems = [
    {
      id: 'caracterizacion' as ModuloActivo,
      label: 'Caracterización',
      icon: Users,
      description: 'Mapa Social'
    },
    {
      id: 'apalancamiento' as ModuloActivo,
      label: 'Apalancamiento',
      icon: Handshake,
      description: 'Matchmaking'
    },
    { 
      id: 'gestion' as ModuloActivo,
      label: 'Gestión',
      icon: ClipboardCheck,
      description: 'Trazabilidad'
    }
  ];

  return (
    <aside className="w-72 bg-[#003366] text-white flex flex-col shadow-xl">
      {/* Logo / Brand */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0055A5] rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-white tracking-tight">ASEEMCO</h1>
            <p className="text-xs text-white/70">Plataforma Social</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = moduloActivo === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setModuloActivo(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0055A5] text-white shadow-lg'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className={`text-sm ${isActive ? '' : ''}`}>
                    {item.label}
                  </div>
                  <div className={`text-xs ${isActive ? 'text-white/90' : 'text-white/60'}`}>
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer Info */}
      <div className="px-6 py-4 border-t border-white/10">
        <div className="text-xs text-white/60">
          <p>Versión 1.0.0 MVP</p>
          <p className="mt-1">© 2024 ASEEMCO</p>
        </div>
      </div>
    </aside>
  );
}
