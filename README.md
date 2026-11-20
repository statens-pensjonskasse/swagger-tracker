swagger-tracker
===============

Renovate preset `renovate-swaggerhub.json` and node cli to track an Open API specification on Swaggerhub.

How to use / getting started
----------------------------
### Node scripts
Scripts may be run on ci or locally on developer PC with appropriate Node installation, like so:
* `node swagger-tracker-cli.mjs help`
* `npx @statens-pensjonskasse/swagger-tracker help`

Get started by generating bootstrap setup: `node ./swagger-tracker-cli.mjs bootstrap`, then edit generated file as appropriate.  
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
Develop using node scripts primarily: `node ./swagger-tracker-cli.mjs help`  
Open Pull requests for changes.  

**BEWARE**: version in package.json may be tampered when running the cli, and workflow may not update after release+publish

