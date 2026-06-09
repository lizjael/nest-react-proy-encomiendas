import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // ✅ CRÍTICO: await en NestFactory.create
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  await app.listen(3000);
  console.log('Backend corriendo en http://localhost:3000');
}
bootstrap();
