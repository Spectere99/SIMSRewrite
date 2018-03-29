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
    builder.EntitySet<vw_order_payments>("OrderPaymentReporting");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class OrderPaymentReportingController : ODataController
    {
        private ReportingEntities db = new ReportingEntities();

        // GET: odata/OrderPaymentReporting
        [EnableQuery]
        public IQueryable<vw_order_payments> GetOrderPaymentReporting()
        {
            return db.vw_order_payments;
        }

        // GET: odata/OrderPaymentReporting(5)
        [EnableQuery]
        public SingleResult<vw_order_payments> Getvw_order_payments([FromODataUri] int key)
        {
            return SingleResult.Create(db.vw_order_payments.Where(vw_order_payments => vw_order_payments.order_id == key));
        }

        // PUT: odata/OrderPaymentReporting(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<vw_order_payments> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            vw_order_payments vw_order_payments = db.vw_order_payments.Find(key);
            if (vw_order_payments == null)
            {
                return NotFound();
            }

            patch.Put(vw_order_payments);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!vw_order_paymentsExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(vw_order_payments);
        }

        // POST: odata/OrderPaymentReporting
        public IHttpActionResult Post(vw_order_payments vw_order_payments)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.vw_order_payments.Add(vw_order_payments);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (vw_order_paymentsExists(vw_order_payments.order_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(vw_order_payments);
        }

        // PATCH: odata/OrderPaymentReporting(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<vw_order_payments> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            vw_order_payments vw_order_payments = db.vw_order_payments.Find(key);
            if (vw_order_payments == null)
            {
                return NotFound();
            }

            patch.Patch(vw_order_payments);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!vw_order_paymentsExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(vw_order_payments);
        }

        // DELETE: odata/OrderPaymentReporting(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            vw_order_payments vw_order_payments = db.vw_order_payments.Find(key);
            if (vw_order_payments == null)
            {
                return NotFound();
            }

            db.vw_order_payments.Remove(vw_order_payments);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool vw_order_paymentsExists(int key)
        {
            return db.vw_order_payments.Count(e => e.order_id == key) > 0;
        }
    }
}
