import { useBlog } from '../../hooks/useBlog';
import type { BlogPost } from '../../types/blog';

export const ListaPosts = () => {
  const { posts, loading } = useBlog();

  if (loading) return <div>Cargando historias...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {posts.map((post: BlogPost) => (
        <div key={post.id_post} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
          <img src={post.imagen} alt={post.titulo} className="w-full h-48 object-cover" />
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-800">{post.titulo}</h3>
            <p className="text-slate-500 text-sm mt-2 line-clamp-3">{post.contenido}</p>
            <button className="text-emerald-600 font-bold text-sm mt-4 hover:underline">Leer más →</button>
          </div>
        </div>
      ))}
    </div>
  );
};