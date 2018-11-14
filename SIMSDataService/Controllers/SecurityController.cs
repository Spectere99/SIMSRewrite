using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
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
        [HttpPost]
        public IHttpActionResult RequestToken(HttpRequestMessage request, [FromBody]string value)
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
                            // Need to grab the role (HotJas_Group) the person belongs to so we can return it to the client.
                            var groups = db.hotjas_group.ToList();
                            var userGroup = db.user_group.Where(p => p.user_id == userTry.UserId).ToList();
                            //  var foundGroup = groups.Where(p => userGroup != null && p.hotjas_group_id == userGroup.hotjas_group_id).ToList();
                            userTry.Role = new List<string>();
                            foreach (user_group ug in userGroup)
                            {
                                var foundGroup = groups.SingleOrDefault(p => p.hotjas_group_id == ug.hotjas_group_id);
                                userTry.Role.Add(foundGroup.name);
                            }
                            
                            // if (foundGroup.Count > 0) userTry.Role = foundGroup;
                            // Generate Token
                            //var claimList = new[]
                            //{
                            //    new Claim(ClaimTypes.Name, userTry.LoginId)
                            //};

                            //var keySecret = ConfigurationManager.AppSettings.Get("SecurityKey");
                            //var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keySecret));
                            //var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                            //var token = new JwtSecurityToken(
                            //    "sims",
                            //    "sims",
                            //    claimList,
                            //    DateTime.Now.AddHours(24),
                            //    signingCredentials: creds);

                            return Ok(new
                            {
                                profile = userTry
                                // token = new JwtSecurityTokenHandler().WriteToken(token)
                            });
          
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
