swagger-tracker
===============

Track an Open API specification on Swaggerhub using:  
*   renovate presets to track versions on swaggerhub - updates desired API version 
*   clis to track versions and install (download) newer specification
*   reusable workflows run install with commit and push

How to use / getting started
----------------------------
Make or Node scripts - your choice.

### Make
Copy Makefile and make.properties into you repo, edit as appropriate.  
Locally (*nix, MacOS): Run `make help` and figure it out.  
CI (github): call to reusable workflow make-install-api.yml with permissions `contents: write`  
Renovate: extend renovate-makefile.json

### Node
Install (dev dependency) statens-pensjonskasse/swagger-tracker.  
Locally (*nix, MacOS): Run `node swag.mjs help` and figure it out (hint: bootstrap).  
CI (github): call to reusable workflow install-api.yml with permissions `contents: write` and `packages: read`  
For Mend renovate: extend renovate-swag.json

Example of use in [skatt-inntekt-api](https://github.com/statens-pensjonskasse/skatt-inntekt-api)

**Note**: artifact published to github packages under organization "statens-pensjonskasse" may not be available outside of SPK.  
...so until we have fixed that, fork the repo and use the code.

License, contact, support
-------------------------
[MIT](LICENSE).  
Repo owned and maintained by SPK Team "integrasjon-og-samhandling".  
Errors, problems and wishes may be reported as [issue on GitHub](https://github.com/statens-pensjonskasse/swagger-tracker/issues).

Development
-----------
Open Pull requests for changes.  
**BEWARE** use conventional commits if you want to step up and publish new versions:  
*   trigger minor bump: "feat:" or "feat(scope)"
*   trigger major bump: "feat!:", "fix!:", "refactor(scope)!:" or "BREAKING CHANGE".

**BEWARE**: version in package.json may be tampered when running the cli, and workflow may not update after release+publish
