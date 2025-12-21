import { useState } from 'react';
import { Hito } from '../types';
import { X } from 'lucide-react';

interface FormularioHitoProps {
  proyectoId: string;
  onGuardar: (hito: Hito) => void;
  onCancelar: () => void;
}

export function FormularioHito({ proyectoId, onGuardar, onCancelar }: FormularioHitoProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nuevoHito: Hito = {
      id: Date.now().toString(),
      proyectoId,
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      fecha: formData.fecha,
      completado: false,
      documentos: []
    };

    onGuardar(nuevoHito);
    setFormData({ titulo: '', descripcion: '', fecha: new Date().toISOString().split('T')[0] });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-gray-900">Registrar Nuevo Hito</h4>
        <button
          type="button"
          onClick={onCancelar}
          className="p-1 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Título del Hito *</label>
          <input
            type="text"
            required
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Ej: Compra de equipamiento"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Descripción *</label>
          <textarea
            required
            rows={3}
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Describe el hito y los resultados esperados..."
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Fecha *</label>
          <input
            type="date"
            required
            value={formData.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Guardar Hito
          </button>
        </div>
      </div>
    </form>
  );
}
