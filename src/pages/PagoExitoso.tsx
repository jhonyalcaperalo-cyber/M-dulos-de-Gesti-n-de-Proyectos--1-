import { useEffect, useState } from 'react';
import { CheckCircle, ArrowLeft, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatAmount } from '../lib/wompi';

export function PagoExitoso() {
  const [loading, setLoading] = useState(true);
  const [aporte, setAporte] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Obtener referencia de sessionStorage o URL
  const referenceParam = new URLSearchParams(window.location.search).get('reference');
  const reference = referenceParam || sessionStorage.getItem('wompi_reference') || '';

  console.log('PagoExitoso.tsx - referenceParam:', referenceParam);
  console.log('PagoExitoso.tsx - sessionStorage:', sessionStorage.getItem('wompi_reference'));
  console.log('PagoExitoso.tsx - final reference:', reference);

  // NO limpiar la URL aquí - dejar que el usuario la vea para depuración
  // useEffect(() => {
  //   if (reference) {
  //     window.history.replaceState({}, '', '/?tab=gestion');
  //     sessionStorage.removeItem('wompi_reference');
  //   }
  // }, [reference]);

  const volverAProyectos = () => {
    // Limpiar parámetros de URL y volver
    window.location.href = '/?tab=apalancamiento';
  };

  useEffect(() => {
    async function fetchAporte() {
      if (!reference) {
        setError('No se encontró la referencia del pago');
        setLoading(false);
        return;
      }

      // Intentar obtener el aporte de localStorage primero
      const localData = localStorage.getItem(`wompi_reference_${reference}`);
      if (localData) {
        setAporte(JSON.parse(localData));
        setLoading(false);
        return;
      }

      // Si no está en localStorage, buscar en Supabase
      const { data, error } = await supabase
        .from('aportes')
        .select('*, proyecto:proyectos(nombre)')
        .eq('id', reference)
        .single();

      if (error) {
        console.error('Error fetching aporte:', error);
        setError('No se pudo encontrar la información del pago');
      } else {
        setAporte(data);
      }
      setLoading(false);
    }

    fetchAporte();
  }, [reference]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando tu pago...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={volverAProyectos}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a proyectos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header de éxito */}
          <div className="bg-green-500 p-8 text-center">
            <CheckCircle className="w-20 h-20 text-white mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white">¡Pago Exitoso!</h1>
            <p className="text-green-100 mt-2">Tu aporte ha sido registrado correctamente</p>
          </div>

          {/* Detalles del pago */}
          <div className="p-8">
            <div className="border-b pb-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Aporte</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Referencia</p>
                  <p className="text-gray-900 font-mono">{reference}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Fecha</p>
                  <p className="text-gray-900">{new Date().toLocaleDateString('es-CO')}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Proyecto</p>
                  <p className="text-gray-900">{aporte?.proyecto?.nombre || 'Proyecto'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Monto</p>
                  <p className="text-green-600 font-bold text-xl">
                    {aporte?.monto ? formatAmount(aporte.monto * 100) : '$0'}
                  </p>
                </div>
              </div>
            </div>

            {/* Próximos pasos */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">Próximos pasos</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>✓ Recibirás un comprobante por email</li>
                <li>✓ El proyecto recibirá los fondos</li>
                <li>✓ Podrás hacer seguimiento en el módulo de Gestión</li>
              </ul>
            </div>

            {/* Comprobante */}
            <div className="flex gap-4">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-5 h-5" />
                Descargar Comprobante
              </button>
            </div>

            {/* Volver */}
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={volverAProyectos}
                className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 mx-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                Ver más proyectos para apalancar
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Transacción procesada por Wompi (Bancolombia) • Pago seguro
        </p>
      </div>
    </div>
  );
}
