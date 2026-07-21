# Sistema Full-Stack de Gestión Hotelera - La Posada Blanca

Aplicación web enterprise diseñada para la administración y operación hotelera en tiempo real. Resuelve flujos complejos como control de disponibilidad de habitaciones, gestión de reservas, módulos de turismo local,con un gestor de pagos y un panel administrativo con seguridad basada en roles (RBAC).

# Enlace en Producción
URL del Sistema: https://laposadablanca.duckdns.org/

## Stack Tecnológico
* **Frontend:** 
  * React 19 + TypeScript (Vite como bundler)
  * Tailwind CSS v4 para el diseño de interfaces
  * React Router v7 para el enrutamiento protegido
  * Axios para el consumo de la API REST
  * Recharts para métricas y gráficos del dashboard
  * Framer Motion para animaciones fluidas
  * SweetAlert2 para alertas interactivas
  * html2pdf.js y xlsx para exportación de reportes y documentos
* **Backend:** 
  * Node.js con Express 5 (Arquitectura modular basada en controladores, rutas y modelos)
  * JSON Web Tokens (JWT) y Bcryptjs para autenticación segura y hashing de contraseñas
  * MySQL2 para la gestión de base de datos relacional y consultas optimizadas
  * Multer para la subida y manejo de archivos/comprobantes
  * Nodemailer para notificaciones y correos transaccionales
* **Infraestructura:** 
  * Servidor VPS con panel HestiaCP
  * Nginx como proxy inverso (HTTPS / SSL)
  * PM2 para gestión de procesos del backend en producción
    
  # EJECUTE ESTO PARA CLONAR EL PROYECTO Y LO PUEDO CORRER LOCALMENTE:
  git clone [https://github.com/AbnerGM/la-posada-blanca-sistema-hospedaje.git](https://github.com/AbnerGM/la-posada-blanca-sistema-hospedaje.git)

  # LEVANTAR EL BACKEND:
   **Configura tu archivo .env basado en el .env.example
   * cd (ruta del proyecto) luego cd backend
   * npm install
   npm run dev
  # LEVANTAR EL FRONTEND:
  * cd (ruta del proyecto) luego cd frontend
  * npm install
  * npm run dev

imagenes del proyecto:

<img width="1901" height="907" alt="image" src="https://github.com/user-attachments/assets/c07039a6-3ef0-446c-8ff1-c1defe78a037" />
<img width="1915" height="902" alt="image" src="https://github.com/user-attachments/assets/f629c2a4-7ff4-474f-b502-6e12ea8ed94e" />
<img width="1891" height="912" alt="image" src="https://github.com/user-attachments/assets/38000754-f841-4c1e-8729-59d94800e0dd" />




