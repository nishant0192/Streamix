import NodeMediaServer from 'node-media-server';

let mediaServers: { [key: string]: NodeMediaServer } = {};

function startMediaServer(port: number) {
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
    

    const nms = new NodeMediaServer(config);
    nms.run();

    console.log(`RTMP server started on port ${port}`);

    nms.on('error', (err: any) => {
        console.error(`RTMP server encountered an error: ${err}`);
    });

    mediaServers[port] = nms;

    return nms;
}

export { startMediaServer, mediaServers };
