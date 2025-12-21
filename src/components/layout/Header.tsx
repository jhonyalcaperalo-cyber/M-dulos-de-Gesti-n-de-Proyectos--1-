import { Bell, Search, User } from 'lucide-react';

interface HeaderProps {
  titulo: string;
  subtitulo: string;
}

export function Header({ titulo, subtitulo }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div>
            <h1 className="text-[#003366]">{titulo}</h1>
            <p className="text-gray-600 mt-0.5">{subtitulo}</p>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar proyectos..."
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0055A5] focus:border-transparent text-sm"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <button className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-[#0055A5] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-sm text-[#003366]">Admin ASEEMCO</div>
                <div className="text-xs text-gray-500">Administrador</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
