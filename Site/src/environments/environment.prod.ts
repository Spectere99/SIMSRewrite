export const baseUrl = 'http://spserver:8888';
export const environmentName = 'Prod';
export const version = '2.35';
export const connectionTimeout = 100000;
export const environment = {
  production: true,
  baseUrl: 'http://spserver:8888',
  authEndpoint: this.baseUrl + '/api/Security',
  integrationEndpoint: baseUrl + '/api/QBIntegration',
  odataEndpoint: this.baseUrl + '/odata',
  reportingEndpoint: this.baseUrl + '/odata/',
  artUploadURL: this.baseUrl + '/api/ArtFile',
  docUploadURL: this.baseUrl + '/api/Document',
  defaultArtFolder: this.baseUrl + '/orderimage/',
  defaultDocFolder: this.baseUrl + '/pdf/',
  connectionTimeout: this.connectionTimeout
};
