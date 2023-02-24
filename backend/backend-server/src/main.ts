import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

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
