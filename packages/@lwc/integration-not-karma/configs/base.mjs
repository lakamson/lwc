import { join } from 'node:path';
import { LWC_VERSION } from '@lwc/shared';
import * as options from '../helpers/options.mjs';

const pluck = (obj, keys) => Object.fromEntries(keys.map((k) => [k, obj[k]]));
const maybeImport = (file, condition) => (condition ? `await import('${file}');` : '');

/** `process.env` to inject into test environment. */
const env = {
    ...pluck(options, [
        'API_VERSION',
        'DISABLE_NATIVE_CUSTOM_ELEMENT_LIFECYCLE',
        'DISABLE_STATIC_CONTENT_OPTIMIZATION',
        'DISABLE_SYNTHETIC',
        'ENABLE_ARIA_REFLECTION_GLOBAL_POLYFILL',
        'ENABLE_SYNTHETIC_SHADOW_IN_HYDRATION',
        'ENGINE_SERVER',
        'FORCE_NATIVE_SHADOW_MODE_FOR_TEST',
        'NATIVE_SHADOW',
    ]),
    LWC_VERSION,
    NODE_ENV: options.NODE_ENV_FOR_TEST,
};

/** @type {import("@web/test-runner").TestRunnerConfig} */
export default {
    nodeResolve: true,
    rootDir: join(import.meta.dirname, '..'),
    plugins: [
        {
            resolveImport({ source }) {
                if (source === 'test-utils') {
                    return '/helpers/utils.mjs';
                } else if (source === 'wire-service') {
                    // To serve files outside the web root (e.g. node_modules in the monorepo root),
                    // @web/dev-server provides this "magic" path. It's hacky of us to use it directly.
                    // `/__wds-outside-root__/${depth}/` === '../'.repeat(depth)
                    return '/__wds-outside-root__/1/wire-service/dist/index.js';
                }
            },
            async transform(ctx) {
                if (ctx.type === 'application/javascript') {
                    // FIXME: copy/paste Nolan's spiel about why we do this ugly thing
                    return ctx.body.replace(/process\.env\.NODE_ENV === 'test-karma-lwc'/g, 'true');
                }
            },
        },
    ],
    testRunnerHtml: (testFramework) =>
        `<!DOCTYPE html>
        <html>
          <head>
            <!-- scripts are included in the head so that the body can be fully reset between tests -->
            <script type="module">
            globalThis.process = ${JSON.stringify({ env })};
            globalThis.lwcRuntimeFlags = ${JSON.stringify(
                pluck(options, ['DISABLE_NATIVE_CUSTOM_ELEMENT_LIFECYCLE'])
            )};

            ${maybeImport('@lwc/synthetic-shadow', !options.DISABLE_SYNTHETIC)}
            ${maybeImport('@lwc/aria-reflection', options.ENABLE_ARIA_REFLECTION_GLOBAL_POLYFILL)}
            </script>
            <script type="module" src="./helpers/setup.mjs"></script>
            <script type="module" src="${testFramework}"></script>
          </head>
        </html>`,
};
