import { createContext, useContext, useMemo, useState } from 'react';
import type { Proyecto, Aporte, Hito, Persona } from '../types';
import { mockProyectos, mockAportes, mockHitos, mockPersonas } from '../data/mockData';
import type { Proyecto, Aporte, Hito, Persona, EstadoProyecto } from '../types';

type AppContextType = {
  proyectos: Proyecto[];
  personas: Persona[];
  aportes: Aporte[];
  hitos: Hito[];

  cambiarEstadoProyecto: (proyectoId: string, estado: EstadoProyecto) => void;
  agregarProyecto: (p: Proyecto) => void;
  agregarAporte: (a: Aporte) => void;
  agregarHito: (h: Hito) => void;
  toggleHito: (hitoId: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [proyectos, setProyectos] = useState<Proyecto[]>(mockProyectos);
  const [aportes, setAportes] = useState<Aporte[]>(mockAportes);
  const [hitos, setHitos] = useState<Hito[]>(mockHitos);
  const [personas] = useState<Persona[]>(mockPersonas);
  const cambiarEstadoProyecto = (proyectoId: string, estado: EstadoProyecto) => {
  setProyectos(prev =>
    prev.map(p => (p.id === proyectoId ? { ...p, estado } : p))
  );
  };
  const agregarProyecto = (p: Proyecto) => {
    setProyectos(prev => [...prev, p]);
  };

  const agregarAporte = (a: Aporte) => {
    setAportes(prev => [...prev, a]);


    
    // clave: sincroniza monto recaudado del proyecto
    setProyectos(prev =>
      prev.map(p =>
        p.id === a.proyectoId
          ? { ...p, montoRecaudado: p.montoRecaudado + a.monto }
          : p
      )
    );
  };

  const agregarHito = (h: Hito) => {
    setHitos(prev => [...prev, h]);
  };

  const toggleHito = (hitoId: string) => {
    setHitos(prev =>
      prev.map(h => (h.id === hitoId ? { ...h, completado: !h.completado } : h))
    );
  };

 const value = useMemo(() => ({
  proyectos,
  aportes,
  hitos,
  personas,
  agregarProyecto,
  agregarAporte,
  agregarHito,
  toggleHito,
  cambiarEstadoProyecto, // ✅
}), [proyectos, aportes, hitos, personas]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
}