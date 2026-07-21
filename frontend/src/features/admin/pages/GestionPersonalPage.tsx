import { useState, useEffect } from 'react';
import type { UsuarioConRol } from '../types/personal';
import { manejarSesionExpirada } from '../../../utils/sesion';
import { dniService } from '../../auth/services/dni.service';

// URL de localhost cambiada a la de producción fija con el puerto :3000
const API_URL = 'https://laposadablanca.duckdns.org:3000';

interface Rol {
  id_rol: number;
  nombre_rol: string;
}

export const GestionPersonalPage = () => {
  const [usuarios, setUsuarios] = useState<UsuarioConRol[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({ nombre: '', correo: '', telefono: '', id_rol: '', dni: '' });
  const [creando, setCreando] = useState(false);
  const [verificandoDni, setVerificandoDni] = useState(false);

  const token = localStorage.getItem('token');

  const cargarUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}/api/personal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        return manejarSesionExpirada();
      }
      if (!res.ok) throw new Error('Error al obtener el personal');

      const data = await res.json();
      setUsuarios(data.usuarios);
    } catch (error) {
      console.error('Error al cargar personal:', error);
    }
  };

  // Reutilizamos el endpoint de la matriz solo para sacar la lista de roles
  // disponibles (las opciones del dropdown)
  const cargarRoles = async () => {
    try {
      const res = await fetch(`${API_URL}/api/roles-permisos/matriz`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al obtener roles');

      const data = await res.json();
      setRoles(data.roles);
    } catch (error) {
      console.error('Error al cargar roles:', error);
    }
  };

  useEffect(() => {
    const cargarTodo = async () => {
      setCargando(true);
      await Promise.all([cargarUsuarios(), cargarRoles()]);
      setCargando(false);
    };
    cargarTodo();
  }, []);

  // Se dispara cuando el Administrador cambia el dropdown de un usuario
  const handleCambiarRol = async (id_usuario: number, nuevoIdRol: number) => {
    try {
      const res = await fetch(`${API_URL}/api/personal/${id_usuario}/rol`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id_rol: nuevoIdRol }),
      });
      if (!res.ok) throw new Error('Error al actualizar el rol');

      // Actualizamos en pantalla sin tener que recargar todo desde el backend
      const rolNuevo = roles.find((r) => r.id_rol === nuevoIdRol);
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id_usuario === id_usuario
            ? { ...u, id_rol: nuevoIdRol, nombre_rol: rolNuevo?.nombre_rol || u.nombre_rol }
            : u
        )
      );
    } catch (error) {
      console.error('Error al cambiar el rol:', error);
      alert('Ocurrió un error al cambiar el rol.');
    }
  };

  const formatName = (fullName: string) =>
    fullName.toLowerCase().split(' ').filter(w => w.length > 0)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const handleVerificarDni = async () => {
    if (nuevoEmpleado.dni.length !== 8) {
      alert('El DNI debe tener 8 dígitos.');
      return;
    }
    setVerificandoDni(true);
    try {
      const data = await dniService.verificar(nuevoEmpleado.dni);
      if (data?.nombre) {
        const nombreFormateado = formatName(data.nombre.replace(/[,.]/g, ''));
        setNuevoEmpleado((prev) => ({ ...prev, nombre: nombreFormateado }));
      } else {
        alert('DNI no encontrado.');
      }
    } catch {
      alert('Error al conectar con el servicio de DNI.');
    } finally {
      setVerificandoDni(false);
    }
  };

  const handleCrearEmpleado = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoEmpleado.nombre || !nuevoEmpleado.correo || !nuevoEmpleado.id_rol) {
      alert('Nombre, correo y rol son obligatorios.');
      return;
    }

    setCreando(true);
    try {
      const res = await fetch(`${API_URL}/api/personal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...nuevoEmpleado,
          id_rol: Number(nuevoEmpleado.id_rol),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Error al registrar el empleado.');
        return;
      }

      alert('Empleado registrado correctamente. Se le envió un correo para activar su cuenta.');
      setNuevoEmpleado({ nombre: '', correo: '', telefono: '', id_rol: '', dni: '' });
      setMostrarForm(false);
      cargarUsuarios();
    } catch (error) {
      console.error('Error al crear empleado:', error);
      alert('Ocurrió un error al registrar el empleado.');
    } finally {
      setCreando(false);
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) {
    return <div className="p-6 text-slate-500">Cargando personal...</div>;
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Gestión de Personal</h1>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          {mostrarForm ? 'Cerrar' : '+ Nuevo Empleado'}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleCrearEmpleado} className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 space-y-4 max-w-lg">
          <h2 className="font-bold text-slate-800">Registrar nuevo empleado</h2>

          <div className="flex gap-2">
            <input
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
              placeholder="DNI (8 dígitos)"
              maxLength={8}
              value={nuevoEmpleado.dni}
              onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, dni: e.target.value.replace(/\D/g, '') })}
            />
            <button
              type="button"
              onClick={handleVerificarDni}
              disabled={verificandoDni}
              className="bg-slate-800 text-white px-4 rounded-lg text-sm font-bold hover:bg-slate-900 disabled:opacity-50"
            >
              {verificandoDni ? 'Verificando...' : 'Verificar'}
            </button>
          </div>

          <input
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50"
            placeholder="El nombre aparecerá aquí tras verificar el DNI"
            value={nuevoEmpleado.nombre}
            readOnly
          />

          <input
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Correo electrónico"
            type="email"
            value={nuevoEmpleado.correo}
            onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, correo: e.target.value })}
          />

          <input
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Teléfono (opcional)"
            value={nuevoEmpleado.telefono}
            onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, telefono: e.target.value })}
          />

          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
            value={nuevoEmpleado.id_rol}
            onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, id_rol: e.target.value })}
          >
            <option value="">-- Selecciona un rol --</option>
            {roles.filter(r => r.id_rol !== 1).map((r) => (
              <option key={r.id_rol} value={r.id_rol}>{r.nombre_rol}</option>
            ))}
          </select>

          <button
            type="submit"
            disabled={creando}
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {creando ? 'Registrando...' : 'Registrar empleado'}
          </button>
        </form>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border border-slate-300 rounded-xl text-sm"
        />
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-3 font-semibold text-slate-600 border-b border-slate-200">Nombre</th>
              <th className="text-left p-3 font-semibold text-slate-600 border-b border-slate-200">Correo</th>
              <th className="text-left p-3 font-semibold text-slate-600 border-b border-slate-200">Rol actual</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr key={u.id_usuario} className="border-b border-slate-100">
                <td className="p-3 text-slate-700 font-medium">{u.nombre}</td>
                <td className="p-3 text-slate-500">{u.correo}</td>
                <td className="p-3">
                  <select
                    value={u.id_rol}
                    onChange={(e) => handleCambiarRol(u.id_usuario, Number(e.target.value))}
                    className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white"
                  >
                    {roles.map((r) => (
                      <option key={r.id_rol} value={r.id_rol}>
                        {r.nombre_rol}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};