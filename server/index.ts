import express from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {
  await registerRoutes(app);

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  }
})();

export default app;
