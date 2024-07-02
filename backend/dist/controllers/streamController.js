"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopStream = exports.startStream = void 0;
const rtmpServer_1 = require("../rtmpServer");
function generateRandomPort(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}
function startStream(req, res) {
    const port = generateRandomPort(1935, 65535);
    const mediaServer = rtmpServer_1.startMediaServer(port);
    res.json(port);
}
exports.startStream = startStream;
function stopStream(req, res) {
    const { port } = req.body;
    if (!port) {
        return res.status(400).json({ error: 'Port number is required' });
    }
    console.log(`Trying to stop RTMP server on port ${port}`);
    const server = rtmpServer_1.mediaServers[port];
    if (server) {
        server.stop();
        delete rtmpServer_1.mediaServers[port];
        return res.json({ message: `RTMP server on port ${port} stopped` });
    }
    else {
        return res.status(404).json({ error: `RTMP server on port ${port} not found or already stopped` });
    }
}
exports.stopStream = stopStream;
