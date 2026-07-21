import { useEffect } from 'react';

export const PoliticasPrivacidadPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-28 px-6 md:px-16 pb-24 max-w-4xl mx-auto font-sans text-slate-800 antialiased"> 
      
      {/* Encabezado Institucional */}
      <div className="border-b border-slate-200 pb-6 mb-10">
        <span className="text-xs font-bold tracking-widest text-secondary uppercase block mb-2">Documento Oficial</span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary tracking-tight mb-3">
          Políticas de Privacidad y Protección de Datos
        </h1>
        <p className="text-slate-500 text-xs">
          La Posada Blanca Oxapampa • Última actualización: 17 de julio de 2026
        </p>
      </div>

      {/* Introducción Legal y Corporativa */}
      <div className="prose prose-slate max-w-none text-sm md:text-base leading-relaxed text-slate-600 space-y-6">
        <p>
          En <strong>La Posada Blanca</strong> (operado comercialmente bajo la razón social <em>Inversiones Hoteleras La Posada Blanca S.A.C.</em>, con <strong>RUC N° 20784930211</strong> y Registro Técnico de MINCETUR), nos tomamos muy en serio la confidencialidad y la seguridad de la información de nuestros huéspedes. 
        </p>
        <p>
          Este documento detalla de manera estricta y transparente cómo recopilamos, procesamos, almacenamos y protegemos sus datos de carácter personal, en total cumplimiento con la <strong>Ley N° 29733</strong> (Ley de Protección de Datos Personales en el Perú) y su Reglamento aprobado por Decreto Supremo N° 003-2013-JUS. Al registrarse en nuestra plataforma, efectuar una reserva o pernoctar en nuestras instalaciones de Oxapampa, usted otorga su consentimiento expreso para los tratamientos aquí descritos.
        </p>

        <hr className="border-slate-200 my-10" />

        {/* Sección 1 */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-serif font-bold text-primary flex items-center gap-2">
            1. Identificación del Banco de Datos y Recopilación
          </h2>
          <p>
            Toda la información personal recolectada a través de nuestros canales digitales o formularios físicos de Check-In será incorporada de forma indefinida en el Banco de Datos Denominado <strong>"Huéspedes y Clientes"</strong>, inscrito formalmente ante la Autoridad Nacional de Protección de Datos Personales (ANPD).
          </p>
          <p className="font-medium text-slate-700">Los datos estrictamente recabados comprenden:</p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
            <li><strong>Datos de Filiación Obligatorios:</strong> Nombres, apellidos, nacionalidad, fecha de nacimiento y documento oficial de identidad (DNI, Pasaporte o Carné de Extranjería) exigidos por las normas de control hotelero vigentes en el Perú.</li>
            <li><strong>Información de Contacto Frecuente:</strong> Dirección de correo electrónico y número telefónico móvil para el envío de confirmaciones de transacciones.</li>
            <li><strong>Datos de Transacción y Facturación:</strong> Detalles de consumo interno, dirección fiscal y número de RUC en caso de solicitudes de facturas corporativas.</li>
            <li><strong>Preferencias y Registro Sensible:</strong> Restricciones o alergias alimentarias, requerimientos específicos de accesibilidad médica y detalles logísticos de traslados al fundo en Oxapampa.</li>
          </ul>
        </section>

        {/* Sección 2 */}
        <section className="space-y-3 pt-4">
          <h2 className="text-lg md:text-xl font-serif font-bold text-primary">
            2. Finalidades Principales del Tratamiento
          </h2>
          <p>
            Tratamos sus datos personales con el único propósito de garantizar la correcta prestación de los servicios ecoturísticos y de hotelería contratados. Las finalidades específicas incluyen:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-sm text-slate-600">
            <li>Procesar, validar, modificar y asegurar la reserva de habitaciones, bungalows y paquetes turísticos adicionales dentro del fundo.</li>
            <li>Gestionar los registros migratorios obligatorios y el control de huéspedes en el ingreso del hotel (Ficha de Registro de Huéspedes).</li>
            <li>Efectuar la facturación electrónica obligatoria y reportes contables auditados bajo los parámetros exigidos por la Superintendencia Nacional de Aduanas y de Administración Tributaria (SUNAT).</li>
            <li>Atender solicitudes personalizadas de alimentación o accesibilidad para resguardar la salud e integridad física del huésped durante su estancia.</li>
          </ol>
        </section>

        {/* Sección 3 */}
        <section className="space-y-3 pt-4">
          <h2 className="text-lg md:text-xl font-serif font-bold text-primary">
            3. Cláusulas de Transferencia y Encargados del Tratamiento
          </h2>
          <p>
            La Posada Blanca adopta una política de cero comercialización de datos. No vendemos, alquilamos ni cedemos su información a terceras empresas bajo ningún concepto comercial. 
          </p>
          <p>
            No obstante, para garantizar la operatividad de los pagos y la estabilidad del software, los datos se transfieren de manera segura a proveedores tecnológicos externos que actúan estrictamente bajo la calidad de <strong>Encargados del Tratamiento</strong> (tales como pasarelas de pago bancarias con certificación PCI-DSS, proveedores de alojamiento en la nube y sistemas CRM de gestión hotelera). Estos intermediarios están vinculados contractualmente a rigurosas cláusulas de confidencialidad que prohíben el uso de sus datos para fines propios.
          </p>
        </section>

        {/* Sección 4 */}
        <section className="space-y-3 pt-4">
          <h2 className="text-lg md:text-xl font-serif font-bold text-primary">
            4. Protocolos de Seguridad Física y Digital
          </h2>
          <p>
            Para evitar la alteración, pérdida, tratamiento o acceso no autorizado a su información, aplicamos medidas de seguridad de nivel corporativo internacional, alineadas a las directrices técnicas de la ANPD:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-slate-600">
            <li>Cifrado de extremo a extremo mediante certificados SSL/TLS en todos nuestros flujos y formularios web.</li>
            <li>Aislamiento estricto de bases de datos mediante firewalls y políticas de privilegios mínimos para el personal administrativo y de recepción.</li>
            <li>Almacenamiento de respaldos (Backups) cifrados y auditorías periódicas de registros de actividad del sistema para detectar vectores de riesgo.</li>
          </ul>
        </section>

        {/* Sección 5 */}
        <section className="space-y-3 pt-4">
          <h2 className="text-lg md:text-xl font-serif font-bold text-primary">
            5. Ejercicio de Derechos ARCO y Revocatoria
          </h2>
          <p>
            Usted es propietario de sus datos y mantiene de forma permanente el derecho de <strong>Acceso, Rectificación, Cancelación y Oposición (Derechos ARCO)</strong>, así como la potestad de revocar los consentimientos de marketing en cualquier momento.
          </p>
          <p>
            Para ejercer estos derechos, deberá enviar una solicitud formal por escrito adjuntando una copia escaneada de su documento oficial de identidad (DNI o Pasaporte) a nuestro canal oficial de atención de privacidad: <span className="text-primary font-bold underline">reservas@laposadablanca.com</span>. Su requerimiento será evaluado y resuelto dentro de los plazos legales estipulados por la normativa peruana.
          </p>
        </section>

        {/* Sección 6 */}
        <section className="space-y-3 pt-4">
          <h2 className="text-lg md:text-xl font-serif font-bold text-primary">
            6. Modificaciones a la Presente Política
          </h2>
          <p>
            Nos reservamos el derecho de modificar o actualizar estos términos para adaptarlos a nuevas legislaciones nacionales, requerimientos de la SUNAT o mejoras operacionales del hotel. Cualquier cambio sustancial será notificado oportunamente mediante avisos destacados en nuestra plataforma web principal antes de su entrada en vigor.
          </p>
        </section>

      </div>

      {/* Sello Final de Confianza */}
      <div className="mt-16 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700 mb-1">Inversiones Hoteleras La Posada Blanca S.A.C.</p>
        <p>Fundo La Esperanza s/n, Oxapampa, Región Pasco, Perú</p>
        <p className="mt-2">Protección de datos garantizada bajo los marcos de fiscalización de la República del Perú.</p>
      </div>

    </div>
  );
};