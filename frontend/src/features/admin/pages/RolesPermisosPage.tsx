import { useState, useEffect } from 'react';
import type { Rol, Permiso, MatrizResponse } from '../types/rolPermiso';
import { manejarSesionExpirada } from '../../../utils/sesion';

// URL de localhost cambiada a la de producción fija con el puerto :3000
const API_URL = 'https://laposadablanca.duckdns.org:3000';

export const RolesPermisosPage = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [marcados, setMarcados] = useState<Record<string, boolean>>({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const token = localStorage.getItem('token');

  const cargar = async () => {
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/api/roles-permisos/matriz`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        return manejarSesionExpirada();
      }
      if (!res.ok) throw new Error('Error al obtener la matriz de roles y permisos');

      const data: MatrizResponse = await res.json();
      setRoles(data.roles);
      setPermisos(data.permisos);
      const marcadosIniciales: Record<string, boolean> = {};
      data.asignaciones.forEach((a) => {
        marcadosIniciales[`${a.id_rol}-${a.id_permiso}`] = true;
      });
      setMarcados(marcadosIniciales);
    } catch (error) {
      console.error('Error al cargar roles y permisos:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const toggleCheckbox = (id_rol: number, id_permiso: number) => {
    const key = `${id_rol}-${id_permiso}`;
    setMarcados((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const guardarRol = async (id_rol: number) => {
    const idsPermisos = permisos
      .filter((p) => marcados[`${id_rol}-${p.id_permiso}`])
      .map((p) => p.id_permiso);

    const res = await fetch(`${API_URL}/api/roles-permisos/rol/${id_rol}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ idsPermisos }),
    });

    if (!res.ok) throw new Error(`Error al guardar el rol ${id_rol}`);
  };

  const handleGuardarTodo = async () => {
    setGuardando(true);
    try {
      for (const rol of roles) {
        await guardarRol(rol.id_rol);
      }
      alert('Permisos guardados correctamente.');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Ocurrió un error al guardar los permisos.');
    } finally {
      setGuardando(false);
    }
  };

  const handleCrearRol = async () => {
    const nombre = window.prompt('Nombre del nuevo rol (ej: Personal de Limpieza):');
    if (!nombre || !nombre.trim()) return;

    try {
      const res = await fetch(`${API_URL}/api/roles-permisos/rol`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre_rol: nombre.trim() }),
      });
      if (!res.ok) throw new Error('Error al crear el rol');

      await cargar(); // recargamos toda la matriz para que aparezca la columna nueva
    } catch (error) {
      console.error('Error al crear rol:', error);
      alert('Ocurrió un error al crear el rol.');
    }
  };

  // Botón "eliminar" al lado de un rol (solo visible si es_base === 0)
  const handleEliminarRol = async (rol: Rol) => {
    const confirmar = window.confirm(`¿Eliminar el rol "${rol.nombre_rol}"? Esta acción no se puede deshacer.`);
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/api/roles-permisos/rol/${rol.id_rol}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al eliminar el rol');

      await cargar();
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      alert('Ocurrió un error al eliminar el rol.');
    }
  };

  if (cargando) {
    return <div className="p-6 text-slate-500">Cargando roles y permisos...</div>;
  }

  // Agrupamos los permisos por categoria, para que la tabla no sea una lista plana
  const categorias = [...new Set(permisos.map((p) => p.categoria))];

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Roles y Permisos</h1>
        <div className="flex gap-3">
          <button
            onClick={handleCrearRol}
            className="bg-white border border-slate-300 text-slate-700 px-5 py-2 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
          >
            + Crear nuevo rol
          </button>
          <button
            onClick={handleGuardarTodo}
            disabled={guardando}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-3 font-semibold text-slate-600 border-b border-slate-200">Permiso</th>
              {roles.map((rol) => (
                <th key={rol.id_rol} className="text-center p-3 font-semibold text-slate-600 border-b border-slate-200">
                  <div className="flex flex-col items-center gap-1">
                    {rol.nombre_rol}
                    {!rol.es_base && (
                      <button
                        onClick={() => handleEliminarRol(rol)}
                        className="text-xs text-red-500 hover:underline font-normal"
                      >
                        eliminar
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <>
                <tr key={categoria} className="bg-slate-50">
                  <td colSpan={roles.length + 1} className="p-2 px-3 font-semibold text-slate-500 text-xs uppercase">
                    {categoria}
                  </td>
                </tr>
                {permisos
                  .filter((p) => p.categoria === categoria)
                  .map((permiso) => (
                    <tr key={permiso.id_permiso} className="border-b border-slate-100">
                      <td className="p-3 text-slate-700">{permiso.nombre}</td>
                      {roles.map((rol) => (
                        <td key={rol.id_rol} className="text-center p-3">
                          <input
                            type="checkbox"
                            checked={!!marcados[`${rol.id_rol}-${permiso.id_permiso}`]}
                            onChange={() => toggleCheckbox(rol.id_rol, permiso.id_permiso)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        Los roles base (Cliente, Recepcionista, Administrador) no se pueden eliminar.
      </p>
    </div>
  );
};