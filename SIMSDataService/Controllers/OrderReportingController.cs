using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using SIMSReporting;

namespace SIMSDataService.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using SIMSEntities;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<order>("OrderReporting");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class OrderReportingController : ODataController
    {
        private ReportingEntities db = new ReportingEntities();

        // GET: odata/OrderReporting
        [EnableQuery]
        public IQueryable<order_rpt> GetOrderReporting()
        {
            return db.order_rpt;
        }

        // GET: odata/OrderReporting(5)
        [EnableQuery]
        public SingleResult<order_rpt> Getorder([FromODataUri] int key)
        {
            return SingleResult.Create(db.order_rpt.Where(order => order.order_id == key));
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool orderExists(int key)
        {
            return db.order_rpt.Count(e => e.order_id == key) > 0;
        }
    }
}
