import express from "express";
import { startMediaServer, mediaServers } from "../rtmpServer"


function generateRandomPort(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max - min + 1));
}

function startStream(req: express.Request, res: express.Response) {
    const port = generateRandomPort(1935, 65535);
    const mediaServer = startMediaServer(port);
    res.json(port);
}

function stopStream(req: express.Request, res: express.Response) {
    const { port } = req.body;
    if (!port) {
        return res.status(400).json({ error: 'Port number is required' });
    }

    console.log(`Trying to stop RTMP server on port ${port}`);

    const server = mediaServers[port];
    if (server) {
        server.stop();
        delete mediaServers[port];
        return res.json({ message: `RTMP server on port ${port} stopped` });
    } else {
        return res.status(404).json({ error: `RTMP server on port ${port} not found or already stopped` });
    }
}

export { startStream, stopStream };
