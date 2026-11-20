#!/usr/bin/env node

import { bootstrap, renovateApi, updateSpec } from './src/swagger-tracker.mjs';

const [command, ...args] = process.argv.slice(2);

const helpText = `

From empty project: start with "node ./swagger-tracker-cli.mjs bootstrap"
then edit api-tracker.json as appropriate

Usage: "node ./swagger-tracker-cli.mjs <command>"
Commands:
  bootstrap     Emits api-tracker.json, needed for further work 
  renovate-api  Update the OpenAPI specification for the desired version
  update-api    Download the OpenAPI specification for the desired version, update package.json to that version
  help          Show this help message
`;

switch (command) {
    case 'bootstrap':
        await bootstrap();  // workingDir);
        break;
    case 'renovate-api':
        await renovateApi();  // workingDir);
        break;
    case 'update-api':
        await updateSpec();  // workingDir);
        break;
    case 'help':
        console.log(helpText);
        break;
    default:
        throw new Error(`Unknown command: ${command}`);
}
