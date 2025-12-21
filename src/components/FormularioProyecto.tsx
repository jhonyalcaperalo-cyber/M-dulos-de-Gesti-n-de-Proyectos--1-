import { useState } from 'react';
import { Proyecto, Persona, Necesidad } from '../types';
import { Plus, X } from 'lucide-react';

interface FormularioProyectoProps {
  onGuardar: (proyecto: Proyecto) => void;
  personas: Persona[];
}

export function FormularioProyecto({ onGuardar, personas }: FormularioProyectoProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    departamento: '',
    municipio: '',
    montoRequerido: '',
    personaId: '',
    poblacionBeneficiada: '',
    empleosGenerados: ''
  });

  const [necesidades, setNecesidades] = useState<Necesidad[]>([]);
  const [nuevaNecesidad, setNuevaNecesidad] = useState({
    descripcion: '',
    categoria: '',
    prioridad: 'media' as 'alta' | 'media' | 'baja'
  });

  const categorias = ['Agricultura', 'Educación', 'Emprendimiento', 'Salud', 'Infraestructura', 'Cultura'];
  const departamentos = ['Antioquia', 'Cundinamarca', 'Valle del Cauca', 'Bolívar', 'Atlántico', 'Santander'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const personaSeleccionada = personas.find(p => p.id === formData.personaId);
    
    const nuevoProyecto: Proyecto = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      categoria: formData.categoria,
      region: 'Andina',
      departamento: formData.departamento,
      municipio: formData.municipio,
      montoRequerido: parseInt(formData.montoRequerido),
      montoRecaudado: 0,
      estado: 'registrado',
      fechaCreacion: new Date().toISOString().split('T')[0],
      personaId: formData.personaId,
      persona: personaSeleccionada,
      necesidades: necesidades,
      poblacionBeneficiada: parseInt(formData.poblacionBeneficiada),
      empleosGenerados: parseInt(formData.empleosGenerados)
    };

    onGuardar(nuevoProyecto);
  };

  const agregarNecesidad = () => {
    if (nuevaNecesidad.descripcion && nuevaNecesidad.categoria) {
      setNecesidades([
        ...necesidades,
        {
          id: Date.now().toString(),
          ...nuevaNecesidad
        }
      ]);
      setNuevaNecesidad({ descripcion: '', categoria: '', prioridad: 'media' });
    }
  };

  const eliminarNecesidad = (id: string) => {
    setNecesidades(necesidades.filter(n => n.id !== id));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-gray-900 mb-6">Registrar Nuevo Proyecto</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Nombre del Proyecto *</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Categoría *</label>
            <select
              required
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Seleccione...</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Descripción *</label>
          <textarea
            required
            rows={4}
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Ubicación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Departamento *</label>
            <select
              required
              value={formData.departamento}
              onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Seleccione...</option>
              {departamentos.map(dep => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Municipio *</label>
            <input
              type="text"
              required
              value={formData.municipio}
              onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Beneficiario */}
        <div>
          <label className="block text-gray-700 mb-2">Beneficiario Responsable *</label>
          <select
            required
            value={formData.personaId}
            onChange={(e) => setFormData({ ...formData, personaId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Seleccione una persona...</option>
            {personas.map(persona => (
              <option key={persona.id} value={persona.id}>
                {persona.nombre} - {persona.documento}
              </option>
            ))}
          </select>
        </div>

        {/* Impacto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Monto Requerido (COP) *</label>
            <input
              type="number"
              required
              value={formData.montoRequerido}
              onChange={(e) => setFormData({ ...formData, montoRequerido: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Población Beneficiada *</label>
            <input
              type="number"
              required
              value={formData.poblacionBeneficiada}
              onChange={(e) => setFormData({ ...formData, poblacionBeneficiada: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Empleos a Generar *</label>
            <input
              type="number"
              required
              value={formData.empleosGenerados}
              onChange={(e) => setFormData({ ...formData, empleosGenerados: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Necesidades */}
        <div className="border-t pt-6">
          <h3 className="text-gray-900 mb-4">Necesidades del Proyecto</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Descripción"
              value={nuevaNecesidad.descripcion}
              onChange={(e) => setNuevaNecesidad({ ...nuevaNecesidad, descripcion: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Categoría"
              value={nuevaNecesidad.categoria}
              onChange={(e) => setNuevaNecesidad({ ...nuevaNecesidad, categoria: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              value={nuevaNecesidad.prioridad}
              onChange={(e) => setNuevaNecesidad({ ...nuevaNecesidad, prioridad: e.target.value as 'alta' | 'media' | 'baja' })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="baja">Prioridad Baja</option>
              <option value="media">Prioridad Media</option>
              <option value="alta">Prioridad Alta</option>
            </select>
            <button
              type="button"
              onClick={agregarNecesidad}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>

          {necesidades.length > 0 && (
            <div className="space-y-2">
              {necesidades.map((necesidad) => (
                <div key={necesidad.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <span className="text-gray-900">{necesidad.descripcion}</span>
                    <span className="text-gray-500 mx-2">•</span>
                    <span className="text-gray-600">{necesidad.categoria}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-white ${
                      necesidad.prioridad === 'alta' ? 'bg-red-500' :
                      necesidad.prioridad === 'media' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}>
                      {necesidad.prioridad}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => eliminarNecesidad(necesidad.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Guardar Proyecto
          </button>
        </div>
      </form>
    </div>
  );
}
