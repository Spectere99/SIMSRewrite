// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// export const baseUrl = 'http://spserver:8888';
export const baseUrl = 'http://localhost:56543';
export const environmentName = 'Test';
export const version = '0.7';
export const environment = {
  production: false,
  // authEndpoint: 'http://localhost:56543/api/Security',
  // authEndpoint: 'http://localhost:8888/api/Security',
  authEndpoint: baseUrl + '/api/Security',

  // odataEndpoint: 'http://localhost:56543/odata/',
  // odataEndpoint: 'http://localhost:8888/odata/',
  odataEndpoint: baseUrl + '/odata/',

  // reportingEndpoint: 'http://localhost:56543/odata/',
  // reportingEndpoint: 'http://localhost:8888/odata/',
  reportingEndpoint: baseUrl + '/odata/',

  // artUploadURL: 'http://localhost:56543/api/ArtFile',
  // artUploadURL: 'http://localhost:8888/api/ArtFile',  // DO NOT USE Slash at end!
  artUploadURL: baseUrl + '/api/ArtFile',  // DO NOT USE Slash at end!

  // docUploadURL: 'http://localhost:56543/api/Document',
  // docUploadURL: 'http://localhost:8888/api/Document',
  docUploadURL: baseUrl + '/api/Document',

  // defaultArtFolder: 'http://localhost:8888/orderimage/',
  defaultArtFolder: baseUrl + '/orderimage/',

  // defaultDocFolder: 'http://localhost:8888/'
  defaultDocFolder: baseUrl + '/'

};
