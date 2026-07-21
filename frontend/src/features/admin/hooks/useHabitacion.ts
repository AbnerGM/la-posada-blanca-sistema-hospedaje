import { useState } from 'react';
import type{ Habitacion } from '../types/habitacion';
import { habitacionService } from '../services/habitacionService';

export const useHabitacion = (onSuccess: () => void) => {
  const [form, setForm] = useState<Habitacion>({
    nombre: '',
    precio_noche: 0,
    capacidad: 0,
    descripcion: '',
    imagenes: []
  });

  const guardar = async () => {
    await habitacionService.crearHabitacion(form);
    onSuccess();
  };

  return { form, setForm, guardar };
};