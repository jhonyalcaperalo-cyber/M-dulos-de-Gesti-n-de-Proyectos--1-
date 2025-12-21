import { Proyecto, Persona, Aporte, Hito } from '../types';

export const mockPersonas: Persona[] = [
  {
    id: '1',
    nombre: 'María González',
    documento: '1234567890',
    telefono: '300-123-4567',
    email: 'maria.gonzalez@email.com',
    direccion: 'Calle 123 #45-67',
    municipio: 'Medellín',
    departamento: 'Antioquia'
  },
  {
    id: '2',
    nombre: 'Carlos Rodríguez',
    documento: '0987654321',
    telefono: '310-987-6543',
    email: 'carlos.rodriguez@email.com',
    direccion: 'Carrera 50 #30-20',
    municipio: 'Bogotá',
    departamento: 'Cundinamarca'
  },
  {
    id: '3',
    nombre: 'Ana Martínez',
    documento: '1122334455',
    telefono: '320-456-7890',
    email: 'ana.martinez@email.com',
    direccion: 'Avenida 68 #15-30',
    municipio: 'Cali',
    departamento: 'Valle del Cauca'
  }
];

export const mockProyectos: Proyecto[] = [
  {
    id: '1',
    nombre: 'Huerta Comunitaria El Progreso',
    descripcion: 'Proyecto para crear una huerta comunitaria que beneficie a 50 familias del sector, promoviendo la seguridad alimentaria y el emprendimiento agrícola.',
    categoria: 'Agricultura',
    region: 'Andina',
    departamento: 'Antioquia',
    municipio: 'Medellín',
    montoRequerido: 15000000,
    montoRecaudado: 8500000,
    estado: 'activo',
    fechaCreacion: '2024-11-15',
    personaId: '1',
    persona: mockPersonas[0],
    necesidades: [
      { id: 'n1', descripcion: 'Herramientas agrícolas', categoria: 'Equipamiento', prioridad: 'alta' },
      { id: 'n2', descripcion: 'Semillas y abono', categoria: 'Insumos', prioridad: 'alta' },
      { id: 'n3', descripcion: 'Capacitación técnica', categoria: 'Formación', prioridad: 'media' }
    ],
    poblacionBeneficiada: 200,
    empleosGenerados: 8
  },
  {
    id: '2',
    nombre: 'Centro de Capacitación Digital',
    descripcion: 'Espacio equipado con computadores para capacitar a jóvenes y adultos en habilidades digitales, programación y herramientas ofimáticas.',
    categoria: 'Educación',
    region: 'Andina',
    departamento: 'Cundinamarca',
    municipio: 'Bogotá',
    montoRequerido: 25000000,
    montoRecaudado: 12000000,
    estado: 'validado',
    fechaCreacion: '2024-12-01',
    personaId: '2',
    persona: mockPersonas[1],
    necesidades: [
      { id: 'n4', descripcion: 'Equipos de cómputo', categoria: 'Tecnología', prioridad: 'alta' },
      { id: 'n5', descripcion: 'Software educativo', categoria: 'Tecnología', prioridad: 'media' },
      { id: 'n6', descripcion: 'Instructores certificados', categoria: 'Recurso Humano', prioridad: 'alta' }
    ],
    poblacionBeneficiada: 150,
    empleosGenerados: 5
  },
  {
    id: '3',
    nombre: 'Taller de Confección y Moda',
    descripcion: 'Proyecto productivo enfocado en capacitar mujeres cabeza de familia en confección textil y diseño de moda, con maquinaria industrial.',
    categoria: 'Emprendimiento',
    region: 'Pacífica',
    departamento: 'Valle del Cauca',
    municipio: 'Cali',
    montoRequerido: 18000000,
    montoRecaudado: 5000000,
    estado: 'en_espera',
    fechaCreacion: '2024-11-20',
    personaId: '3',
    persona: mockPersonas[2],
    necesidades: [
      { id: 'n7', descripcion: 'Máquinas de coser industriales', categoria: 'Equipamiento', prioridad: 'alta' },
      { id: 'n8', descripcion: 'Materiales textiles', categoria: 'Insumos', prioridad: 'media' },
      { id: 'n9', descripcion: 'Espacio físico adecuado', categoria: 'Infraestructura', prioridad: 'alta' }
    ],
    poblacionBeneficiada: 80,
    empleosGenerados: 12
  },
  {
    id: '4',
    nombre: 'Biblioteca Móvil Rural',
    descripcion: 'Iniciativa para llevar libros y material educativo a veredas y zonas rurales alejadas, promoviendo la lectura y educación.',
    categoria: 'Educación',
    region: 'Caribe',
    departamento: 'Bolívar',
    municipio: 'Cartagena',
    montoRequerido: 12000000,
    montoRecaudado: 0,
    estado: 'registrado',
    fechaCreacion: '2024-12-05',
    personaId: '1',
    persona: mockPersonas[0],
    necesidades: [
      { id: 'n10', descripcion: 'Vehículo adaptado', categoria: 'Transporte', prioridad: 'alta' },
      { id: 'n11', descripcion: 'Libros y material didáctico', categoria: 'Insumos', prioridad: 'alta' }
    ],
    poblacionBeneficiada: 300,
    empleosGenerados: 3
  }
];

export const mockAportes: Aporte[] = [
  {
    id: '1',
    proyectoId: '1',
    donante: 'Juan Pérez',
    entidad: 'Fundación Empresarios por Colombia',
    monto: 5000000,
    fecha: '2024-11-20',
    tipo: 'monetario',
    estado: 'aprobado'
  },
  {
    id: '2',
    proyectoId: '1',
    donante: 'Corporación XYZ',
    entidad: 'Corporación XYZ',
    monto: 3500000,
    fecha: '2024-11-25',
    tipo: 'monetario',
    estado: 'aprobado'
  },
  {
    id: '3',
    proyectoId: '2',
    donante: 'Tech para Todos',
    entidad: 'Tech para Todos',
    monto: 12000000,
    fecha: '2024-12-03',
    tipo: 'especie',
    estado: 'aprobado'
  }
];

export const mockHitos: Hito[] = [
  {
    id: '1',
    proyectoId: '1',
    titulo: 'Adquisición de terreno',
    descripcion: 'Se logró el acuerdo con la junta de acción comunal para el uso del terreno',
    fecha: '2024-11-18',
    completado: true,
    documentos: [
      { id: 'd1', nombre: 'Acta de acuerdo.pdf', tipo: 'PDF', url: '#', fechaSubida: '2024-11-18' }
    ]
  },
  {
    id: '2',
    proyectoId: '1',
    titulo: 'Compra de herramientas',
    descripcion: 'Adquisición del primer lote de herramientas agrícolas básicas',
    fecha: '2024-11-28',
    completado: true,
    documentos: [
      { id: 'd2', nombre: 'Factura herramientas.pdf', tipo: 'PDF', url: '#', fechaSubida: '2024-11-28' }
    ]
  },
  {
    id: '3',
    proyectoId: '1',
    titulo: 'Capacitación inicial',
    descripcion: 'Primera jornada de capacitación con experto en agricultura urbana',
    fecha: '2024-12-05',
    completado: false,
    documentos: []
  },
  {
    id: '4',
    proyectoId: '2',
    titulo: 'Instalación de equipos',
    descripcion: 'Configuración e instalación de los computadores donados',
    fecha: '2024-12-10',
    completado: false,
    documentos: []
  }
];
