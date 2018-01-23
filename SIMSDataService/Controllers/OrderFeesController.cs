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
    builder.EntitySet<order_fees>("OrderFees");
    builder.EntitySet<order>("orders"); 
    builder.EntitySet<pricelist>("pricelists"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class OrderFeesController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/OrderFees
        [EnableQuery]
        public IQueryable<order_fees> GetOrderFees()
        {
            return db.order_fees;
        }

        // GET: odata/OrderFees(5)
        [EnableQuery]
        public SingleResult<order_fees> Getorder_fees([FromODataUri] int key)
        {
            return SingleResult.Create(db.order_fees.Where(order_fees => order_fees.order_fee_id == key));
        }

        // PUT: odata/OrderFees(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<order_fees> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            order_fees order_fees = await db.order_fees.FindAsync(key);
            if (order_fees == null)
            {
                return NotFound();
            }

            patch.Put(order_fees);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!order_feesExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(order_fees);
        }

        // POST: odata/OrderFees
        public async Task<IHttpActionResult> Post(order_fees order_fees)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.order_fees.Add(order_fees);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (order_feesExists(order_fees.order_fee_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(order_fees);
        }

        // PATCH: odata/OrderFees(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<order_fees> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            order_fees order_fees = await db.order_fees.FindAsync(key);
            if (order_fees == null)
            {
                return NotFound();
            }

            patch.Patch(order_fees);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!order_feesExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(order_fees);
        }

        // DELETE: odata/OrderFees(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            order_fees order_fees = await db.order_fees.FindAsync(key);
            if (order_fees == null)
            {
                return NotFound();
            }

            db.order_fees.Remove(order_fees);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/OrderFees(5)/order
        [EnableQuery]
        public SingleResult<order> Getorder([FromODataUri] int key)
        {
            return SingleResult.Create(db.order_fees.Where(m => m.order_fee_id == key).Select(m => m.order));
        }

        // GET: odata/OrderFees(5)/pricelists
        [EnableQuery]
        public SingleResult<pricelist> Getpricelists([FromODataUri] int key)
        {
            return SingleResult.Create(db.order_fees.Where(m => m.order_fee_id == key).Select(m => m.pricelists));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool order_feesExists(int key)
        {
            return db.order_fees.Count(e => e.order_fee_id == key) > 0;
        }
    }
}
