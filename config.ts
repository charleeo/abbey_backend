import { AppModule } from "src/app.module";
import { ConfigService } from "src/modules/config/services/config.service";

const { NestFactory } = require('@nestjs/core');

async function myScript() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // Use configService as needed
  configService.create()
}

myScript();
