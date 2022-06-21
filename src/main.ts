import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { PrismaClientExceptionFilter } from "./prisma-client-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // binds ValidationPipe to the entire application.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  // apply transform to all changes
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  //Swagger config
  const config = new DocumentBuilder()
    .setTitle("Rest Api with NestJS & Prisma")
    .setDescription("Building a REST API with NestJS and Prisma")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, { customSiteTitle: "Prisma Day" });

  await app.listen(8080);
}
bootstrap();
