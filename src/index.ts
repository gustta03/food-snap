import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { errorHandler } from "./presentation/middlewares/error-handler.middleware";
import { MongoDBConnection } from "./infrastructure/database/mongodb.connection";
import { registerRoutes } from "./presentation/routes";
import { WhatsAppService } from "./infrastructure/whatsapp/whatsapp.service";

async function startServer() {
  try {
    const mongoConnection = MongoDBConnection.getInstance();
    try {
      await mongoConnection.connect();
    } catch (error) {
      console.warn("MongoDB connection failed, continuing without database:", error);
    }

    const whatsappService = new WhatsAppService();
    await whatsappService.start();

    const app = new Elysia()
      .use(swagger({
        documentation: {
          info: {
            title: "Bot Nutri API",
            version: "1.0.0",
            description: "API de nutrição usando Bun + Elysia com Clean Architecture",
          },
          tags: [
            { name: "foods", description: "Operações relacionadas a alimentos" },
          ],
        },
      }))
      .use(errorHandler)
      .get("/", () => ({
        message: "Bot Nutri API",
        version: "1.0.0",
        docs: "/swagger",
      }))
      .get("/health", () => ({
        status: "ok",
        timestamp: new Date().toISOString(),
      }))
      .use(registerRoutes(new Elysia()))
      .listen(3000);

    console.log(
      `Server is running at http://${app.server?.hostname}:${app.server?.port}`
    );
    console.log(
      `Swagger docs available at http://${app.server?.hostname}:${app.server?.port}/swagger`
    );

    process.on("SIGINT", async () => {
      console.log("\nShutting down gracefully...");
      await whatsappService.stop();
      await mongoConnection.disconnect();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("\nShutting down gracefully...");
      await whatsappService.stop();
      await mongoConnection.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

