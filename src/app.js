import "dotenv/config";
import { Application } from "./models/App.js";

export const app = new Application();
app.startServer();
