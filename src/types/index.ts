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
  personaId: string;
  persona?: Persona;
  necesidades: Necesidad[];
  poblacionBeneficiada: number;
  empleosGenerados: number;
}

export interface Aporte {
  id: string;
  proyectoId: string;
  donante: string;
  entidad: string;
  monto: number;
  fecha: string;
  tipo: 'monetario' | 'especie' | 'servicio';
  estado: 'pendiente' | 'aprobado' | 'rechazado';
}

export interface Hito {
  id: string;
  proyectoId: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  completado: boolean;
  documentos: Documento[];
}

export interface Documento {
  id: string;
  nombre: string;
  tipo: string;
  url: string;
  fechaSubida: string;
}
