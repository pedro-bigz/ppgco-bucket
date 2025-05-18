import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
import { isProduction } from './utils';

async function bootstrap() {
  if (!isProduction()) {
    await CommandFactory.run(AppModule, ['warn', 'debug', 'error', 'log']);
  }
}

bootstrap()
  .then(async () => {
    console.info('\n\nCommand bootstrapped ...!');
    process.exit(0);
  })
  .catch((err) => {
    console.error(`server failed to start command`, err);
    process.exit(1);
  });
