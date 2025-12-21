import { useState } from 'react';
import { mockProyectos, mockAportes } from '../data/mockData';
import { Proyecto, Aporte } from '../types';
import { Filter, TrendingUp, Users, Briefcase, DollarSign, Handshake } from 'lucide-react';
import { FormularioAporte } from './FormularioAporte';

export function ModuloApalancamiento() {
  const [proyectos] = useState<Proyecto[]>(mockProyectos.filter(p => p.estado === 'activo' || p.estado === 'validado'));
  const [aportes, setAportes] = useState<Aporte[]>(mockAportes);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [filtroRegion, setFiltroRegion] = useState<string>('todas');
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const categorias = ['todas', ...Array.from(new Set(proyectos.map(p => p.categoria)))];
  const regiones = ['todas', ...Array.from(new Set(proyectos.map(p => p.departamento)))];

  const proyectosFiltrados = proyectos.filter(proyecto => {
    const categoriaMatch = filtroCategoria === 'todas' || proyecto.categoria === filtroCategoria;
    const regionMatch = filtroRegion === 'todas' || proyecto.departamento === filtroRegion;
    return categoriaMatch && regionMatch;
  });

  const handleApalancar = (proyecto: Proyecto) => {
    setProyectoSeleccionado(proyecto);
    setMostrarFormulario(true);
  };

  const handleGuardarAporte = (aporte: Aporte) => {
    setAportes([...aportes, aporte]);
    setMostrarFormulario(false);
    setProyectoSeleccionado(null);
  };

  const getPorcentajeRecaudado = (proyecto: Proyecto) => {
    return (proyecto.montoRecaudado / proyecto.montoRequerido) * 100;
  };

  if (mostrarFormulario && proyectoSeleccionado) {
    return (
      <div>
        <button
          onClick={() => {
            setMostrarFormulario(false);
            setProyectoSeleccionado(null);
          }}
          className="mb-4 text-blue-600 hover:text-blue-700"
        >
          ← Volver a proyectos
        </button>
        <FormularioAporte
          proyecto={proyectoSeleccionado}
          onGuardar={handleGuardarAporte}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-gray-900">Apalancamiento - Matchmaking</h2>
        <p className="text-gray-600">Conecta tu inversión con proyectos que generan impacto social</p>
      </div>

      {/* Métricas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Proyectos Disponibles</p>
              <p className="text-gray-900">{proyectos.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Población Total</p>
              <p className="text-gray-900">{proyectos.reduce((sum, p) => sum + p.poblacionBeneficiada, 0)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Empleos Potenciales</p>
              <p className="text-gray-900">{proyectos.reduce((sum, p) => sum + p.empleosGenerados, 0)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Inversión Requerida</p>
              <p className="text-gray-900">${(proyectos.reduce((sum, p) => sum + (p.montoRequerido - p.montoRecaudado), 0) / 1000000).toFixed(1)}M</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          
          <div className="flex items-center gap-2">
            <label className="text-gray-700">Categoría:</label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categorias.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'todas' ? 'Todas las categorías' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-gray-700">Región:</label>
            <select
              value={filtroRegion}
              onChange={(e) => setFiltroRegion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {regiones.map(reg => (
                <option key={reg} value={reg}>
                  {reg === 'todas' ? 'Todas las regiones' : reg}
                </option>
              ))}
            </select>
          </div>

          <span className="text-gray-600">
            {proyectosFiltrados.length} proyecto{proyectosFiltrados.length !== 1 ? 's' : ''} encontrado{proyectosFiltrados.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Lista de proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectosFiltrados.map((proyecto) => {
          const porcentaje = getPorcentajeRecaudado(proyecto);
          const montoFaltante = proyecto.montoRequerido - proyecto.montoRecaudado;

          return (
            <div key={proyecto.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Header de la tarjeta */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {proyecto.categoria}
                  </span>
                  <span className={`px-3 py-1 rounded-full ${
                    proyecto.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {proyecto.estado}
                  </span>
                </div>

                <h3 className="text-gray-900 mb-2">{proyecto.nombre}</h3>
                <p className="text-gray-600 mb-4">{proyecto.descripcion.slice(0, 120)}...</p>

                {/* Ubicación */}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{proyecto.municipio}, {proyecto.departamento}</span>
                </div>

                {/* Impacto */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-gray-600">Beneficiados</div>
                      <div className="text-gray-900">{proyecto.poblacionBeneficiada}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-gray-600">Empleos</div>
                      <div className="text-gray-900">{proyecto.empleosGenerados}</div>
                    </div>
                  </div>
                </div>

                {/* Progreso de financiamiento */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Progreso</span>
                    <span className="text-gray-900">{porcentaje.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(porcentaje, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Recaudado: ${(proyecto.montoRecaudado / 1000000).toFixed(1)}M</span>
                    <span className="text-gray-900">Meta: ${(proyecto.montoRequerido / 1000000).toFixed(1)}M</span>
                  </div>
                </div>

                {/* Monto faltante */}
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <div className="text-gray-600">Inversión requerida</div>
                  <div className="text-blue-600">${montoFaltante.toLocaleString()} COP</div>
                </div>

                {/* Botón de acción */}
                <button
                  onClick={() => handleApalancar(proyecto)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Handshake className="w-5 h-5" />
                  Apalancar este proyecto
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {proyectosFiltrados.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">No se encontraron proyectos con los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
}
