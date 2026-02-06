import { useState } from 'react';
import { Plus, Filter, Eye, MapPin, Users, DollarSign } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { DetalleProyecto } from './DetalleProyecto';
import { Proyecto, EstadoProyecto } from '../types';
import { toast } from 'sonner';

import type { ProyectoFormData } from '../types';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';

export function ModuloCaracterizacion() {
  const { proyectos, loading, personas } = useAppContext();

  const [vistaActiva, setVistaActiva] = useState<'lista' | 'detalle'>('lista');
  const [filtroEstado, setFiltroEstado] = useState<EstadoProyecto | 'todos'>('todos');
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProyectoFormData>();

  // Filtrar proyectos por estado
  const proyectosFiltrados = filtroEstado === 'todos'
    ? proyectos
    : proyectos.filter(p => p.estado === filtroEstado);

  const estados: EstadoProyecto[] = ['registrado', 'validado', 'en_espera', 'activo', 'finalizado'];

  const getEstadoColor = (estado: EstadoProyecto) => {
    switch (estado) {
      case 'registrado': return 'bg-gray-100 text-gray-800';
      case 'validado': return 'bg-blue-100 text-blue-800';
      case 'en_espera': return 'bg-yellow-100 text-yellow-800';
      case 'activo': return 'bg-green-100 text-green-800';
      case 'finalizado': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVerDetalle = (proyecto: Proyecto) => {
    setProyectoSeleccionado(proyecto);
    setVistaActiva('detalle');
  };

  const onSubmit = async (data: ProyectoFormData) => {
    console.log('Enviando datos:', data);
    
    // Usar los nombres exactos de las columnas de Supabase según el schema
    const nuevoProyecto = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      categoria: data.categoria,
      region: data.region,
      departamento: data.departamento,
      municipio: data.municipio,
      montorequerido: data.montoRequerido,
      monto_recaudado: 0,
      persona_id: data.personaId || null,
      poblacionbeneficiada: data.poblacionBeneficiada,
      empleosgenerados: data.empleosGenerados,
      estado: 'registrado',
      fechacreacion: new Date().toLocaleDateString("es-ES"),
    };

    console.log('Proyecto a insertar:', nuevoProyecto);

    const { error } = await supabase.from("proyectos").insert(nuevoProyecto);

    if (error) {
      console.error('Error de Supabase:', error);
      toast.error("Ups, no se pudo guardar el proyecto: " + error.message);
    } else {
      toast.success("Proyecto creado exitosamente");
      reset();
      setMostrarFormulario(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (vistaActiva === 'detalle' && proyectoSeleccionado) {
    return (
      <DetalleProyecto
        proyecto={proyectoSeleccionado}
        onVolver={() => {
          setVistaActiva('lista');
          setProyectoSeleccionado(null);
        }}
      />
    );
  }

  // Determinar si mostrar la lista de proyectos
  const mostrarListaProyectos = proyectosFiltrados.length > 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Caracterización y Oferta</h2>
        <p className="text-gray-600 mt-1">
          Gestiona y visualiza los proyectos sociales registrados en la plataforma
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        {/* Filtro por estado */}
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-500" />
          <label className="text-gray-700 font-medium">Filtrar por estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as EstadoProyecto | 'todos')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="todos">Todos los estados</option>
            {estados.map(estado => (
              <option key={estado} value={estado}>
                {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
          <span className="text-gray-600">
            {proyectosFiltrados.length} proyecto{proyectosFiltrados.length !== 1 ? 's' : ''}
          </span>
        </div>

        <button
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Crear Nuevo Proyecto
        </button>
      </div>

      {/* Grid de proyectos */}
      {mostrarListaProyectos ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectosFiltrados.map((proyecto) => (
            <div
              key={proyecto.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(proyecto.estado)}`}>
                    {proyecto.estado.charAt(0).toUpperCase() + proyecto.estado.slice(1).replace('_', ' ')}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                    {proyecto.categoria}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{proyecto.nombre}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{proyecto.descripcion}</p>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{proyecto.municipio}, {proyecto.departamento}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{proyecto.poblacionBeneficiada} beneficiarios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>${proyecto.montoRequerido?.toLocaleString() || '0'} COP</span>
                  </div>
                </div>

                {/* Progreso de recaudación */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="text-gray-600">Recaudado</span>
                    <span className="text-gray-900 font-medium">
                      ${proyecto.montoRecaudado?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(((proyecto.montoRecaudado || 0) / (proyecto.montoRequerido || 1)) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleVerDetalle(proyecto)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Ver Detalle
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">No hay proyectos registrados. Haz clic en "Crear Nuevo Proyecto" para comenzar.</p>
        </div>
      )}

      {/* Modal simple para crear proyecto */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto relative">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Proyecto</h2>
            <button
              onClick={() => setMostrarFormulario(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Campo Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
                <input
                  type="text"
                  id="nombre"
                  {...register('nombre', { required: 'El nombre es requerido' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.nombre && <span className="text-red-500 text-xs">{errors.nombre.message}</span>}
              </div>

              {/* Campo Descripción */}
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  id="descripcion"
                  {...register('descripcion', { required: 'La descripción es requerida' })}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
                {errors.descripcion && <span className="text-red-500 text-xs">{errors.descripcion.message}</span>}
              </div>

              {/* Campo Categoría */}
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
                <input
                  type="text"
                  id="categoria"
                  {...register('categoria', { required: 'La categoría es requerida' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.categoria && <span className="text-red-500 text-xs">{errors.categoria.message}</span>}
              </div>

              {/* Campo Región */}
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700">Región</label>
                <input
                  type="text"
                  id="region"
                  {...register('region', { required: 'La región es requerida' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.region && <span className="text-red-500 text-xs">{errors.region.message}</span>}
              </div>

              {/* Campo Departamento */}
              <div>
                <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">Departamento</label>
                <input
                  type="text"
                  id="departamento"
                  {...register('departamento', { required: 'El departamento es requerido' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.departamento && <span className="text-red-500 text-xs">{errors.departamento.message}</span>}
              </div>

              {/* Campo Municipio */}
              <div>
                <label htmlFor="municipio" className="block text-sm font-medium text-gray-700">Municipio</label>
                <input
                  type="text"
                  id="municipio"
                  {...register('municipio', { required: 'El municipio es requerido' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.municipio && <span className="text-red-500 text-xs">{errors.municipio.message}</span>}
              </div>

              {/* Campo Monto Requerido */}
              <div>
                <label htmlFor="montoRequerido" className="block text-sm font-medium text-gray-700">Monto Requerido</label>
                <input
                  type="number"
                  id="montoRequerido"
                  {...register('montoRequerido', { required: 'El monto requerido es obligatorio', valueAsNumber: true })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.montoRequerido && <span className="text-red-500 text-xs">{errors.montoRequerido.message}</span>}
              </div>

              {/* Campo Persona Responsable */}
              <div>
                <label htmlFor="personaId" className="block text-sm font-medium text-gray-700">Persona Responsable</label>
                <select
                  id="personaId"
                  {...register('personaId', { required: 'La persona responsable es requerida' })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Selecciona un responsable</option>
                  {personas.map((persona) => (
                    <option key={persona.id} value={persona.id}>
                      {persona.nombre} ({persona.departamento})
                    </option>
                  ))}
                </select>
                {errors.personaId && <span className="text-red-500 text-xs">{errors.personaId.message}</span>}
              </div>

              {/* Campo Población Beneficiada */}
              <div>
                <label htmlFor="poblacionBeneficiada" className="block text-sm font-medium text-gray-700">Población Beneficiada</label>
                <input
                  type="number"
                  id="poblacionBeneficiada"
                  {...register('poblacionBeneficiada', { required: 'Este campo es requerido', valueAsNumber: true })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.poblacionBeneficiada && <span className="text-red-500 text-xs">{errors.poblacionBeneficiada.message}</span>}
              </div>

              {/* Campo Empleos Generados */}
              <div>
                <label htmlFor="empleosGenerados" className="block text-sm font-medium text-gray-700">Empleos Generados</label>
                <input
                  type="number"
                  id="empleosGenerados"
                  {...register('empleosGenerados', { required: 'Este campo es requerido', valueAsNumber: true })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.empleosGenerados && <span className="text-red-500 text-xs">{errors.empleosGenerados.message}</span>}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="flex-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                >
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
