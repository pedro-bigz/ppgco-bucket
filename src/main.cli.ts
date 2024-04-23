import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
import { configHelper } from 'src/core';

async function bootstrap() {
  if (!configHelper.isProduction()) {
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
