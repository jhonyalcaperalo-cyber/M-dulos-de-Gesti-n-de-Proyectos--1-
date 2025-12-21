import { Users, Handshake, ClipboardCheck } from 'lucide-react';

type ModuloActivo = 'caracterizacion' | 'apalancamiento' | 'gestion';

export function TopTabs({
  moduloActivo,
  setModuloActivo,
}: {
  moduloActivo: ModuloActivo;
  setModuloActivo: (m: ModuloActivo) => void;
}) {
  const tabs = [
    { id: 'caracterizacion' as const, label: 'Caracterización y Oferta', icon: Users },
    { id: 'apalancamiento' as const, label: 'Apalancamiento', icon: Handshake },
    { id: 'gestion' as const, label: 'Gestión y Trazabilidad', icon: ClipboardCheck },
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="px-8">
        <nav className="flex gap-6">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = moduloActivo === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setModuloActivo(t.id)}
                className={`flex items-center gap-2 py-3 border-b-2 text-sm transition-colors ${
                  active
                    ? 'border-green-600 text-green-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}