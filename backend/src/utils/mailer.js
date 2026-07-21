const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});

const sendVerificationEmail = async (to, code) => {
    try {
        await transporter.sendMail({
            from: `"Posada Blanca" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Código de verificación - Posada Blanca",
            html: `
                <div style="font-family:sans-serif; background:#f4f4f4; padding:40px; text-align:center;">
                    <div style="background:#ffffff; max-width:520px; margin:auto; border-radius:16px; padding:40px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                        <h1 style="color:#7c5c3e;">🏨 Posada Blanca</h1>
                        <p>Tu código de verificación es:</p>
                        <h2 style="font-size:32px; letter-spacing:8px; color:#7c5c3e;">${code}</h2>
                        <p>Expira en 1 minuto.</p>
                    </div>
                </div>`
        });
    } catch (error) {
        console.error("Error al enviar email:", error);
        throw new Error("No se pudo enviar el correo");
    }
};

const sendPasswordResetEmail = async (to, resetUrl) => {
    try {
        await transporter.sendMail({
            from: `"Posada Blanca" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Recuperación de contraseña - Posada Blanca",
            html: `
<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr><td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr><td align="center" style="background:#7c5c3e;padding:36px 40px 28px;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;">🏨 Posada Blanca</h1>
              <p style="margin:8px 0 0;color:#e8d9c8;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Recuperación de cuenta</p>
          </td></tr>
          <tr><td style="padding:40px 48px;">
              <p style="color:#333;font-size:15px;">Hola,</p>
              <p style="color:#555;font-size:14px;line-height:1.7;">Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para continuar:</p>
              <div style="text-align:center; margin:30px 0;">
                <a href="${resetUrl}" style="background:#7c5c3e;color:#ffffff;padding:15px 30px;text-decoration:none;border-radius:8px;font-weight:bold;">Restablecer Contraseña</a>
              </div>
              <p style="color:#888;font-size:13px;">Si no solicitaste esto, ignora este mensaje.</p>
          </td></tr>
          <tr><td style="background:#f9f3ec;padding:20px;text-align:center;color:#aaa;font-size:12px;">
              © ${new Date().getFullYear()} Posada Blanca
          </td></tr>
        </table>
    </td></tr>
  </table>
</body>
</html>`
        });
    } catch (error) {
        console.error("Error al enviar email de reset:", error);
        throw new Error("No se pudo enviar el correo");
    }
};

const sendPagoAprobadoEmail = async (to, datos) => {
  await transporter.sendMail({
    from: `"Posada Blanca" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reserva confirmada - Posada Blanca",
    html: `<div style="font-family:Arial;padding:30px;background:#f4f4f4;">
      <div style="background:white;max-width:520px;margin:auto;padding:30px;border-radius:16px;">
        <h2 style="color:#7c5c3e;">🏨 Reserva confirmada</h2>
        <p>Hola ${datos.nombre},</p>
        <p>Tu pago fue aprobado y tu reserva ha sido confirmada.</p>
        <p><b>Habitación:</b> ${datos.habitacion}</p>
        <p><b>Entrada:</b> ${datos.entrada}</p>
        <p><b>Salida:</b> ${datos.salida}</p>
        <p><b>Total:</b> S/ ${datos.total}</p>
        <p>Gracias por elegir Posada Blanca.</p>
      </div>
    </div>`
  });
};

const sendPagoRechazadoEmail = async (to, datos) => {
  await transporter.sendMail({
    from: `"Posada Blanca" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Pago rechazado - Posada Blanca",
    html: `<div style="font-family:Arial;padding:30px;background:#f4f4f4;">
      <div style="background:white;max-width:520px;margin:auto;padding:30px;border-radius:16px;">
        <h2 style="color:#7c5c3e;">Pago rechazado</h2>
        <p>Hola ${datos.nombre},</p>
        <p>No pudimos validar el comprobante enviado.</p>
        <p><b>Motivo:</b> ${datos.motivo}</p>
        <p>Por favor ingresa nuevamente al sistema y sube otro comprobante.</p>
      </div>
    </div>`
  });
};

const sendReservaRecepcionEmail = async (to, datos) => {
    await transporter.sendMail({
        from: `"Posada Blanca" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Reserva registrada - Posada Blanca",
        html: `
        <div style="font-family:Arial;padding:30px;background:#f4f4f4;">
            <div style="background:#fff;max-width:520px;margin:auto;padding:30px;border-radius:16px;">
                <h2 style="color:#7c5c3e;">🏨 Reserva registrada</h2>

                <p>Hola <b>${datos.nombre}</b>,</p>

                <p>Hemos registrado una reserva a tu nombre desde nuestra recepción.</p>

                <p><b>Habitación:</b> ${datos.habitacion}</p>
                <p><b>Entrada:</b> ${datos.fecha_entrada}</p>
                <p><b>Salida:</b> ${datos.fecha_salida}</p>
                <p><b>Total:</b> S/ ${datos.total}</p>

                <hr>

                <p>Si en el futuro deseas ingresar a nuestra página web para consultar tus reservas, utiliza la opción <b>"¿Olvidaste tu contraseña?"</b> con este mismo correo para activar tu cuenta.</p>

                <p>¡Te esperamos en Posada Blanca!</p>

            </div>
        </div>`
    });
};
const sendNuevaReservaStaffEmail = async (to, datos) => {
    await transporter.sendMail({
        from: `"Posada Blanca" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Nueva reserva pendiente de revisión - Posada Blanca",
        html: `
        <div style="font-family:Arial;padding:30px;background:#f4f4f4;">
            <div style="background:#fff;max-width:520px;margin:auto;padding:30px;border-radius:16px;">
                <h2 style="color:#7c5c3e;">🔔 Nueva reserva</h2>

                <p>Un cliente acaba de registrar una nueva reserva. Revisa la sección de pagos pendientes para aprobarla o rechazarla en cuanto se suba el comprobante.</p>

                <p><b>Cliente:</b> ${datos.nombreCliente}</p>
                <p><b>Habitación:</b> ${datos.habitacion}</p>
                <p><b>Entrada:</b> ${datos.fecha_entrada}</p>
                <p><b>Salida:</b> ${datos.fecha_salida}</p>
                <p><b>Total:</b> S/ ${datos.total}</p>
                <p><b>N° de reserva:</b> #${datos.id_reserva}</p>
            </div>
        </div>`
    });
};
const sendEmpleadoCreadoEmail = async (to, datos) => {
    await transporter.sendMail({
        from: `"Posada Blanca" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Tu cuenta ha sido creada - Posada Blanca",
        html: `
        <div style="font-family:Arial;padding:30px;background:#f4f4f4;">
            <div style="background:#fff;max-width:520px;margin:auto;padding:30px;border-radius:16px;">
                <h2 style="color:#7c5c3e;">🏨 Bienvenido a Posada Blanca</h2>

                <p>Hola <b>${datos.nombre}</b>,</p>

                <p>El Administrador te ha registrado en el sistema como <b>${datos.rol}</b>.</p>

                <hr>

                <p>Para acceder, ingresa a nuestra página web y utiliza la opción <b>"¿Olvidaste tu contraseña?"</b> con este mismo correo para activar tu cuenta y crear tu contraseña.</p>

                <p>¡Te damos la bienvenida al equipo!</p>
            </div>
        </div>`
    });
};
module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendPagoAprobadoEmail, sendPagoRechazadoEmail, sendReservaRecepcionEmail, sendNuevaReservaStaffEmail, sendEmpleadoCreadoEmail  };