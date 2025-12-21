import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Hito } from '../types';
import { Plus, Download, Upload, CheckCircle, Circle, FileText, Calendar } from 'lucide-react';
import { FormularioHito } from './FormularioHito';
import { Pencil } from 'lucide-react';
import { EstadoProyecto } from '../types';

export function ModuloGestion() {
 const { proyectos, hitos, aportes, agregarHito, toggleHito, cambiarEstadoProyecto } = useApp();
 const [mostrarCambioEstado, setMostrarCambioEstado] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<string>(
    proyectos[0]?.id ?? ''
  );
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    if (!proyectoSeleccionado && proyectos.length > 0) {
      setProyectoSeleccionado(proyectos[0].id);
    }
  }, [proyectos, proyectoSeleccionado]);

  const proyecto = proyectos.find(p => p.id === proyectoSeleccionado);
  const hitosProyecto = hitos.filter(h => h.proyectoId === proyectoSeleccionado);
  const aportesProyecto = aportes.filter(a => a.proyectoId === proyectoSeleccionado);

  const hitosCompletados = hitosProyecto.filter(h => h.completado).length;
  const progresoHitos = hitosProyecto.length > 0 ? (hitosCompletados / hitosProyecto.length) * 100 : 0;

  const handleGuardarHito = (hito: Hito) => {
    agregarHito(hito);
    setMostrarFormulario(false);
  };

  const toggleHitoCompletado = (hitoId: string) => {
    toggleHito(hitoId);
  };

  const descargarReporte = () => {
    alert('Generando reporte PDF... (funcionalidad en desarrollo)');
  };

  if (!proyecto) {
    return (
      <div className="text-gray-600">
        No hay proyecto seleccionado o no hay proyectos disponibles.
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
  <div>
    <h2 className="text-gray-900">Gestión y Trazabilidad</h2>
    <p className="text-gray-600">Seguimiento transparente de proyectos y uso de fondos</p>
  </div>

  <div className="flex items-center gap-3">
    {/* Botón Cambiar Estado */}
    <div className="relative">
      <button
        onClick={() => setMostrarCambioEstado(v => !v)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
      >
        <Pencil className="w-4 h-4" />
        Cambiar estado
      </button>

      {mostrarCambioEstado && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20 w-56">
          <label className="block text-xs text-gray-600 mb-2">Nuevo estado</label>
          <select
            value={proyecto.estado}
            onChange={(e) => {
              cambiarEstadoProyecto(proyecto.id, e.target.value as EstadoProyecto);
              setMostrarCambioEstado(false);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="registrado">Registrado</option>
            <option value="validado">Validado</option>
            <option value="en_espera">En espera</option>
            <option value="activo">Activo</option>
            <option value="finalizado">Finalizado</option>
          </select>

          <button
            onClick={() => setMostrarCambioEstado(false)}
            className="mt-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>

    {/* Botón Descargar Reporte */}
    <button
      onClick={descargarReporte}
      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
    >
      <Download className="w-5 h-5" />
      Descargar Reporte
    </button>
  </div>
</div>

      {/* Selector de proyecto */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <label className="block text-gray-700 mb-2">Seleccionar Proyecto</label>
        <select
          value={proyectoSeleccionado}
          onChange={(e) => setProyectoSeleccionado(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {proyectos.map(p => (
            <option key={p.id} value={p.id}>
              {p.nombre} - {p.municipio}, {p.departamento}
            </option>
          ))}
        </select>
      </div>

      {/* Resumen del proyecto */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-gray-600 mb-1">Monto Aportado</div>
          <div className="text-gray-900">${proyecto.montoRecaudado.toLocaleString()}</div>
          <div className="text-gray-500">de ${proyecto.montoRequerido.toLocaleString()}</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-gray-600 mb-1">Aportes Recibidos</div>
          <div className="text-gray-900">{aportesProyecto.length}</div>
          <div className="text-gray-500">donantes activos</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-gray-600 mb-1">Hitos Completados</div>
          <div className="text-gray-900">{hitosCompletados} de {hitosProyecto.length}</div>
          <div className="text-gray-500">{progresoHitos.toFixed(0)}% progreso</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-gray-600 mb-1">Estado del Proyecto</div>
          <div className="text-gray-900">{proyecto.estado}</div>
          <div className="text-gray-500">última actualización hoy</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Línea de tiempo */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">Línea de Tiempo de Hitos</h3>
              <button
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
                Nuevo Hito
              </button>
            </div>

            {mostrarFormulario && (
              <div className="mb-6 pb-6 border-b">
                <FormularioHito
                  proyectoId={proyectoSeleccionado}
                  onGuardar={handleGuardarHito}
                  onCancelar={() => setMostrarFormulario(false)}
                />
              </div>
            )}

            <div className="space-y-4">
              {hitosProyecto.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay hitos registrados para este proyecto
                </div>
              ) : (
                hitosProyecto.map((hito, index) => (
                  <div key={hito.id} className="relative">
                    {index < hitosProyecto.length - 1 && (
                      <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
                    )}

                    <div className="flex gap-4">
                      <button
                        onClick={() => toggleHitoCompletado(hito.id)}
                        className="flex-shrink-0 relative z-10"
                      >
                        {hito.completado ? (
                          <CheckCircle className="w-10 h-10 text-green-500 bg-white" />
                        ) : (
                          <Circle className="w-10 h-10 text-gray-300 bg-white" />
                        )}
                      </button>

                      <div className={`flex-1 p-4 rounded-lg border ${
                        hito.completado ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className={`${hito.completado ? 'text-green-900' : 'text-gray-900'}`}>
                            {hito.titulo}
                          </h4>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(hito.fecha).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <p className={`mb-3 ${hito.completado ? 'text-green-700' : 'text-gray-600'}`}>
                          {hito.descripcion}
                        </p>

                        {hito.documentos.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-gray-700">Documentos adjuntos:</div>
                            {hito.documentos.map((doc) => (
                              <div key={doc.id} className="flex items-center gap-2 text-gray-600">
                                <FileText className="w-4 h-4" />
                                <span>{doc.nombre}</span>
                                <span className="text-gray-400">• {new Date(doc.fechaSubida).toLocaleDateString()}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {!hito.completado && (
                          <button className="mt-3 flex items-center gap-2 text-purple-600 hover:text-purple-700">
                            <Upload className="w-4 h-4" />
                            Subir documento
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Progreso General</h3>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Avance de hitos</span>
                <span className="text-gray-900">{progresoHitos.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-purple-600 h-3 rounded-full" style={{ width: `${progresoHitos}%` }} />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Financiamiento</span>
                <span className="text-gray-900">
                  {((proyecto.montoRecaudado / proyecto.montoRequerido) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: `${(proyecto.montoRecaudado / proyecto.montoRequerido) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Aportes Recibidos</h3>

            {aportesProyecto.length === 0 ? (
              <p className="text-gray-500">No hay aportes registrados</p>
            ) : (
              <div className="space-y-3">
                {aportesProyecto.map((aporte) => (
                  <div key={aporte.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900">{aporte.entidad}</span>
                      <span className={`px-2 py-1 rounded text-white ${
                        aporte.estado === 'aprobado' ? 'bg-green-500' :
                        aporte.estado === 'pendiente' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        {aporte.estado}
                      </span>
                    </div>
                    <div className="text-gray-600">{aporte.donante}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-500">{new Date(aporte.fecha).toLocaleDateString()}</span>
                      <span className="text-green-600">${aporte.monto.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}