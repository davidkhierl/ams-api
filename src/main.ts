import { BadUserInputException } from '@/common/exceptions/bad-user-input.exception';
import { PrismaClientExceptionFilter } from '@/prisma/prisma-client-exception.filter';
import { PrismaService } from '@/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  /* -------------------------------------------------------------------------- */
  /*                                    nest                                    */
  /* -------------------------------------------------------------------------- */
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  const configService = app.get(ConfigService);
  const port = configService.get<number | undefined>('PORT') ?? 3000;

  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (validationErrors) => {
        return new BadUserInputException(validationErrors);
      },
    }),
  );

  /* -------------------------------------------------------------------------- */
  /*                                   prisma                                   */
  /* -------------------------------------------------------------------------- */
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  /* -------------------------------------------------------------------------- */
  /*                                   swagger                                  */
  /* -------------------------------------------------------------------------- */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('AMS API')
    .setDescription('Appointment Management System API')
    .setVersion('1.0')
    .addTag('Default')
    .addTag('Auth')
    .addTag('Users')
    .addTag('Appointments')
    .addBearerAuth()
    .addServer('http://localhost:{port}', 'Appointment Management System API', {
      protocol: {
        enum: ['http', 'https'],
        default: 'http',
      },
      port: {
        enum: [port],
        default: port,
      },
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  /* -------------------------------------------------------------------------- */
  /*                                   express                                  */
  /* -------------------------------------------------------------------------- */

  app.enableCors();

  await app.listen(port ?? 3000);
}

bootstrap();
