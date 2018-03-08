using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace SIMSDataService.Models
{
    public class UserSecurityModels
    {
        [JsonProperty("user_id")]
        public int UserId { get; set; }
   
        [JsonProperty("login_id")]
        public string LoginId { get; set; }

        [JsonProperty("first_name")]
        public string FirstName { get; set; }

        [JsonProperty("last_name")]
        public string LastName { get; set; }

        public string pwd { get; set; }
        [JsonProperty("role")]
        public string Role { get; set; }


    }
}