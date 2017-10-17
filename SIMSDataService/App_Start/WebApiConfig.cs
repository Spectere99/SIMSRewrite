using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
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

            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<order>("orders");
            builder.EntitySet<customer>("Customers");
            builder.EntitySet<customer_person>("customer_persons");
            builder.EntitySet<correspondence>("correspondences");
            builder.EntitySet<order_detail>("order_details");
            builder.EntitySet<customer_address>("customer_address");
        config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
        }
    }
}
