import { useState, useEffect } from 'react';
import { Users, Handshake, ClipboardCheck, LogIn, LogOut, User, Crown } from 'lucide-react';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ModuloCaracterizacion } from './components/ModuloCaracterizacion';
import { ModuloApalancamiento } from './components/ModuloApalancamiento';
import { ModuloGestion } from './components/ModuloGestion';
import { PagoExitoso } from './pages/PagoExitoso';
import { LoginForm } from './components/LoginForm';

type ModuloActivo = 'caracterizacion' | 'apalancamiento' | 'gestion' | 'pago-exitoso';

function AppContent() {
  const [moduloActivo, setModuloActivo] = useState<ModuloActivo>('caracterizacion');
  const [showLogin, setShowLogin] = useState(false);
  const { user, session, isLoading, signOut, isAuthenticated } = useAuth();

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

  const handleLogin = () => {
    setShowLogin(false);
  };

  const handleLogout = async () => {
    await signOut();
  };

  const tabs = [
    { id: 'caracterizacion' as const, label: 'Caracterización y Oferta', icon: Users, active: 'border-green-600 text-green-700 bg-green-50' },
    { id: 'apalancamiento' as const, label: 'Apalancamiento', icon: Handshake, active: 'border-blue-600 text-blue-700 bg-blue-50' },
    { id: 'gestion' as const, label: 'Gestión y Trazabilidad', icon: ClipboardCheck, active: 'border-purple-600 text-purple-700 bg-purple-50' },
  ];

  // Si está cargando, mostrar indicador
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-cyan-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sky-700">Cargando...</p>
        </div>
      </div>
    );
  }

  // Mostrar login en modal si está activo
  if (showLogin) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (moduloActivo === 'pago-exitoso') {
    return <PagoExitoso />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header superior */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Plataforma de Inversión Social
              </h1>
              <p className="text-gray-600 mt-1">
                Sistema de gestión y apalancamiento de proyectos sociales
              </p>
            </div>
            
            {/* Botón de login/logout */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  {/* Info del usuario */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                      {user.role === 'admin' && <Crown className="w-4 h-4 text-yellow-500" />}
                      <User className="w-4 h-4 text-gray-500" />
                      {user.full_name || user.email}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Cerrar Sesión</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm">Iniciar Sesión</span>
                </button>
              )}
            </div>
          </div>
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

      {/* Banner de sesión */}
      {user && (
        <div className="bg-sky-50 border-b border-sky-200">
          <div className="max-w-7xl mx-auto px-8 py-2">
            <p className="text-sm text-sky-700">
              <span className="font-medium">Sesión activa:</span> {user.email} 
              {user.role === 'admin' && <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">Administrador</span>}
            </p>
          </div>
        </div>
      )}

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {moduloActivo === 'caracterizacion' && <ModuloCaracterizacion />}
        {moduloActivo === 'apalancamiento' && <ModuloApalancamiento />}
        {moduloActivo === 'gestion' && <ModuloGestion />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
