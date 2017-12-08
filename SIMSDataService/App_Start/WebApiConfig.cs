using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.OData.Builder;
using System.Web.Http.OData.Extensions;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using SIMSEntities;

namespace SIMSDataService
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Web API configuration and services
            var cors = new EnableCorsAttribute(
                origins: "*",
                headers: "*",
                methods: "*");
            config.EnableCors(cors);
            // Configure Web API to use only bearer token authentication.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

           
            config.Routes.MapODataServiceRoute("odata", "odata", BuildODataModels());
        }

        private static Microsoft.Data.Edm.IEdmModel BuildODataModels()
        {
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<order>("orders");
            builder.EntitySet<customer>("customers");
            builder.EntitySet<customer_person>("CustomerPerson");
            builder.EntitySet<customer_address>("CustomerAddress");
            //builder.EntitySet<customer_person>("customer_persons");
            builder.EntitySet<correspondence>("correspondences");
            builder.EntitySet<order_detail>("OrderDetails");
            //builder.EntitySet<customer_address>("customer_address");
            builder.EntitySet<task>("Tasks");
            builder.EntitySet<lookup_items>("LookupItems");
            builder.EntitySet<user>("Users");
            return builder.GetEdmModel();
        }
    }
}
