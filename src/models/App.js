import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Database } from '../data/database.js';
import { API } from '../router/router.js';

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
    Database.connect();
  }

  getServer() {
    return this.#server;
  }
}