import { logger } from './shared/logger';
import app from './server';

// verifica a porta que vai subir
const port = Number(process.env.PORT || 3000);

// guarda a porta atual
app.set('listenOnPort', port);

// Start the server
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
