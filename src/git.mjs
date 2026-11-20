/**********************************
// scripts for doing git operations
***********************************/

import { execFileSync } from 'node:child_process';

/** last part of origin URL without extension ".git" */
export function repoName() {
    const origin = execFileSync('git', ['remote', 'get-url', 'origin'], {
        encoding: 'utf8',
    }).trim();
    return origin.split('/').pop().replace(/\.git$/, '');
}
