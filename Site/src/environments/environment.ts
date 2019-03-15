// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// export const baseUrl = 'http://spserver:8888';
export const baseUrl = 'http://localhost:56543';
export const environmentName = 'Prod';
export const version = '2.26';
export const connectionTimeout = 100000;
export const environment = {
  production: false,
  authEndpoint: baseUrl + '/api/Security',
  odataEndpoint: baseUrl + '/odata/',
  reportingEndpoint: baseUrl + '/odata/',
  artUploadURL: baseUrl + '/api/ArtFile',  // DO NOT USE Slash at end!
  docUploadURL: baseUrl + '/api/Document',
  defaultArtFolder: baseUrl + '/orderimage/',
  defaultDocFolder: baseUrl + '/',
  connectionTimeout: this.connectionTimeout

};
