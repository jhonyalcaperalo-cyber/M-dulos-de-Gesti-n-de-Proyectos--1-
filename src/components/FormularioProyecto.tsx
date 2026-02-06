import { useState } from 'react'; // Mantener si hay otros usos de useState, o eliminar si no
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

import type { ProyectoFormData } from '../types';
import { createPortal } from 'react-dom'; // <--- NUEVA IMPORTACIÓN CRÍTICA

interface FormularioProyectoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FormularioProyecto({ isOpen, onClose }: FormularioProyectoProps) {
  // Estos logs ya los hemos verificado y sabemos que funcionan
  // console.log('FormularioProyecto renderizado. Prop isOpen:', isOpen);

  const { personas } = useAppContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProyectoFormData>();

  const onSubmit = async (data: ProyectoFormData) => {
    const nuevoProyecto = {
      ...data,
      montoRecaudado: 0,
      estado: "registrado",
      fechaCreacion: new Date().toLocaleDateString("es-ES"),
      persona_id: data.personaId || null,
    };

    const { error } = await supabase.from("proyectos").insert(nuevoProyecto);

    if (error) {
      console.error(error);
      toast.error("Ups, no se pudo guardar el proyecto");
    } else {
      toast.success("Proyecto creado exitosamente");
      reset();
      onClose();
    }
  };

  // Si el modal no debe estar abierto, no renderizamos nada
  if (!isOpen) {
    // console.log('FormularioProyecto: isOpen es false, devolviendo null.');
    return null;
  }

  // <--- CAMBIO PRINCIPAL AQUÍ: Usar createPortal para renderizar el modal en el body
  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto relative">
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Proyecto</h2>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          &times; {/* Icono de "cerrar" */}
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
            <input
              type="text"
              id="nombre"
              {...register('nombre', { required: 'El nombre es requerido' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.nombre && <span className="text-red-500 text-xs">{errors.nombre.message}</span>}
          </div>

          {/* Campo Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              id="descripcion"
              {...register('descripcion', { required: 'La descripción es requerida' })}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
            {errors.descripcion && <span className="text-red-500 text-xs">{errors.descripcion.message}</span>}
          </div>

          {/* Campo Categoría */}
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
            <input
              type="text"
              id="categoria"
              {...register('categoria', { required: 'La categoría es requerida' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.categoria && <span className="text-red-500 text-xs">{errors.categoria.message}</span>}
          </div>

          {/* Campo Región */}
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">Región</label>
            <input
              type="text"
              id="region"
              {...register('region', { required: 'La región es requerida' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.region && <span className="text-red-500 text-xs">{errors.region.message}</span>}
          </div>

          {/* Campo Departamento */}
          <div>
            <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">Departamento</label>
            <input
              type="text"
              id="departamento"
              {...register('departamento', { required: 'El departamento es requerido' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.departamento && <span className="text-red-500 text-xs">{errors.departamento.message}</span>}
          </div>

          {/* Campo Municipio */}
          <div>
            <label htmlFor="municipio" className="block text-sm font-medium text-gray-700">Municipio</label>
            <input
              type="text"
              id="municipio"
              {...register('municipio', { required: 'El municipio es requerido' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.municipio && <span className="text-red-500 text-xs">{errors.municipio.message}</span>}
          </div>

          {/* Campo Monto Requerido */}
          <div>
            <label htmlFor="montoRequerido" className="block text-sm font-medium text-gray-700">Monto Requerido</label>
            <input
              type="number"
              id="montoRequerido"
              {...register('montoRequerido', { required: 'El monto requerido es obligatorio', valueAsNumber: true })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.montoRequerido && <span className="text-red-500 text-xs">{errors.montoRequerido.message}</span>}
          </div>

          {/* Campo Persona Responsable (dropdown) */}
          <div>
            <label htmlFor="personaId" className="block text-sm font-medium text-gray-700">
              Persona Responsable
            </label>
            <select
              id="personaId"
              {...register('personaId', { required: 'La persona responsable es requerida' })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Selecciona un responsable</option>
              {personas.map((persona) => (
                <option key={persona.id} value={persona.id}>
                  {persona.nombre} ({persona.departamento})
                </option>
              ))}
            </select>
            {errors.personaId && (
              <span className="text-red-500 text-xs">{errors.personaId.message}</span>
            )}
          </div>

          {/* Campo Población Beneficiada */}
          <div>
            <label htmlFor="poblacionBeneficiada" className="block text-sm font-medium text-gray-700">Población Beneficiada</label>
            <input
              type="number"
              id="poblacionBeneficiada"
              {...register('poblacionBeneficiada', { required: 'Este campo es requerido', valueAsNumber: true })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.poblacionBeneficiada && <span className="text-red-500 text-xs">{errors.poblacionBeneficiada.message}</span>}
          </div>

          {/* Campo Empleos Generados */}
          <div>
            <label htmlFor="empleosGenerados" className="block text-sm font-medium text-gray-700">Empleos Generados</label>
            <input
              type="number"
              id="empleosGenerados"
              {...register('empleosGenerados', { required: 'Este campo es requerido', valueAsNumber: true })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.empleosGenerados && <span className="text-red-500 text-xs">{errors.empleosGenerados.message}</span>}
          </div>

          <button
            type="submit"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          >
            Crear Proyecto
          </button>
        </form>
      </div>
    </div>,
    document.body // <--- Esto es CRÍTICO: renderiza el modal directamente en el <body>
  );
}