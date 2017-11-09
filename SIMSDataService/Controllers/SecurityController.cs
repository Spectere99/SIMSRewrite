using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SIMSEntities;
using SIMSDataService.Models;


namespace SIMSDataService.Controllers
{
    public class SecurityController : ApiController
    {
        private simsEntities db = new simsEntities();

        // GET: api/Security
        public IHttpActionResult Get(HttpRequestMessage request)
        {
            var headers = request.Headers;
            //Check the request object to see if they passed a userId
            if (headers.Contains("userid"))
            {
                var user = headers.GetValues("userid").First();
                if (headers.Contains("password"))
                {
                    var passwordTry = headers.GetValues("password").First();

                    try
                    {
                        var userAccount = db.users.Where(p => p.login_id == user);

                        var userTry = userAccount.Select(usr => new UserSecurityModels
                        {
                            FirstName = usr.first_name,
                            LastName = usr.last_name,
                            LoginId = usr.login_id,
                            UserId = usr.user_id,
                            pwd = usr.password
                        }).FirstOrDefault();

                        if (SecurityHelper.Base64Encode(passwordTry) == userTry.pwd) //  Success!
                        {
                            userTry.pwd = null;
                            return Ok(userTry);
                        }
                        return Unauthorized();
                    }
                    catch (Exception e)
                    {
                        //_log.Error("An error occurred while adding Users.", e);
                        return InternalServerError(e);
                    }
                }
                
            }
            return BadRequest("Header values not found.");
        }

        // GET: api/Security/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Security
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Security/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Security/5
        public void Delete(int id)
        {
        }
    }
}
