import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig( {
    build: {
        sourcemap      : 'inline',
        rolldownOptions: {
            output: {
                entryFileNames: 'index.min.js',
            },
        },
    },
    // This is necessary to get the dev server working in the dev container.
    //
    // Source:
    //   "running a vite dev server inside a docker container"
    //   https://stackoverflow.com/questions/70012970/running-a-vite-dev-server-inside-a-docker-container
    //
    // Probably we could set the `host` to whatever exact IP address works inside
    // the container, but setting it to `true` to listen to all addresses will
    // be more robust.
    server: {
        host: true,
        port: 5173,
    },
} );
