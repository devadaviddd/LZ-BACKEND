import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { API } from '../router/router.js';
import { database } from '../di/index.js';

export class Application {
  #server;
  constructor() {
    this.#server = express();
    this.#server.set('host', 'localhost');
    this.#server.set('port', 8000);
    this.#server.use(bodyParser.json());
    this.#server.use(bodyParser.urlencoded({ extended: true }));
    this.#server.use(cors());
    this.#server.use(API);
  }
  
  startServer() {
    const host = this.#server.get('host');
    const port = this.#server.get('port');
    this.#server.listen(port, host, () => {
      console.log(`Server started at http://${host}:${port}`);
    });
    database.connect();
  }

  getServer() {
    return this.#server;
  }
}