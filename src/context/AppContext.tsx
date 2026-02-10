import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Proyecto, Persona, Aporte, Hito } from '../types';

interface AppContextType {
  proyectos: Proyecto[];
  personas: Persona[];
  loading: boolean;
  agregarAporte: (aporte: Aporte) => Promise<void>;
  agregarHito: (hito: Hito) => Promise<void>;
  refrescarProyectos: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ReactNode }) {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);

  const agregarAporte = async (aporte: Aporte) => {
    // Insertar el aporte en Supabase
    const { error: aporteError } = await supabase
      .from('aportes')
      .insert(aporte);

    if (aporteError) {
      console.error('Error al agregar aporte:', aporteError);
      throw new Error('No se pudo registrar el aporte');
    }

    // Actualizar el montoRecaudado del proyecto
    const { error: updateError } = await supabase
      .from('proyectos')
      .update({
        montoRecaudado: supabase.rpc('incrementar_monto', { 
          proyecto_id: aporte.proyectoId, 
          monto: aporte.monto 
        })
      })
      .eq('id', aporte.proyectoId);

    if (updateError) {
      console.error('Error al actualizar monto del proyecto:', updateError);
      throw new Error('No se pudo actualizar el monto del proyecto');
    }

    // Recargar datos para reflejar los cambios
    await cargarDatos();
  };

  const agregarHito = async (hito: Hito) => {
    // Transformar a snake_case para Supabase
    const hitoParaSupabase = {
      id: hito.id,
      titulo: hito.titulo,
      descripcion: hito.descripcion,
      fecha: hito.fecha,
      completado: hito.completado,
      proyectoid: hito.proyectoId
    };

    // Insertar el hito en Supabase
    const { error: hitoError } = await supabase
      .from('hitos')
      .insert(hitoParaSupabase);

    if (hitoError) {
      console.error('Error al agregar hito:', hitoError);
      throw new Error('No se pudo registrar el hito');
    }

    // Recargar datos para reflejar los cambios
    await cargarDatos();
  };

  const refrescarProyectos = async () => {
    await cargarDatos();
  };

  async function cargarDatos() {
    setLoading(true);

    // Cargar Proyectos con JOIN a Persona
    const { data: proyectosData, error: proyectosError } = await supabase
      .from('proyectos')
      .select(`
        *,
        persona:personas(id, nombre, documento, telefono, email, direccion, municipio, departamento, created_at),
        hitos(id, titulo, descripcion, fecha, completado, proyectoid, documentos(id, nombre, tipo, url, fechasubida, hitoid)),
        aportes(id, entidad, donante, monto, fecha, estado, proyectoid)
      `)
      .order('created_at', { ascending: false });

    if (proyectosError) {
      console.error('Error cargando proyectos:', proyectosError);
    } else {
      // Transformar datos de snake_case a camelCase
      const proyectosTransformados = (proyectosData || []).map(p => ({
        ...p,
        montoRequerido: p.montorequerido || 0,
        montoRecaudado: p.monto_recaudado || 0,
        poblacionBeneficiada: p.poblacionbeneficiada || 0,
        empleosGenerados: p.empleosgenerados || 0,
        fechaCreacion: p.fechacreacion || p.created_at,
        personaId: p.persona_id
      }));
      setProyectos(proyectosTransformados as Proyecto[]);
    }

    // Cargar Personas
    const { data: personasData, error: personasError } = await supabase
      .from('personas')
      .select('id, nombre, documento, telefono, email, direccion, municipio, departamento, created_at')
      .order('nombre', { ascending: true });

    if (personasError) {
      console.error('Error cargando personas:', personasError);
    } else {
      setPersonas(personasData as Persona[] || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    cargarDatos();

    // Configurar el canal de Realtime con manejo de errores
    const channel = supabase
      .channel('cambios-globales')
      .on('postgres_changes', { event: '*', schema: 'public', table: '*' },
        (payload) => {
          console.log('Cambio recibido en Supabase:', payload);
          cargarDatos();
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log('Suscripción a Supabase Realtime establecida');
        } else if (status === 'CLOSED') {
          console.log('Suscripción a Supabase Realtime cerrada');
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('Error en suscripción a Supabase Realtime:', status);
        }
      });

    return () => {
      // Verificar que el canal exista antes de intentar removerlo
      if (channel) {
        supabase.removeChannel(channel).catch((err) => {
          console.warn('Error al remover canal de Supabase:', err);
        });
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ proyectos, personas, loading, agregarAporte, agregarHito, refrescarProyectos }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
