import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(
  //   session({
  //     secret: 'keyword',
  //     resave: false,
  //     saveUninitialized: false,
  //   }),
  // );

  app.enableCors({
    credentials: true,
    origin: [
      'http://127.0.0.1:5500',
      'http://127.0.0.1:3000',
      'https://shop-client-ijcw.onrender.com',
      'https://allnews.kz',
      'https://024.by',
    ],
  });
  await app.listen(3052);
}
bootstrap();
