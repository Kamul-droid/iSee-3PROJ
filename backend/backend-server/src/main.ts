import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);
  // Set the maximum request size limit to 50MB
  app.use(bodyParser.json({ limit: '5000mb' }));
  app.use(bodyParser.urlencoded({ limit: '5000mb', extended: true }));

  await app.listen(3000);
}

function setupSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('isee')
    .setDescription('API documentation for the isee project.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    );

  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('docs', app, document);
}

bootstrap();
