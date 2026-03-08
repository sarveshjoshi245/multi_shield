import {build} from 'vite';

try {
    await build({logLevel: 'error'});
    console.log('BUILD OK');
} catch(e) {
    const fs = await import('fs');
    fs.writeFileSync('build_error.txt', JSON.stringify({
        message: e.message,
        frame: e.frame || '',
        loc: e.loc || {},
        id: e.id || '',
        code: e.code || '',
        plugin: e.pluginCode || '',
        stack: (e.stack || '').slice(0, 500),
    }, null, 2), 'utf8');
    console.log('Error written to build_error.txt');
}
