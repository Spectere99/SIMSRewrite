using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.OData.Builder;
using System.Web.Http.OData.Extensions;
using System.Web.Http.OData.Routing;
using System.Web.Http.OData.Routing.Conventions;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using SIMSEntities;
using SIMSReporting;

namespace SIMSDataService
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            log4net.Config.XmlConfigurator.Configure();

            // Web API configuration and services
            // Web API configuration and services
            var cors = new EnableCorsAttribute(
                "*",
                "*",
                "*",
                "DataSeviceVersion, MaxDataServiceVersion");
            config.EnableCors(cors);
            // Configure Web API to use only bearer token authentication.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
            config.Formatters.Insert(0, new TextMediaTypeFormatter());

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

           
            // config.Routes.MapODataServiceRoute("odata", "odata", BuildODataModels());

            //RWF - 6/5/2018
            var conventions = ODataRoutingConventions.CreateDefault();
            conventions.Insert(0, new CompositeKeyRoutingConvention());

            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();

            config.Routes.MapODataServiceRoute(
                routeName: "odata",
                routePrefix: "odata",
                model: BuildODataModels(),
                pathHandler: new DefaultODataPathHandler(),
                routingConventions: conventions);
        }

        private static Microsoft.Data.Edm.IEdmModel BuildODataModels()
        {
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<order>("orders");
            builder.EntitySet<customer>("customers");
            builder.EntitySet<customer_person>("CustomerPerson");
            builder.EntitySet<customer_address>("CustomerAddress");
            //builder.EntitySet<customer_person>("customer_persons");
            builder.EntitySet<order_detail>("OrderDetails");
            builder.EntitySet<order_art_placement>("OrderArtPlacement");
            builder.EntitySet<order_art_file>("OrderArtFile");
            builder.EntitySet<pricelist>("Pricelist");
            builder.EntitySet<order_fees>("OrderFees");
            builder.EntitySet<order_payments>("OrderPayments");
            builder.EntitySet<order_task>("OrderTask");
            //builder.EntitySet<customer_address>("customer_address");
            builder.EntitySet<task>("Tasks");
            builder.EntitySet<lookup_items>("LookupItems");
            builder.EntitySet<hotjas_group>("Roles");
            builder.EntitySet<user>("Users");
            builder.EntitySet<user_group>("UserGroup");
            builder.EntitySet<hotjas_group>("Group");
            builder.EntitySet<order_status_history>("OrderStatusHistory");
            builder.EntitySet<correspondence>("Correspondence");
            builder.EntitySet<order_notes>("OrderNotes");
            builder.EntitySet<vw_order_info>("OrderInfo");

            builder.EntitySet<order_rpt>("OrderReporting");
            builder.EntitySet<order_payments_rpt>("PaymentReporting");
            builder.EntitySet<customer_rpt>("CustomerReporting");
            builder.EntitySet<vw_order_payments>("OrderPaymentReporting");
            builder.EntitySet<vw_order_quantities>("OrderQuantitiesReporting");
            builder.EntitySet<vw_order_quantities_rollup>("OrderQuantitiesRollup");

            return builder.GetEdmModel();
        }
    }
}
