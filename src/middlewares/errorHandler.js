function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === 'EREQUEST' && err.number === 2627) {
    return res.status(409).json({
      success: false,
      message: 'El email ya está registrado',
    });
  }

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
}

module.exports = { notFound, errorHandler };
