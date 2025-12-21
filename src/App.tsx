import { useState } from 'react';
import { ModuloCaracterizacion } from './components/ModuloCaracterizacion';
import { ModuloApalancamiento } from './components/ModuloApalancamiento';
import { ModuloGestion } from './components/ModuloGestion';
import { Users, Handshake, ClipboardCheck } from 'lucide-react';

type ModuloActivo = 'caracterizacion' | 'apalancamiento' | 'gestion';

export default function App() {
  const [moduloActivo, setModuloActivo] = useState<ModuloActivo>('caracterizacion');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-gray-900">Plataforma de Inversión Social</h1>
          <p className="text-gray-600">Sistema de gestión y apalancamiento de proyectos sociales</p>
        </div>
      </header>

      {/* Navegación de módulos */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            <button
              onClick={() => setModuloActivo('caracterizacion')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                moduloActivo === 'caracterizacion'
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              Caracterización y Oferta
            </button>
            
            <button
              onClick={() => setModuloActivo('apalancamiento')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                moduloActivo === 'apalancamiento'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Handshake className="w-5 h-5" />
              Apalancamiento
            </button>
            
            <button
              onClick={() => setModuloActivo('gestion')}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                moduloActivo === 'gestion'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <ClipboardCheck className="w-5 h-5" />
              Gestión y Trazabilidad
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido del módulo activo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {moduloActivo === 'caracterizacion' && <ModuloCaracterizacion />}
        {moduloActivo === 'apalancamiento' && <ModuloApalancamiento />}
        {moduloActivo === 'gestion' && <ModuloGestion />}
      </main>
    </div>
  );
}
