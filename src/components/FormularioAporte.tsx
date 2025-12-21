import { useState } from 'react';
import { Proyecto, Aporte } from '../types';
import { DollarSign, Building, User, Calendar } from 'lucide-react';

interface FormularioAporteProps {
  proyecto: Proyecto;
  onGuardar: (aporte: Aporte) => void;
}

export function FormularioAporte({ proyecto, onGuardar }: FormularioAporteProps) {
  const [formData, setFormData] = useState({
    donante: '',
    entidad: '',
    monto: '',
    tipo: 'monetario' as 'monetario' | 'especie' | 'servicio',
    observaciones: ''
  });

  const montoFaltante = proyecto.montoRequerido - proyecto.montoRecaudado;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nuevoAporte: Aporte = {
      id: Date.now().toString(),
      proyectoId: proyecto.id,
      donante: formData.donante,
      entidad: formData.entidad,
      monto: parseInt(formData.monto),
      fecha: new Date().toISOString().split('T')[0],
      tipo: formData.tipo,
      estado: 'pendiente'
    };

    onGuardar(nuevoAporte);
  };

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
        <h3 className="text-gray-900 mb-6">Registrar Aporte</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Tipo y monto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Tipo de Aporte *</label>
              <select
                required
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'monetario' | 'especie' | 'servicio' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="monetario">Aporte Monetario</option>
                <option value="especie">Aporte en Especie</option>
                <option value="servicio">Aporte en Servicio</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 mb-2">
                <DollarSign className="w-4 h-4" />
                Monto del Aporte (COP) *
              </label>
              <input
                type="number"
                required
                min="1"
                max={montoFaltante}
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Máximo: ${montoFaltante.toLocaleString()}`}
              />
            </div>
          </div>

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
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-900">Monto del aporte:</span>
                <span className="text-blue-600">
                  ${formData.monto ? parseInt(formData.monto).toLocaleString() : '0'} COP
                </span>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="text-blue-900 mb-2">Información Importante</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>El aporte quedará en estado "Pendiente" hasta su aprobación</li>
              <li>Recibirás un comprobante digital una vez aprobado el aporte</li>
              <li>Podrás hacer seguimiento al uso de fondos desde el módulo de Gestión</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirmar Aporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
