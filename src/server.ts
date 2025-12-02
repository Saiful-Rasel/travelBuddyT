import type { Server } from "http";
import app from "./app";
import config from "./app/config";










const StartServer = () => {
  let server: Server;
  try {
    server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on http://localhost:${config.port}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          console.log("Server closed gracefully.");
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    process.on("SIGINT", exitHandler);
    process.on("SIGTERM", exitHandler);

    process.on("unhandledRejection", (error) => {
      console.log(
        "Unhandled Rejection is detected, we are closing our server..."
      );
      if (server) {
        server.close(() => {
          console.log(error);
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });

    process.on("uncaughtException", (error) => {
      console.log("Uncaught Exception detected, shutting down...");
      console.error(error);

      process.exit(1);
    });
  } catch (error) {
    console.error("Error during server startup:", error);
    process.exit(1);
  }
};

StartServer();
