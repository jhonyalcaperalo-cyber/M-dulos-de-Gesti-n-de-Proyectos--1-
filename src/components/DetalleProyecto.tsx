  import { Proyecto } from '../types';
import { MapPin, User, DollarSign, Users, Briefcase, Calendar, AlertCircle } from 'lucide-react';

interface DetalleProyectoProps {
  proyecto: Proyecto;
}

export function DetalleProyecto({ proyecto }: DetalleProyectoProps) {
  const porcentajeRecaudado = (proyecto.montoRecaudado / proyecto.montoRequerido) * 100;

  const getEstadoColor = (estado: string) => {
    const colores = {
      registrado: 'bg-gray-100 text-gray-800',
      validado: 'bg-blue-100 text-blue-800',
      en_espera: 'bg-yellow-100 text-yellow-800',
      activo: 'bg-green-100 text-green-800',
      finalizado: 'bg-purple-100 text-purple-800'
    };
    return colores[estado as keyof typeof colores];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-gray-900 mb-2">{proyecto.nombre}</h2>
            <p className="text-gray-600">{proyecto.descripcion}</p>
          </div>
          <span className={`px-4 py-2 rounded-full ${getEstadoColor(proyecto.estado)}`}>
            {proyecto.estado}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-gray-600">Fecha de registro</div>
              <div className="text-gray-900">{new Date(proyecto.fechaCreacion).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-gray-600">Ubicación</div>
              <div className="text-gray-900">{proyecto.municipio}, {proyecto.departamento}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-gray-600">Categoría</div>
              <div className="text-gray-900">{proyecto.categoria}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Beneficiario */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Beneficiario Responsable</h3>
        {proyecto.persona && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-gray-600">Nombre</div>
                <div className="text-gray-900">{proyecto.persona.nombre}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-gray-600">Documento</div>
              <div className="text-gray-900">{proyecto.persona.documento}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-gray-600">Teléfono</div>
              <div className="text-gray-900">{proyecto.persona.telefono}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-gray-600">Email</div>
              <div className="text-gray-900">{proyecto.persona.email}</div>
            </div>
          </div>
        )}
      </div>

      {/* Financiamiento */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Financiamiento</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Monto requerido</span>
            <span className="text-gray-900">${proyecto.montoRequerido.toLocaleString()} COP</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Monto recaudado</span>
            <span className="text-green-600">${proyecto.montoRecaudado.toLocaleString()} COP</span>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Progreso</span>
              <span className="text-gray-900">{porcentajeRecaudado.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(porcentajeRecaudado, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Impacto */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Impacto Esperado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-gray-600">Población beneficiada</div>
              <div className="text-gray-900">{proyecto.poblacionBeneficiada} personas</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-gray-600">Empleos a generar</div>
              <div className="text-gray-900">{proyecto.empleosGenerados} empleos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Necesidades */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Necesidades del Proyecto</h3>
        <div className="space-y-3">
          {proyecto.necesidades.map((necesidad) => (
            <div key={necesidad.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="text-gray-900">{necesidad.descripcion}</div>
                <div className="text-gray-600">{necesidad.categoria}</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-white ${
                necesidad.prioridad === 'alta' ? 'bg-red-500' :
                necesidad.prioridad === 'media' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}>
                Prioridad {necesidad.prioridad}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
