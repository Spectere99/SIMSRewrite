using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.UI;
using Intuit.Ipp.OAuth2PlatformClient;

namespace SIMSDataService.Controllers
{
    public class QBIntegrationController : ApiController
    {
        

        private static OAuth2Client auth2Client = new OAuth2Client(ConfigurationManager.AppSettings["clientid"], ConfigurationManager.AppSettings["clientsecret"],
            ConfigurationManager.AppSettings["redirectUrl"], ConfigurationManager.AppSettings["appEnvironment"]);
        private static string authCode;
        private static string idToken;
        private static string accessToken;
        private static string refreshToken;
        
        public IHttpActionResult Post()
        {
            //var clientId = ConfigurationManager.AppSettings["clientid"];
            //var clientSecret = ConfigurationManager.AppSettings["clientsecret"];
            //var redirectUrl = ConfigurationManager.AppSettings["redirectUrl"];
            //var environment = ConfigurationManager.AppSettings["appEnvironment"];

            //OAuth2Client auth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl, environment);

            List<OidcScopes> scopes = new List<OidcScopes> {OidcScopes.OpenId, OidcScopes.Email};

            string authorizeUrl = auth2Client.GetAuthorizationURL(scopes);

            return Ok("https://appcenter.intuit.com/connect/oauth2" + authorizeUrl);
        }

        public async Task<IHttpActionResult> Get()
        {
            
            Console.WriteLine("Here");
            var allUrlKeyValues = ControllerContext.Request.GetQueryNameValuePairs();
            if (allUrlKeyValues.Any())
            {
                var state = allUrlKeyValues.LastOrDefault(x => x.Key == "state").Value;
                var code = allUrlKeyValues.LastOrDefault(x => x.Key == "code").Value;
                var realmId = allUrlKeyValues.LastOrDefault(x => x.Key == "realmid").Value;
                if (state != null)
                {
                    if (auth2Client.CSRFToken == state)
                    {
                        //if (response.RealmId != null)
                        //{
                        //    if (!dictionary.ContainsKey("realmId"))
                        //    {
                        //        dictionary.Add("realmId", response.RealmId);
                        //    }
                        //}

                        if (code != null)
                        {
                            authCode = code;
                            var tokenResp = await auth2Client.GetBearerTokenAsync(authCode);
                            accessToken = tokenResp.AccessToken;
                            refreshToken = tokenResp.RefreshToken;
                            idToken = tokenResp.IdentityToken;

                        }
                    }
                    else
                    {
              
                    }
                }
            }
            return Ok();
        }
    }
}
