"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaServers = exports.startMediaServer = void 0;
const node_media_server_1 = __importDefault(require("node-media-server"));
let mediaServers = {};
exports.mediaServers = mediaServers;
function startMediaServer(port) {
    const config = {
        rtmp: {
            port: port,
            chunk_size: 60000,
            gop_cache: true,
            ping: 30,
            ping_timeout: 60
        },
        http: {
            port: port + 1,
            allow_origin: '*',
            mediaroot: 'node_modules/@types/node-media-server/index.d.ts'
        }
    };
    const nms = new node_media_server_1.default(config);
    nms.run();
    console.log(`RTMP server started on port ${port}`);
    nms.on('error', (err) => {
        console.error(`RTMP server encountered an error: ${err}`);
    });
    mediaServers[port] = nms;
    return nms;
}
exports.startMediaServer = startMediaServer;
