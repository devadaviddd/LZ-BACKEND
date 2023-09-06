import "dotenv/config";

import { database } from "./di/index.js";
import { Application } from "./models/app.js";

export const app = new Application();
app.startServer(database);
