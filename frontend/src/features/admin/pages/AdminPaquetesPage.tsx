import { PaquetesTable } from '../components/PaquetesTable';
import { usePaquetes } from '../hooks/usePaquetes';
import { RefreshCw, Plus } from 'lucide-react';
import Swal from 'sweetalert2';

export const AdminPaquetesPage = () => {
  const { paquetes, loading, agregarPaquete, refresh } = usePaquetes();

  const handleNuevo = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Crear nuevo Tour',
      html:
        '<input id="swal-nombre" class="swal2-input" placeholder="Nombre del Tour" style="width: 80%">' +
        '<input id="swal-desc" class="swal2-input" placeholder="Descripción" style="width: 80%">' +
        '<input id="swal-precio" type="number" class="swal2-input" placeholder="Precio" style="width: 80%">' +
        '<input id="swal-duracion" class="swal2-input" placeholder="Duración (ej: 3 días)" style="width: 80%">' +
        '<input id="swal-cupo" type="number" class="swal2-input" placeholder="Cupo disponible" style="width: 80%">',
      focusConfirm: false,
      confirmButtonText: 'Guardar Tour',
      confirmButtonColor: '#1e293b',
      preConfirm: () => {
        const nombre = (document.getElementById('swal-nombre') as HTMLInputElement).value;
        const descripcion = (document.getElementById('swal-desc') as HTMLInputElement).value;
        const precio = parseFloat((document.getElementById('swal-precio') as HTMLInputElement).value);
        const duracion = (document.getElementById('swal-duracion') as HTMLInputElement).value;
        const cupo_disponible = parseInt((document.getElementById('swal-cupo') as HTMLInputElement).value);

        if (!nombre || !precio) {
          Swal.showValidationMessage('El nombre y el precio son obligatorios');
          return false;
        }
        return { nombre, descripcion, precio, duracion, cupo_disponible };
      }
    });

    if (formValues) {
      await agregarPaquete(formValues);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Tours</h1>
          <p className="text-slate-500 text-sm">Administración de paquetes turísticos</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={refresh} 
            className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
            title="Actualizar"
          >
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={handleNuevo} 
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition"
          >
            <Plus size={20} /> Nuevo Tour
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      {loading ? (
        <div className="text-center p-10 text-slate-500 animate-pulse">Cargando tours...</div>
      ) : (
        <PaquetesTable 
          paquetes={paquetes} 
          onRefresh={refresh} 
        />
      )}
    </div>
  );
};