import app from './app.js';
import dotenv from 'dotenv';
import { runMigrations } from './config/migrate.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  console.log('⏳ Running database migrations...');
  await runMigrations();
  console.log('✅ Migrations done');

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

start().catch(err => {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
});
