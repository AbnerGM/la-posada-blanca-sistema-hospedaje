import { useBlog } from '../features/client/hooks/useBlog';
import type { BlogPost } from '../features/client/types/blog';

export const BlogPage = () => {
  const { posts, loading } = useBlog();

  if (loading) return <div>Cargando historias...</div>;

  return (
    // Agregamos pt-24 (o el valor que necesite tu navbar) para separar
    <div className="pt-24 px-4 md:px-16 pb-12"> 
      <h1 className="text-3xl font-bold mb-8">El Diario de Oxapampa</h1>
      
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
    </div>
  );
};