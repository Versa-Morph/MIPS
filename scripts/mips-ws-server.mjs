#!/usr/bin/env node
/**
 * MIPS Lightweight WebSocket Relay Server
 * Port: 8090
 * Usage: node scripts/mips-ws-server.mjs
 */

import { WebSocketServer, WebSocket } from 'ws';

const PORT = process.env.PORT || 8090;
const wss = new WebSocketServer({ port: PORT });

console.log(`[MIPS WS Server] Listening for Instructor & Cadet connections on port ${PORT}...`);

let clientCount = 0;

wss.on('connection', (ws, req) => {
  clientCount++;
  const clientIp = req.socket.remoteAddress;
  console.log(`[MIPS WS Server] Client connected from ${clientIp}. Total active: ${clientCount}`);

  ws.on('message', (data, isBinary) => {
    // Broadcast received message to all OTHER connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  ws.on('close', () => {
    clientCount--;
    console.log(`[MIPS WS Server] Client disconnected. Total active: ${clientCount}`);
  });

  ws.on('error', (err) => {
    console.error('[MIPS WS Server] Socket error:', err.message);
  });
});
