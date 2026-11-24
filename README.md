swagger-tracker
===============

Track an Open API specification on Swaggerhub using:  
*   renovate preset `renovate-swag.json` to track versions on swaggerhub - updates desired API version 
*   cli to track versions and install (download) newer specification
*   reusable workflow to trigger install with commit and push

How to use / getting started
----------------------------
### Node scripts
Scripts may be run on ci or locally on developer PC with appropriate Node installation, like so:
* `node swag.mjs help`
* TODO: `npx @statens-pensjonskasse/swagger-tracker help`

Get started by generating bootstrap setup: `node ./swag.mjs bootstrap`, then edit generated file as appropriate.  
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
Develop using node scripts primarily: `node ./swag.mjs help`  
Open Pull requests for changes.  
**BEWARE** use conventional commits if you want to step up and publish new versions:  
*   trigger minor bump: "feat:" or "feat(scope)"
*   trigger major bump: "feat!:", "fix!:", "refactor(scope)!:" or "BREAKING CHANGE".

**BEWARE**: version in package.json may be tampered when running the cli, and workflow may not update after release+publish
