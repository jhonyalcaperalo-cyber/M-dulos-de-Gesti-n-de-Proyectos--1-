import { useState, useEffect } from 'react';
import { Users, Handshake, ClipboardCheck } from 'lucide-react';

import { ModuloCaracterizacion } from './components/ModuloCaracterizacion';
import { ModuloApalancamiento } from './components/ModuloApalancamiento';
import { ModuloGestion } from './components/ModuloGestion';
import { PagoExitoso } from './pages/PagoExitoso';

type ModuloActivo = 'caracterizacion' | 'apalancamiento' | 'gestion' | 'pago-exitoso';

export default function App() {
  const [moduloActivo, setModuloActivo] = useState<ModuloActivo>('caracterizacion');

  // Detectar si estamos en la página de pago exitoso
  useEffect(() => {
    const currentPath = window.location.pathname;
    
    // Si la URL tiene /null, corregirla
    if (currentPath === '/null') {
      console.log('App.tsx - Invalid /null path detected, redirecting to root');
      window.location.href = '/';
      return;
    }
    
    const params = new URLSearchParams(window.location.search);
    const paymentSuccess = params.get('payment_success');
    const reference = params.get('reference');
    
    console.log('App.tsx - Current URL:', { path: currentPath, search: window.location.search });
    console.log('App.tsx - URL params:', { paymentSuccess, reference });
    
    if (paymentSuccess === 'true' || reference) {
      console.log('Payment detected, setting modulo to pago-exitoso');
      // Guardar referencia en sessionStorage
      if (reference) {
        sessionStorage.setItem('wompi_reference', reference);
        console.log('Saved reference to sessionStorage:', reference);
      }
      setModuloActivo('pago-exitoso');
    } else {
      console.log('No payment detected in URL');
    }
  }, []);

  const tabs = [
    { id: 'caracterizacion' as const, label: 'Caracterización y Oferta', icon: Users, active: 'border-green-600 text-green-700 bg-green-50' },
    { id: 'apalancamiento' as const, label: 'Apalancamiento', icon: Handshake, active: 'border-blue-600 text-blue-700 bg-blue-50' },
    { id: 'gestion' as const, label: 'Gestión y Trazabilidad', icon: ClipboardCheck, active: 'border-purple-600 text-purple-700 bg-purple-50' },
  ];

  if (moduloActivo === 'pago-exitoso') {
    return <PagoExitoso />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header superior (como tu imagen “correcta”) */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Plataforma de Inversión Social
          </h1>
          <p className="text-gray-600 mt-1">
            Sistema de gestión y apalancamiento de proyectos sociales
          </p>
        </div>

        {/* Tabs / Slide */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-8">
            <nav className="flex gap-6">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = moduloActivo === t.id;

                return (
                  <button
                    key={t.id}
                    onClick={() => setModuloActivo(t.id)}
                    className={[
                      'flex items-center gap-2 px-4 py-3 border-b-2 rounded-t-md transition-colors',
                      isActive
                        ? `${t.active}`
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                    ].join(' ')}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{t.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {moduloActivo === 'caracterizacion' && <ModuloCaracterizacion />}
        {moduloActivo === 'apalancamiento' && <ModuloApalancamiento />}
        {moduloActivo === 'gestion' && <ModuloGestion />}
      </main>
    </div>
  );
}