/************************************************
// process API properties in swagger-tracker.json
*************************************************/

import {repoName} from "./git.mjs";
import {updatePackageVersion} from "./package.mjs";
import {fetchJson, fetchYaml, readJsonFile, writeJsonFile, writeFile} from "./resourceIO.mjs";
import {apiVersions} from "./swaggerhub.mjs";

function bootstrapJson() {
    const downloadName = repoName()
    return {
        _README_: [
            "*************************************************************************",
            "Bootstrap example configuration should be edited to match API and project",
            "*************************************************************************"
        ],
        registry: "https://api.swaggerhub.com/apis/skatteetaten/inntekt-api",
        desiredVersion: "1.6.2",
        localJson: `${downloadName}.json`,
        localYaml: `${downloadName}.yaml`,
    };
}


/** If swagger-tracker.json does not exist, create it with bootstrap content */
function establishApiProperties() {
    try {
        return swaggerTracker();
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
        writeJsonFile('swagger-tracker.json', bootstrapJson());
        console.log(`swagger-tracker.json generated with bootstrap content. Please edit to match your API and project.`);
        return establishApiProperties()
    }
}

function swaggerTracker() {
    const apiArtifact = readJsonFile('swagger-tracker.json');
    if (!apiArtifact.registry) {
        throw new Error(`Missing registry in swagger-tracker.json`);
    }
    if (!apiArtifact.desiredVersion) {
        throw new Error(`Missing desiredVersion in swagger-tracker.json`);
    }
    if (!apiArtifact.localJson) {
        throw new Error(`Missing localJson in swagger-tracker.json`);
    }
    return apiArtifact;
}

function downloadedVersion() {
    try {
        const localJson = swaggerTracker().localJson;
        return readJsonFile(localJson).info?.version;
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
        return null;
    }
}

export async function bootstrap() {
    const apiProperties = establishApiProperties();
    await renovateApi();  // workingDir);
    await updateSpec();  // workingDir);
}


/** Download specification for desired version, yaml and json format */
export async function updateSpec() {
    const apiProperties = establishApiProperties()
    const actualVersion = downloadedVersion();
    const desiredVersion = apiProperties.desiredVersion;
    if ( actualVersion === desiredVersion ) {
        console.log(`API spec not updated. Current version: ${actualVersion}, Desired version: ${desiredVersion}`);
        return;
    } else {
        console.log(`Updating API spec to version ${desiredVersion}`);
    }

    const versions = await apiVersions(apiProperties.registry);
    const apiUrl = versions.url(apiProperties.desiredVersion);


    const localFiles = swaggerTracker();
    const yamlUrl = apiUrl + "/swagger.yaml";
    writeFile(localFiles.localYaml, await fetchYaml(yamlUrl));
    console.log(`${yamlUrl} downloaded to ${localFiles.localYaml}`);

    // json file is parsed for currently downloaded version, so we download it after yaml to avoid inconsistent versions
    writeJsonFile(localFiles.localJson, await fetchJson(apiUrl));
    console.log(`${apiUrl} downloaded to ${localFiles.localJson}`);

    updatePackageVersion(apiProperties.desiredVersion);
}

/** Updates package.json version */
export async function renovateApi() {
    const apiProperties = establishApiProperties();
    const versions = await apiVersions(apiProperties.registry);
    if (apiProperties.desiredVersion === versions.latest) {
        console.log(`swagger-tracker.json not updated, desiredVersion ${apiProperties.desiredVersion} is latest found on ${apiProperties.registry}`);
    } else {
        // til vi har landa på løsning for versjonering, oppdateres begge mulighetene
        const nextApiRegistry = {
            ...apiProperties,
            desiredVersion: versions.latest
        };
        writeJsonFile('swagger-tracker.json', nextApiRegistry);
        console.log(`swagger-tracker.json updated with desiredVersion: ${versions.latest}`);
    }

}
