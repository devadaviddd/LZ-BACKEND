import { app } from "../app.js";

/**
 * @openapi
 * /app:
 *   get:
 *     description: Get Server Name.
 *     responses:
 *       200:
 *        description: Success.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                serverName:
 *                  type: string
 */
export const getServerName = async (req, res) => {
  const server = app.getServer();
  res.status(200).json({
    serverName: server.name,
  });
};
