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
    builder.EntitySet<vw_order_quantities_rollup>("OrderQuantitiesRollup");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class OrderQuantitiesRollupController : ODataController
    {
        private ReportingEntities db = new ReportingEntities();

        // GET: odata/OrderQuantitiesRollup
        [EnableQuery]
        public IQueryable<vw_order_quantities_rollup> GetOrderQuantitiesRollup()
        {
            return db.vw_order_quantities_rollup;
        }

        // GET: odata/OrderQuantitiesRollup(5)
        [EnableQuery]
        public SingleResult<vw_order_quantities_rollup> Getvw_order_quantities_rollup([FromODataUri] int key)
        {
            return SingleResult.Create(db.vw_order_quantities_rollup.Where(vw_order_quantities_rollup => vw_order_quantities_rollup.id == key));
        }

        // PUT: odata/OrderQuantitiesRollup(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<vw_order_quantities_rollup> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            vw_order_quantities_rollup vw_order_quantities_rollup = db.vw_order_quantities_rollup.Find(key);
            if (vw_order_quantities_rollup == null)
            {
                return NotFound();
            }

            patch.Put(vw_order_quantities_rollup);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!vw_order_quantities_rollupExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(vw_order_quantities_rollup);
        }

        // POST: odata/OrderQuantitiesRollup
        public IHttpActionResult Post(vw_order_quantities_rollup vw_order_quantities_rollup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.vw_order_quantities_rollup.Add(vw_order_quantities_rollup);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (vw_order_quantities_rollupExists(vw_order_quantities_rollup.id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(vw_order_quantities_rollup);
        }

        // PATCH: odata/OrderQuantitiesRollup(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<vw_order_quantities_rollup> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            vw_order_quantities_rollup vw_order_quantities_rollup = db.vw_order_quantities_rollup.Find(key);
            if (vw_order_quantities_rollup == null)
            {
                return NotFound();
            }

            patch.Patch(vw_order_quantities_rollup);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!vw_order_quantities_rollupExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(vw_order_quantities_rollup);
        }

        // DELETE: odata/OrderQuantitiesRollup(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            vw_order_quantities_rollup vw_order_quantities_rollup = db.vw_order_quantities_rollup.Find(key);
            if (vw_order_quantities_rollup == null)
            {
                return NotFound();
            }

            db.vw_order_quantities_rollup.Remove(vw_order_quantities_rollup);
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

        private bool vw_order_quantities_rollupExists(int key)
        {
            return db.vw_order_quantities_rollup.Count(e => e.id == key) > 0;
        }
    }
}
