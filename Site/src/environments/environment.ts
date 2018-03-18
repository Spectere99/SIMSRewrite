// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // authEndpoint: 'http://localhost:56543/api/Security',
  authEndpoint: 'http://localhost:8888/api/Security',
  odataEndpoint: 'http://localhost:8888/odata/',
  reportingEndpoint: 'http://localhost:56543/odata/',
  // odataEndpoint: 'http://localhost:56543/odata/',
  artUploadURL: 'http://localhost:8888/api/ArtFile',  // DO NOT USE Slash at end!
  // artUploadURL: 'http://localhost:56543/api/ArtFile',
  defaultArtFolder: 'http://localhost:8888/orderimage/'

};
