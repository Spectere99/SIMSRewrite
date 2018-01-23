using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using SIMSEntities;

namespace SIMSDataService.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using SIMSEntities;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<order_payments>("OrderPayments");
    builder.EntitySet<order>("orders"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class OrderPaymentsController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/OrderPayments
        [EnableQuery]
        public IQueryable<order_payments> GetOrderPayments()
        {
            return db.order_payments;
        }

        // GET: odata/OrderPayments(5)
        [EnableQuery]
        public SingleResult<order_payments> Getorder_payments([FromODataUri] int key)
        {
            return SingleResult.Create(db.order_payments.Where(order_payments => order_payments.order_payment_id == key));
        }

        // PUT: odata/OrderPayments(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<order_payments> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            order_payments order_payments = await db.order_payments.FindAsync(key);
            if (order_payments == null)
            {
                return NotFound();
            }

            patch.Put(order_payments);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!order_paymentsExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(order_payments);
        }

        // POST: odata/OrderPayments
        public async Task<IHttpActionResult> Post(order_payments order_payments)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.order_payments.Add(order_payments);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (order_paymentsExists(order_payments.order_payment_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(order_payments);
        }

        // PATCH: odata/OrderPayments(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<order_payments> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            order_payments order_payments = await db.order_payments.FindAsync(key);
            if (order_payments == null)
            {
                return NotFound();
            }

            patch.Patch(order_payments);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!order_paymentsExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(order_payments);
        }

        // DELETE: odata/OrderPayments(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            order_payments order_payments = await db.order_payments.FindAsync(key);
            if (order_payments == null)
            {
                return NotFound();
            }

            db.order_payments.Remove(order_payments);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/OrderPayments(5)/order
        [EnableQuery]
        public SingleResult<order> Getorder([FromODataUri] int key)
        {
            return SingleResult.Create(db.order_payments.Where(m => m.order_payment_id == key).Select(m => m.order));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool order_paymentsExists(int key)
        {
            return db.order_payments.Count(e => e.order_payment_id == key) > 0;
        }
    }
}
