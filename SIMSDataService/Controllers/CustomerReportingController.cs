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
    builder.EntitySet<customer_rpt>("CustomerReporting");
    builder.EntitySet<order_rpt>("order_rpt"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class CustomerReportingController : ODataController
    {
        private ReportingEntities db = new ReportingEntities();

        // GET: odata/CustomerReporting
        [EnableQuery]
        public IQueryable<customer_rpt> GetCustomerReporting()
        {
            return db.customers_rpt;
        }

        // GET: odata/CustomerReporting(5)
        [EnableQuery]
        public SingleResult<customer_rpt> Getcustomer_rpt([FromODataUri] int key)
        {
            return SingleResult.Create(db.customers_rpt.Where(customer_rpt => customer_rpt.customer_id == key));
        }

        // PUT: odata/CustomerReporting(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<customer_rpt> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            customer_rpt customer_rpt = db.customers_rpt.Find(key);
            if (customer_rpt == null)
            {
                return NotFound();
            }

            patch.Put(customer_rpt);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!customer_rptExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(customer_rpt);
        }

        // POST: odata/CustomerReporting
        public IHttpActionResult Post(customer_rpt customer_rpt)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.customers_rpt.Add(customer_rpt);
            db.SaveChanges();

            return Created(customer_rpt);
        }

        // PATCH: odata/CustomerReporting(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<customer_rpt> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            customer_rpt customer_rpt = db.customers_rpt.Find(key);
            if (customer_rpt == null)
            {
                return NotFound();
            }

            patch.Patch(customer_rpt);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!customer_rptExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(customer_rpt);
        }

        // DELETE: odata/CustomerReporting(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            customer_rpt customer_rpt = db.customers_rpt.Find(key);
            if (customer_rpt == null)
            {
                return NotFound();
            }

            db.customers_rpt.Remove(customer_rpt);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/CustomerReporting(5)/order_rpt
        [EnableQuery]
        public IQueryable<order_rpt> Getorder_rpt([FromODataUri] int key)
        {
            return db.customers_rpt.Where(m => m.customer_id == key).SelectMany(m => m.order_rpt);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool customer_rptExists(int key)
        {
            return db.customers_rpt.Count(e => e.customer_id == key) > 0;
        }
    }
}
