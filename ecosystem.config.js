/* eslint-disable @typescript-eslint/camelcase */
module.exports = {
    apps: [
        {
            name: 'Neptune',
            script: 'npm',
            args: 'run dev',
            watch: ['./src/**/*.ts', './config.ts', './devconfig.ts'],
            // Delay between restart
            watch_delay: 1000,
            ignore_watch: ['node_modules', 'out'],
            watch_options: {
                followSymlinks: false
            },
            env: {
                NODE_ENV: 'development'
            }
        }
    ]
};
