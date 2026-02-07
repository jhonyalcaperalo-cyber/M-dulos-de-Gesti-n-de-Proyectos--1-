export type EstadoProyecto = 'registrado' | 'validado' | 'en_espera' | 'activo' | 'finalizado';

export interface Persona {
  id: string;
  nombre: string;
  documento: string;
  telefono: string;
  email: string;
  direccion: string;
  municipio: string;
  departamento: string;
  created_at?: string;
}

export interface Documento {
  id: string;
  nombre: string;
  url: string;
  fechaSubida: string;
}

export interface Hito {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  completado: boolean;
  documentos?: Documento[];
  proyectoId: string;
}

export interface Aporte {
  id: string;
  entidad: string;
  donante: string;
  monto: number;
  fecha: string;
  estado: 'aprobado' | 'pendiente' | 'rechazado';
  proyectoId: string;
  tipo?: 'monetario' | 'especie' | 'servicio';
  referenciaPago?: string;
  transaccionesWompiId?: string;
}

export interface Necesidad {
  id: string;
  descripcion: string;
  categoria: string;
  prioridad: 'alta' | 'media' | 'baja';
}

export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  region: string;
  departamento: string;
  municipio: string;
  montoRequerido: number;
  montoRecaudado: number;
  estado: EstadoProyecto;
  fechaCreacion: string;
  personaId: string | null;
  persona?: Persona;
  necesidades: Necesidad[];
  poblacionBeneficiada: number;
  empleosGenerados: number;
  // Campos para datos relacionados (vienen del JOIN en Supabase)
  hitos?: Hito[];
  aportes?: Aporte[];
}

export interface ProyectoFormData {
  nombre: string;
  descripcion: string;
  categoria: string;
  region: string;
  departamento: string;
  municipio: string;
  montoRequerido: number;
  poblacionBeneficiada: number;
  empleosGenerados: number;
  personaId: string;
}
