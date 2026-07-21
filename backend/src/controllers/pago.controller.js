const pagoModel = require('../models/pago.model');
const { sendPagoAprobadoEmail, sendPagoRechazadoEmail } = require('../utils/mailer');
const { registrarActividad } = require('../utils/auditoria');

const registrarPago = async (req, res) => {
    try {
        const { id_reserva, metodo_pago, monto } = req.body;
        if (!req.file) {
            return res.status(400).json({
                mensaje: 'Debe subir un comprobante de pago.'
            });
        }

        const comprobante = req.file.path.replace(/\\/g, '/');

        const id_pago = await pagoModel.registrarPago({
            id_reserva,
            metodo_pago,
            monto,
            comprobante
        });
        res.json({
            success: true,
            mensaje: 'Comprobante enviado correctamente. El pago queda en revisión.',
            id_pago
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al registrar el pago.'
        });
    }
};

const listarPagosPendientes = async (req, res) => {
    try {
        const pagos = await pagoModel.listarPagosPendientes();

        res.json({
            success: true,
            pagos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al listar pagos pendientes.'
        });
    }
};

const aprobarPago = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pagoModel.aprobarPago(id);

    if (!resultado) {
      return res.status(404).json({ success: false, mensaje: 'Pago no encontrado.' });
    }

    const datos = await pagoModel.obtenerDatosCorreoPago(id);

    if (datos?.correo) {
      await sendPagoAprobadoEmail(datos.correo, {
        nombre: datos.nombre,
        habitacion: datos.habitacion,
        entrada: datos.fecha_entrada,
        salida: datos.fecha_salida,
        total: datos.total
      });
    }
    await registrarActividad(
      req.usuario.id,
      'aprobar_pago',
      `Aprobo el pago #${id} de la reserva de ${datos?.nombre || 'un cliente'}`
    );

    res.json({ success: true, mensaje: 'Pago aprobado correctamente.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, mensaje: 'Error al aprobar el pago.' });
  }
};

const rechazarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo_rechazo } = req.body;
    if (!motivo_rechazo || motivo_rechazo.trim() === '') {
      return res.status(400).json({ success: false, mensaje: 'Debe ingresar un motivo de rechazo.' });
    }
    const resultado = await pagoModel.rechazarPago(id, motivo_rechazo);
    if (!resultado) {
      return res.status(404).json({ success: false, mensaje: 'Pago no encontrado.' });
    }
    const datos = await pagoModel.obtenerDatosCorreoPago(id);
    if (datos?.correo) {
      await sendPagoRechazadoEmail(datos.correo, {
        nombre: datos.nombre,
        motivo: motivo_rechazo
      });
    }
    await registrarActividad(
      req.usuario.id,
      'rechazar_pago',
      `Rechazo el pago #${id} de la reserva de ${datos?.nombre || 'un cliente'}. Motivo: ${motivo_rechazo}`
    );
    res.json({ success: true, mensaje: 'Pago rechazado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, mensaje: 'Error al rechazar el pago.' });
  }
};

module.exports = {
    registrarPago,
    listarPagosPendientes,
    aprobarPago,
    rechazarPago
};