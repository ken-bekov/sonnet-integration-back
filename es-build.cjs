const esBuild = require('esbuild');

(async () => {
    await esBuild.build({
        entryPoints: ['./src/index.ts'],
        outfile: './dist/ai-integration-backend.js',
        bundle: true,
        platform: 'node',
        target: 'node22',
        format: 'esm',
        external: ['better-sqlite3', 'sqlite3', 'pg', 'oracledb', 'mysql', 'tedious', 'pg-query-stream'],
        packages: 'external',
        minify: true,
    });
})();
