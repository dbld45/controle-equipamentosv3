import type { IncomingMessage, ServerResponse } from 'node:http';

export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader('content-type', 'application/json; charset=utf-8');

  const required = ['DATABASE_URL', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, error: 'Variáveis de ambiente ausentes.', missing }));
    return;
  }

  try {
    const { initializeDatabase } = await import('../apps/api/src/database/init.ts');
    await initializeDatabase();
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true, service: 'controle-equipamentos-av-api', database: 'postgres', initialized: true }));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : 'Falha ao inicializar o banco.' }));
  }
}
