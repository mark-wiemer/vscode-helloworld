import * as path from 'path';

import { runTests } from '@vscode/test-electron';

async function main() {
    try {
        /**
         * The folder containing the Extension Manifest package.json
         * Passed to `--extensionDevelopmentPath`
         */
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        /** Shorthand for `runTests({ extensionTestsPath: p, ... })` */
        const quickRun = async (p: string) =>
            await runTests({
                extensionDevelopmentPath,
                extensionTestsPath: p,
            });

        /** The path to test runners. Passed to --extensionTestsPath */
        const extensionTestsPath = path.resolve(__dirname, './suite/index');

        // Download VS Code, unzip it and run the integration test
        await quickRun(extensionTestsPath);

        // Each run in `activation` folder needs to be isolated to test activation events
        const activationPaths = ['hello', 'time'];
        const fullPaths = activationPaths.map((p) =>
            path.resolve(__dirname, 'activation', p, 'index'),
        );

        // For each doesn't work, I promise :(
        // Have to explicitly run individually so that we `await` until the Code instance is closed
        await quickRun(fullPaths[0]);
        await quickRun(fullPaths[1]);
    } catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}

main();
