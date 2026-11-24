#!/usr/bin/env node

import {apiVersion, bootstrap, installSpec, renovateApi} from './src/swagger-tracker.mjs';

const [command, ...args] = process.argv.slice(2);

function argument() {
    if (args[0])
        return args[0];
    throw new Error('Missing argument, aborting');
};

const helpText = `

From empty project: start with "node ./swag.mjs track https://api.swaggerhub.com/apis/skatteetaten/inntekt-api"
then edit api-tracker.json as appropriate

Usage: "node ./swag.mjs <command> <argument>"
Commands:
  bootstrap <url>   Emits api-tracker.json with url to API registry, needed by other scripts 
  track <url>       = bootstrap

  renovate          Update desired version of OpenAPI specification
  update            = renovate

  install           Download desired version of OpenAPI specification

  api-version       Emits version of API (downloaded)

  help              Show this help message
`;

switch (command) {
    case 'track':
    case 'bootstrap':
        const apiRegistryUrl = argument()
        const bootstrapped = await bootstrap(apiRegistryUrl);  // workingDir);
        if (! bootstrapped) process.exitCode = 1;
        break;

    case 'update':
    case 'renovate':
        await renovateApi();  // workingDir);
        await installSpec();  // workingDir);
        break;

    case 'install':
        await installSpec();  // workingDir);
        break;

    case 'api-version':
        console.log(apiVersion());
        break;

    case 'help':
        console.log(helpText);
        break;
    default:
        throw new Error(`Unknown command: ${command}`);
}
