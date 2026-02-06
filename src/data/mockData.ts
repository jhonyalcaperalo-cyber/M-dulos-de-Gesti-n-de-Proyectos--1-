import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Proyecto } from '../types'
// Dejo estos exports vacios para que no se rompan los imports viejos
export const mockProyectos = [];
export const mockAportes = [];
export const mockHitos = [];
export const mockPersonas = [];

export function useProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargarProyectos() {
      const { data, error } = await supabase
        .from('proyectos')
        .select(`
          *,
          aportes:aportes(*),
          hitos:hitos(*),
          documentos:documentos(*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error cargando:', error)
        return
      }

      // ✨ Esto devuelve EXACTAMENTE la misma estructura que tu mock data
      setProyectos(data as Proyecto[])
      setLoading(false)
    }

    cargarProyectos()

    // Bonus magico: Actualizacion automatica en tiempo real
    // Cuando alguien cambie algo, se actualiza en todos los navegadores sin refrescar
    const channel = supabase
      .channel('cambios')
      .on('postgres_changes', { event: '*', schema: 'public' }, 
        () => cargarProyectos()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return { proyectos, loading }
}