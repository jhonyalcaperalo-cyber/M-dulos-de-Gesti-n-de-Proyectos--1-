import { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Hito, Proyecto, EstadoProyecto, Documento } from '../types';
import { Plus, Download, Upload, CheckCircle, Circle, FileText, Calendar, Pencil, X, Loader2, Lock, Crown } from 'lucide-react';
import { FormularioHito } from './FormularioHito';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { logAudit, logMilestoneAction, logDocumentAction } from '../lib/audit';

export function ModuloGestion() {
  const { proyectos, loading, agregarHito, refrescarProyectos } = useAppContext();
  const { user, session } = useAuth();

  const [mostrarCambioEstado, setMostrarCambioEstado] = useState(false);
  const [proyectoSeleccionadoId, setProyectoSeleccionadoId] = useState<string>('');
  const [mostrarFormularioHito, setMostrarFormularioHito] = useState(false);
  const [hitoEditandoId, setHitoEditandoId] = useState<string | null>(null);
  const [subiendoDocumento, setSubiendoDocumento] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hitoParaSubirDocumento, setHitoParaSubirDocumento] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';
  const proyecto = proyectos.find(p => p.id === proyectoSeleccionadoId);
  const esCreador = user?.id === proyecto?.user_id;
  const puedeEditar = isAdmin || esCreador || session;

  useEffect(() => {
    if (!loading && proyectos.length > 0 && !proyectoSeleccionadoId) {
      setProyectoSeleccionadoId(proyectos[0].id);
    }
  }, [loading, proyectos, proyectoSeleccionadoId]);

  const hitosProyecto = proyecto?.hitos || [];
  const aportesProyecto = proyecto?.aportes || [];

  const hitosCompletados = hitosProyecto.filter(h => h.completado).length;
  const progresoHitos = hitosProyecto.length > 0 ? (hitosCompletados / hitosProyecto.length) * 100 : 0;

  const handleGuardarHito = async (hito: Hito) => {
    try {
      await agregarHito(hito);
      setMostrarFormularioHito(false);
      toast.success('Hito guardado exitosamente.');
      
      // Log de auditoría
      if (user) {
        await logMilestoneAction(
          user,
          'create',
          hito.proyectoId,
          hito.titulo,
          hito.proyectoId,
          { fecha: hito.fecha }
        );
      }
    } catch (error) {
      toast.error('No se pudo guardar el hito.');
    }
  };

  const handleSubirDocumento = async (hitoId: string, file: File) => {
    try {
      setSubiendoDocumento(true);
      
      const fileExtension = file.name.split('.').pop();
      const fileName = `${hitoId}/${Date.now()}.${fileExtension}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('Documentos')
        .upload(`hitos/${fileName}`, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('Documentos')
        .getPublicUrl(`hitos/${fileName}`);
    
      const { error: dbError } = await supabase
        .from('documentos')
        .insert({
          nombre: file.name,
          tipo: file.type,
          url: publicUrl,
          proyecto_id: proyectoSeleccionadoId,
          hito_id: hitoId,
          fechasubida: new Date().toISOString(),
          storage_path: `hitos/${fileName}`
        });
        
      if (dbError) {
        console.error('Error DB:', dbError);
        throw dbError;
      }
      
      // Marcar el hito como completado
      await supabase
        .from('hitos')
        .update({ completado: true })
        .eq('id', hitoId);
      
      // Log de auditoría - documento subido y hito completado
      if (user) {
        const hito = hitosProyecto.find(h => h.id === hitoId);
        await logDocumentAction(
          user,
          'upload_document',
          hitoId,
          file.name,
          'hito',
          hitoId,
          { proyecto_id: proyectoSeleccionadoId, hito_completado: true }
        );
      }
      
      toast.success('Documento subida y hito completado.');
      
      await refrescarProyectos();
      
    } catch (error) {
      console.error('Error al subir documento:', error);
      toast.error('No se pudo subir el documento: ' + (error as Error).message);
    } finally {
      setSubiendoDocumento(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const abrirSelectorArchivos = (hitoId: string) => {
    if (!session) {
      toast.error('Debes iniciar sesión para subir documentos');
      return;
    }
    setHitoParaSubirDocumento(hitoId);
    fileInputRef.current?.click();
  };

  const onSeleccionarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && hitoParaSubirDocumento) {
      handleSubirDocumento(hitoParaSubirDocumento, file);
    }
  };

  const handleEliminarDocumento = async (documentoId: string, documentoUrl: string) => {
    if (!isAdmin) {
      toast.error('Solo los administradores pueden eliminar documentos');
      return;
    }
    try {
      const { error: dbError } = await supabase
        .from('documentos')
        .delete()
        .eq('id', documentoId);
        
      if (dbError) {
        throw dbError;
      }
      
      const urlParts = documentoUrl.split('/');
      const filePath = urlParts.slice(-2).join('/');
      
      await supabase.storage
        .from('Documentos')
        .remove([filePath]);
        
      toast.success('Documento eliminado.');
      
      await refrescarProyectos();
      
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      toast.error('No se pudo eliminar el documento.');
    }
  };

  const toggleHitoCompletado = async (hitoId: string, completadoActual: boolean) => {
    if (!session) {
      toast.error('Debes iniciar sesión para actualizar hitos');
      return;
    }
    const { error } = await supabase
      .from('hitos')
      .update({ completado: !completadoActual })
      .eq('id', hitoId);

    if (error) {
      console.error('Error al cambiar estado del hito:', error);
      toast.error('No se pudo actualizar el estado del hito.');
    } else {
      toast.success('Estado del hito actualizado.');
      await refrescarProyectos();
    }
  };

  const cambiarEstadoProyecto = async (proyectoId: string, nuevoEstado: EstadoProyecto) => {
    if (!isAdmin) {
      toast.error('Solo los administradores pueden cambiar el estado');
      return;
    }
    const { error } = await supabase
      .from('proyectos')
      .update({ estado: nuevoEstado })
      .eq('id', proyectoId);

    if (error) {
      console.error('Error al cambiar estado del proyecto:', error);
      toast.error('No se pudo actualizar el estado del proyecto.');
    } else {
      toast.success('Estado del proyecto actualizado.');
      await refrescarProyectos();
    }
  };

  const descargarReporte = () => {
    alert('Generando reporte PDF... (funcionalidad en desarrollo)');
  };

  const toggleFormularioHito = () => {
    if (!session) {
      toast.error('Debes iniciar sesión para crear hitos');
      return;
    }
    setMostrarFormularioHito(!mostrarFormularioHito);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!proyecto) {
    return (
      <div className="text-gray-600 p-8">
        No hay proyectos disponibles o seleccionado.
      </div>
    );
  }

  return (
    <div className="p-8"> 
      <input
        type="file"
        ref={fileInputRef}
        onChange={onSeleccionarArchivo}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
      />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900">Gestion y Trazabilidad</h2>
          <p className="text-gray-600">Seguimiento transparente de proyectos y uso de fondos</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Indicador de rol */}
          {session && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
              {isAdmin ? (
                <>
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-700">Administrador</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Usuario</span>
                </>
              )}
            </div>
          )}

          {/* Botón cambiar estado - solo admin */}
          <div className="relative">
            <button
              onClick={() => {
                if (!session) {
                  toast.error('Debes iniciar sesión');
                  return;
                }
                if (!isAdmin) {
                  toast.error('Solo administradores pueden cambiar estados');
                  return;
                }
                setMostrarCambioEstado(v => !v);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                isAdmin 
                  ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50' 
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!isAdmin}
            >
              <Pencil className="w-4 h-4" />
              Cambiar estado
              {!isAdmin && <Lock className="w-3 h-3" />}
            </button>

            {mostrarCambioEstado && isAdmin && (
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

          <button
            onClick={descargarReporte}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Download className="w-5 h-5" />
            Descargar Reporte
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <label className="block text-gray-700 mb-2">Seleccionar Proyecto</label>
        <select
          value={proyectoSeleccionadoId}
          onChange={(e) => setProyectoSeleccionadoId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {proyectos.map(p => (
            <option key={p.id} value={p.id}>
              {p.nombre} - {p.municipio}, {p.departamento}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-gray-600 mb-1">Monto Aportado</div>
          <div className="text-gray-900">${(proyecto.montoRecaudado || 0).toLocaleString()}</div>
          <div className="text-gray-500">de ${(proyecto.montoRequerido || 0).toLocaleString()}</div>
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
          <div className="text-gray-900 capitalize">{proyecto.estado.replace('_', ' ')}</div>
          <div className="text-gray-500">ultima actualizacion hoy</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">Linea de Tiempo de Hitos</h3>
              <button
                onClick={toggleFormularioHito}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  session 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
                disabled={!puedeEditar}
              >
                <Plus className="w-4 h-4" />
                {puedeEditar ? 'Nuevo Hito' : 'Solo el creador'}
              </button>
            </div>

            {/* Banner de requiere permisos */}
            {!puedeEditar && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
                <Lock className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-700">
                  Solo el creador del proyecto o administradores pueden gestionar hitos
                </p>
              </div>
            )}

            {mostrarFormularioHito && puedeEditar && (
              <div className="mb-6 pb-6 border-b bg-gray-50 rounded-lg p-4">
                <FormularioHito
                  proyectoId={proyecto.id}
                  onGuardar={handleGuardarHito}
                  onCancelar={() => setMostrarFormularioHito(false)}
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
                        onClick={() => toggleHitoCompletado(hito.id, hito.completado)}
                        className={`flex-shrink-0 relative z-10 ${
                          puedeEditar ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                        }`}
                        disabled={!puedeEditar}
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

                        {hito.documentos && hito.documentos.length > 0 && (
                          <DocumentosHito 
                            documentos={hito.documentos} 
                            onEliminar={handleEliminarDocumento}
                            isAdmin={isAdmin}
                          />
                        )}

                        {!hito.completado && (
                          <button 
                            onClick={() => abrirSelectorArchivos(hito.id)}
                            disabled={subiendoDocumento || !session}
                            className="mt-3 flex items-center gap-2 text-purple-600 hover:text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {subiendoDocumento ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                            {session ? 'Subir documento' : 'Inicia sesión para subir'}
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
                  {proyecto.montoRequerido > 0 ? ((proyecto.montoRecaudado / proyecto.montoRequerido) * 100).toFixed(0) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: `${proyecto.montoRequerido > 0 ? (proyecto.montoRecaudado / proyecto.montoRequerido) * 100 : 0}%` }}
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
                      <span className={`px-2 py-1 rounded text-white text-xs ${
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

function DocumentosHito({ documentos, onEliminar, isAdmin }: { documentos: Documento[], onEliminar: (id: string, url: string) => void, isAdmin: boolean }) {
  if (documentos.length === 0) return null;
  
  return (
    <div className="space-y-2 mt-3">
      <div className="text-gray-700 text-sm font-medium">Documentos adjuntos:</div>
      {documentos.map((doc) => (
        <div key={doc.id} className="flex items-center gap-2 text-sm bg-gray-100 p-2 rounded">
          <FileText className="w-4 h-4 text-gray-500" />
          <a 
            href={doc.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 underline flex-1"
          >
            {doc.nombre}
          </a>
          <span className="text-gray-400 text-xs">{new Date(doc.fechaSubida || Date.now()).toLocaleDateString()}</span>
          {isAdmin && (
            <button 
              onClick={() => onEliminar(doc.id, doc.url)}
              className="text-red-500 hover:text-red-700"
              title="Eliminar documento"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function User(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
