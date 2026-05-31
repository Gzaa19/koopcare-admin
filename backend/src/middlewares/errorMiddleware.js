import multer from 'multer';

const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle multer errors (file size, format, dll)
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: 'Ukuran file terlalu besar. Maksimal 5MB per foto.',
      LIMIT_UNEXPECTED_FILE: 'Field file tidak dikenali.',
    };
    return res.status(400).json({
      success: false,
      error: messages[err.code] || `Upload error: ${err.message}`,
    });
  }

  // Handle error dari fileFilter (format tidak didukung)
  if (err.message?.includes('Format file tidak didukung')) {
    return res.status(400).json({ success: false, error: err.message });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan pada server';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorMiddleware;