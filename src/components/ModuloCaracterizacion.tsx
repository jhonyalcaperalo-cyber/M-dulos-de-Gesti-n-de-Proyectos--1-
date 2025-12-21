import { useState } from 'react';
import { Plus, Filter, Eye, Edit } from 'lucide-react';
import { mockProyectos, mockPersonas as Personas } from '../data/mockData';
import { FormularioProyecto } from './FormularioProyecto';
import { DetalleProyecto } from './DetalleProyecto';
import { Proyecto, EstadoProyecto } from '../types';

export function ModuloCaracterizacion() {
  const [vistaActiva, setVistaActiva] = useState<'lista' | 'nuevo' | 'detalle'>('lista');
  const [proyectos, setProyectos] = useState<Proyecto[]>(mockProyectos);
  const [filtroEstado, setFiltroEstado] = useState<EstadoProyecto | 'todos'>('todos');
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(null);

  const proyectosFiltrados = filtroEstado === 'todos' 
    ? proyectos 
    : proyectos.filter(p => p.estado === filtroEstado);

  const handleNuevoProyecto = (proyecto: Proyecto) => {
    setProyectos([...proyectos, proyecto]);
    setVistaActiva('lista');
  };

  const handleVerDetalle = (proyecto: Proyecto) => {
    setProyectoSeleccionado(proyecto);
    setVistaActiva('detalle');
  };

  const getEstadoColor = (estado: EstadoProyecto) => {
    const colores = {
      registrado: 'bg-gray-100 text-gray-800',
      validado: 'bg-blue-100 text-blue-800',
      en_espera: 'bg-yellow-100 text-yellow-800',
      activo: 'bg-green-100 text-green-800',
      finalizado: 'bg-purple-100 text-purple-800'
    };
    return colores[estado];
  };

  const getEstadoTexto = (estado: EstadoProyecto) => {
    const textos = {
      registrado: 'Registrado',
      validado: 'Validado',
      en_espera: 'En Espera',
      activo: 'Activo',
      finalizado: 'Finalizado'
    };
    return textos[estado];
  };

  if (vistaActiva === 'nuevo') {
    return (
      <div>
        <button
          onClick={() => setVistaActiva('lista')}
          className="mb-4 text-green-600 hover:text-green-700"
        >
          ← Volver a la lista
        </button>
        <FormularioProyecto onGuardar={handleNuevoProyecto} personas={Personas} />
      </div>
    );
  }

  if (vistaActiva === 'detalle' && proyectoSeleccionado) {
    return (
      <div>
        <button
          onClick={() => setVistaActiva('lista')}
          className="mb-4 text-green-600 hover:text-green-700"
        >
          ← Volver a la lista
        </button>
        <DetalleProyecto proyecto={proyectoSeleccionado} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900">Caracterización y Oferta</h2>
          <p className="text-gray-600">Registro y validación de beneficiarios y proyectos</p>
        </div>
        <button
          onClick={() => setVistaActiva('nuevo')}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <label className="text-gray-700">Filtrar por estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as EstadoProyecto | 'todos')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="todos">Todos</option>
            <option value="registrado">Registrado</option>
            <option value="validado">Validado</option>
            <option value="en_espera">En Espera</option>
            <option value="activo">Activo</option>
            <option value="finalizado">Finalizado</option>
          </select>
          <span className="text-gray-600">
            {proyectosFiltrados.length} proyecto{proyectosFiltrados.length !== 1 ? 's' : ''} encontrado{proyectosFiltrados.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Tabla de proyectos */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Proyecto</th>
                <th className="px-6 py-3 text-left text-gray-700">Categoría</th>
                <th className="px-6 py-3 text-left text-gray-700">Beneficiario</th>
                <th className="px-6 py-3 text-left text-gray-700">Ubicación</th>
                <th className="px-6 py-3 text-left text-gray-700">Estado</th>
                <th className="px-6 py-3 text-left text-gray-700">Monto Requerido</th>
                <th className="px-6 py-3 text-center text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {proyectosFiltrados.map((proyecto) => (
                <tr key={proyecto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{proyecto.nombre}</div>
                    <div className="text-gray-500">{proyecto.descripcion.slice(0, 60)}...</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{proyecto.categoria}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{proyecto.persona?.nombre}</div>
                    <div className="text-gray-500">{proyecto.persona?.documento}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{proyecto.municipio}</div>
                    <div className="text-gray-500">{proyecto.departamento}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full ${getEstadoColor(proyecto.estado)}`}>
                      {getEstadoTexto(proyecto.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    ${proyecto.montoRequerido.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleVerDetalle(proyecto)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                        title="Ver detalle"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
