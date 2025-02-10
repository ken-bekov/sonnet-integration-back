const esBuild = require('esbuild');

(async () => {
    await esBuild.build({
        entryPoints: ['./src/application.ts', './src/request-worker.ts'],
        outdir: './dist',
        bundle: true,
        platform: 'node',
        target: 'node22',
        format: 'cjs',
        external: ['better-sqlite3', 'sqlite3', 'pg', 'oracledb', 'mysql', 'tedious', 'pg-query-stream'],
        packages: 'external',
        minify: true,
    });
})();
