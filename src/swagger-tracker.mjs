/************************************************
// process API properties in api-tracker.json
*************************************************/

import {repoName} from "./git.mjs";
import {fetchJson, fetchYaml, readJsonFile, writeJsonFile, writeFile} from "./resourceIO.mjs";
import {apiVersions} from "./swaggerhub.mjs";

const metaFile = 'api-tracker.json';

function bootstrapJson(apiRegistryUrl) {
    const downloadName = repoName()
    return {
        _README_: [
            "*************************************************************************",
            "Bootstrap example configuration should be edited to match API and project",
            "*************************************************************************"
        ],
        registry: `${apiRegistryUrl}`,
        desiredVersion: "0.0.0",
        localJson: `${downloadName}.json`,
        localYaml: `${downloadName}.yaml`,
    };
}

function apiTracker() {
    const apiArtifact = readJsonFile(metaFile);
    if (!apiArtifact.registry) {
        throw new Error(`Missing registry in ${metaFile}`);
    }
    if (!apiArtifact.desiredVersion) {
        throw new Error(`Missing desiredVersion in ${metaFile}`);
    }
    if (!apiArtifact.localJson) {
        throw new Error(`Missing localJson in ${metaFile}`);
    }
    return apiArtifact;
}

export function apiVersion() {
    try {
        const localJson = apiTracker().localJson;
        return readJsonFile(localJson).info?.version;
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
        return null;
    }
}

/** If api-tracker.json does not exist, create it with bootstrap content */
export async function bootstrap(apiRegistryUrl) {
    try {
        // TODO: can update with new url and reset version
        apiTracker();
        console.error(`${metaFile} exists, not overwritten.`);
        return false;
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }

    writeJsonFile(metaFile, bootstrapJson(apiRegistryUrl));
    console.log(`${metaFile} generated with bootstrap content. Please edit to match your API and project.`);

    await renovateApi();  // workingDir);
    await installSpec();  // workingDir);
    return true;
}


/** Download specification for desired version, yaml and json format */
export async function installSpec() {
    const apiProperties = apiTracker()
    const actualVersion = apiVersion();
    const desiredVersion = apiProperties.desiredVersion;
    if ( actualVersion === desiredVersion ) {
        console.log(`API spec not updated. Current version: ${actualVersion}, Desired version: ${desiredVersion}`);
        return;
    } else {
        console.log(`Updating API spec to version ${desiredVersion}`);
    }

    const versions = await apiVersions(apiProperties.registry);
    const apiUrl = versions.url(apiProperties.desiredVersion);


    const localFiles = apiTracker();
    const yamlUrl = apiUrl + "/swagger.yaml";
    writeFile(localFiles.localYaml, await fetchYaml(yamlUrl));
    console.log(`${yamlUrl} downloaded to ${localFiles.localYaml}`);

    // json file is parsed for currently downloaded version, so we download it after yaml to avoid inconsistent versions
    writeJsonFile(localFiles.localJson, await fetchJson(apiUrl));
    console.log(`${apiUrl} downloaded to ${localFiles.localJson}`);
}

/** Updates desired version in api-tracker.json */
export async function renovateApi() {
    const apiProperties = apiTracker();
    const versions = await apiVersions(apiProperties.registry);
    if (apiProperties.desiredVersion === versions.latest) {
        console.log(`${metaFile} not updated, desiredVersion ${apiProperties.desiredVersion} is latest found on ${apiProperties.registry}`);
    } else {
        // til vi har landa på løsning for versjonering, oppdateres begge mulighetene
        const nextApiRegistry = {
            ...apiProperties,
            desiredVersion: versions.latest
        };
        writeJsonFile(metaFile, nextApiRegistry);
        console.log(`${metaFile} updated with desiredVersion: ${versions.latest}`);
    }

}
