import { useState } from 'react';
import { Proyecto, Aporte } from '../types';
import { DollarSign, Building, User, Calendar, CreditCard, Landmark, Smartphone, Shield } from 'lucide-react';
import { createPaymentLink, formatAmount, generateReference, isValidEmail } from '../lib/wompi';
import { toast } from 'sonner';

interface FormularioAporteProps {
  proyecto: Proyecto;
  onGuardar: (aporte: Aporte) => void;
}

type PaymentMethod = 'PSE' | 'CARD' | 'NEQUI';

export function FormularioAporte({ proyecto, onGuardar }: FormularioAporteProps) {
  const [formData, setFormData] = useState({
    donante: '',
    entidad: '',
    monto: '',
    tipo: 'monetario' as 'monetario' | 'especie' | 'servicio',
    observaciones: '',
    email: '',
    telefono: '',
    documento: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PSE');
  const [isProcessing, setIsProcessing] = useState(false);

  // Función para autocompletar datos de prueba
  const fillTestData = () => {
    setFormData({
      donante: 'Juan Pérez',
      entidad: '',
      monto: '10000',
      tipo: 'monetario',
      observaciones: 'Test de integración Wompi',
      email: 'juan@test.com',
      telefono: '3111111111',
      documento: '123456789',
    });
    setPaymentMethod('NEQUI');
    console.log('FormularioAporte.tsx - Datos de prueba autocompletados');
  };

  const montoFaltante = proyecto.montoRequerido - proyecto.montoRecaudado;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.tipo !== 'monetario') {
      // Para aportes no monetarios, guardar directamente
      guardarAporteDirecto();
      return;
    }

    // Para aportes monetarios, redirigir a Wompi
    await procesarPagoWompi();
  };

  const guardarAporteDirecto = () => {
    const nuevoAporte: Aporte = {
      id: generateReference('APORTE'),
      proyectoId: proyecto.id,
      donante: formData.donante,
      entidad: formData.entidad,
      monto: parseInt(formData.monto),
      fecha: new Date().toISOString().split('T')[0],
      tipo: formData.tipo,
      estado: 'pendiente',
    };

    onGuardar(nuevoAporte);
  };

  const procesarPagoWompi = async () => {
    const monto = parseInt(formData.monto);
    
    if (!isValidEmail(formData.email)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    if (monto < 10000) {
      toast.error('El monto mínimo es de $10.000 COP');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await createPaymentLink({
        reference: generateReference('WOMPI'),
        amountInCents: monto * 100,
        currency: 'COP',
        customerEmail: formData.email,
        customerName: formData.donante,
        customerPhone: formData.telefono,
        customerDocument: formData.documento,
        customerDocumentType: 'CC',
        projectId: proyecto.id,
        projectName: proyecto.nombre,
      });

      console.log('FormularioAporte.tsx - Wompi response:', response);
      console.log('FormularioAporte.tsx - id:', response.id);
      
      // Usamos la URL de redirect que devuelve Wompi, o construimos la URL de producción
      const redirectUrl = response.redirect_url || `https://checkout.wompi.co/l/${response.id}`;
      const reference = response.reference || response.id;
      
      console.log('FormularioAporte.tsx - redirect_url:', redirectUrl);
      console.log('FormularioAporte.tsx - reference:', reference);

      // Mostrar info en pantalla antes de redirigir
      alert(`Payment link creado!\nID: ${response.id}\nReference: ${reference}\nRedirect URL: ${redirectUrl}`);

      // Guardar el aporte pendiente en Supabase
      const nuevoAporte: Aporte = {
        id: reference,
        proyectoId: proyecto.id,
        donante: formData.donante,
        entidad: formData.entidad,
        monto: monto,
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'monetario',
        estado: 'pendiente',
      };

      // Guardar referencia del pago para cuando regrese de Wompi
      localStorage.setItem(`wompi_reference_${reference}`, JSON.stringify(nuevoAporte));

      // Redirigir al checkout de Wompi
      window.location.href = redirectUrl;

    } catch (error) {
      console.error('Error al procesar pago:', error);
      toast.error('Error al iniciar el pago. Por favor intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const esPagoMonetario = formData.tipo === 'monetario';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Información del proyecto */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-gray-900 mb-4">Apalancar Proyecto</h2>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="text-gray-900 mb-2">{proyecto.nombre}</h3>
          <p className="text-gray-600">{proyecto.descripcion}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-gray-600">Monto requerido</div>
              <div className="text-gray-900">${proyecto.montoRequerido.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-green-500" />
            <div>
              <div className="text-gray-600">Ya recaudado</div>
              <div className="text-green-600">${proyecto.montoRecaudado.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-gray-600">Faltante</div>
              <div className="text-blue-600">${montoFaltante.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de aporte */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-gray-900">Registrar Aporte</h3>
          <button
            type="button"
            onClick={fillTestData}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Llenar datos de prueba (Wompi)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de aporte */}
          <div>
            <label className="block text-gray-700 mb-2">Tipo de Aporte *</label>
            <select
              required
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'monetario' | 'especie' | 'servicio' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="monetario">Aporte Monetario (Pago en línea)</option>
              <option value="especie">Aporte en Especie</option>
              <option value="servicio">Aporte en Servicio</option>
            </select>
          </div>

          {/* Información del donante */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-gray-700 mb-2">
                <User className="w-4 h-4" />
                Nombre del Donante *
              </label>
              <input
                type="text"
                required
                value={formData.donante}
                onChange={(e) => setFormData({ ...formData, donante: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 mb-2">
                <Building className="w-4 h-4" />
                Entidad u Organización *
              </label>
              <input
                type="text"
                required
                value={formData.entidad}
                onChange={(e) => setFormData({ ...formData, entidad: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Fundación ABC"
              />
            </div>
          </div>

          {/* Email y teléfono (requeridos para pagos online) */}
          {esPagoMonetario && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Email *
                </label>
                <input
                  type="email"
                  required={esPagoMonetario}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: juan@email.com"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 mb-2">
                  <Smartphone className="w-4 h-4" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 3001234567"
                />
              </div>
            </div>
          )}

          {/* Monto */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 mb-2">
              <DollarSign className="w-4 h-4" />
              {esPagoMonetario ? 'Monto del Aporte (COP) *' : 'Valor estimado (COP)'}
            </label>
            <input
              type="number"
              required
              min={esPagoMonetario ? 10000 : 1}
              max={montoFaltante}
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`${esPagoMonetario ? 'Mínimo: $10.000' : 'Valor del aporte en especie'}`}
            />
            {esPagoMonetario && (
              <p className="text-sm text-gray-500 mt-1">Monto mínimo: $10.000 COP</p>
            )}
          </div>

          {/* Nota: El método de pago se selecciona en el checkout de Wompi */}
          {/* Métodos de pago eliminados - Wompi payment links ya preguntan por el método */}

          {/* Observaciones */}
          <div>
            <label className="block text-gray-700 mb-2">Observaciones (Opcional)</label>
            <textarea
              rows={4}
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Agrega comentarios o condiciones del aporte..."
            />
          </div>

          {/* Resumen */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-gray-900 mb-3">Resumen del Aporte</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Proyecto:</span>
                <span className="text-gray-900">{proyecto.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Donante:</span>
                <span className="text-gray-900">{formData.donante || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Entidad:</span>
                <span className="text-gray-900">{formData.entidad || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="text-gray-900">{formData.tipo}</span>
              </div>
              {esPagoMonetario && (
                <>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-900 font-medium">Monto del aporte:</span>
                    <span className="text-blue-600 font-bold text-lg">
                      ${formData.monto ? parseInt(formData.monto).toLocaleString() : '0'} COP
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    El método de pago se seleccionará en el checkout de Wompi
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Información de seguridad */}
          {esPagoMonetario && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <h4 className="text-green-900 font-medium">Pago Seguro</h4>
              </div>
              <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
                <li>Pago procesado por Wompi (Bancolombia)</li>
                <li>Cifrado SSL de 256 bits</li>
                <li>Accepted: PSE, Tarjetas de crédito, Nequi</li>
              </ul>
            </div>
          )}

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="text-blue-900 mb-2">Información Importante</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              {esPagoMonetario ? (
                <>
                  <li>Serás redirigido a Wompi para completar el pago de forma segura</li>
                  <li>Recibirás un comprobante por email después del pago</li>
                  <li>El aporte quedará confirmado una vez aprobado el pago</li>
                </>
              ) : (
                <>
                  <li>El aporte quedará en estado "Pendiente" hasta su aprobación</li>
                  <li>Recibirás un comprobante digital una vez aprobado el aporte</li>
                  <li>Podrás hacer seguimiento al uso de fondos desde el módulo de Gestión</li>
                </>
              )}
            </ul>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={isProcessing}
              className={`px-6 py-3 text-white rounded-lg transition-colors ${
                isProcessing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </span>
              ) : esPagoMonetario ? (
                'Proceder al pago'
              ) : (
                'Confirmar Aporte'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
