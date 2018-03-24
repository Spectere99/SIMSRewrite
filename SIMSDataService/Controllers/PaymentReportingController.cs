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
    using SIMSReporting;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<order_payments_rpt>("PaymentReporting");
    builder.EntitySet<order_rpt>("order_rpt"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class PaymentReportingController : ODataController
    {
        private ReportingEntities db = new ReportingEntities();

        // GET: odata/PaymentReporting
        [EnableQuery]
        public IQueryable<order_payments_rpt> GetPaymentReporting()
        {
            return db.order_payments_rpt;
        }

        // GET: odata/PaymentReporting(5)
        [EnableQuery]
        public SingleResult<order_payments_rpt> Getorder_payments_rpt([FromODataUri] int key)
        {
            return SingleResult.Create(db.order_payments_rpt.Where(order_payments_rpt => order_payments_rpt.order_payment_id == key));
        }

        // GET: odata/PaymentReporting(5)/order_rpt
        [EnableQuery]
        public SingleResult<order_rpt> Getorder_rpt([FromODataUri] int key)
        {
            return SingleResult.Create(db.order_payments_rpt.Where(m => m.order_payment_id == key).Select(m => m.order_rpt));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool order_payments_rptExists(int key)
        {
            return db.order_payments_rpt.Count(e => e.order_payment_id == key) > 0;
        }
    }
}
