const esbuild = require('esbuild');
const child_processes = require('child_process');

(async () => {
    const context = await esbuild.context({
        entryPoints: ['./src/index.ts'],
        outfile: './dist/ai-integration-backend.js',
        bundle: true,
        platform: 'node',
        target: 'node22',
        sourcemap: 'inline',
        external: ['knex'],
        format: 'cjs',
        plugins: [
            {
                name: 'rebuildPlugin',
                setup: (build) => {
                    build.onEnd(result => {
                        if (result.errors.length > 0) {
                            result.errors.forEach(error => {
                                console.error(error.text);
                            })
                        } else if (result.warnings.length > 0) {
                            result.warnings.forEach(warning => {
                                console.warn(warning.text);
                            })
                        } else {
                            console.debug('Successfully rebuilt')
                        }
                    });
                }
            }
        ]
    });
    await context.watch();
    child_processes
        .spawn(
            'node',
            ['--watch', '--enable-source-maps', '--inspect=7070', './dist/ai-integration-backend.js'],
            {
                env: {
                    APP_PORT: 9090,
                    IDM_DB_USER: process.env.IDM_DB_USER,
                    IDM_DB_PASSWORD: process.env.IDM_DB_PASSWORD,
                    IDM_SONNET_API_KEY: process.env.IDM_SONNET_API_KEY,
                },
                stdio: 'inherit'
            }
        );
})();
