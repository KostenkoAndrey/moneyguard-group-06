import { startServer } from './server.js';
import { initMongoDB } from './db/initMongoDB.js';

const bootstrap = async () => {
    await initMongoDB();
    startServer();
  };

  bootstrap();
