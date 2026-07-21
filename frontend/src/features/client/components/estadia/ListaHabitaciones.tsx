import type { Habitacion } from "../../types/estadia"; // Usamos 'type' como te pedía TS
import { HabitacionCard } from "./HabitacionCard";

interface Props {
  habitaciones: Habitacion[]; // Definimos que recibe un array de habitaciones
}

export const ListaHabitaciones = ({ habitaciones }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {habitaciones.map((hab) => (
        <HabitacionCard key={hab.id_habitacion} habitacion={hab} />
      ))}
    </div>
  );
};