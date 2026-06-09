import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const corsOrigin =
  //   process.env.CORS_ORIGIN ?? 'https://react-proy-encomiendas.onrender.com';
  // console.log('CORS ORIGIN:', corsOrigin);

  // app.enableCors({
  //   origin: corsOrigin,
  //   methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   credentials: true,
  // });
  app.enableCors({
    origin: 'https://react-proy-encomiendas.onrender.com',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
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

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Backend corriendo en puerto ${process.env.PORT ?? 3000}`);
}
bootstrap();
