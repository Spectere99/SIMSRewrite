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
    builder.EntitySet<vw_order_quantities>("OrderQuantitiesReporting");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class OrderQuantitiesReportingController : ODataController
    {
        private ReportingEntities db = new ReportingEntities();

        // GET: odata/OrderQuantitiesReporting
        [EnableQuery]
        public IQueryable<vw_order_quantities> GetOrderQuantitiesReporting()
        {
            return db.vw_order_quantities;
        }

        // GET: odata/OrderQuantitiesReporting(5)
        [EnableQuery]
        public SingleResult<vw_order_quantities> Getvw_order_quantities([FromODataUri] int key)
        {
            return SingleResult.Create(db.vw_order_quantities.Where(vw_order_quantities => vw_order_quantities.order_id == key));
        }

        // PUT: odata/OrderQuantitiesReporting(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<vw_order_quantities> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            vw_order_quantities vw_order_quantities = db.vw_order_quantities.Find(key);
            if (vw_order_quantities == null)
            {
                return NotFound();
            }

            patch.Put(vw_order_quantities);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!vw_order_quantitiesExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(vw_order_quantities);
        }

        // POST: odata/OrderQuantitiesReporting
        public IHttpActionResult Post(vw_order_quantities vw_order_quantities)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.vw_order_quantities.Add(vw_order_quantities);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (vw_order_quantitiesExists(vw_order_quantities.order_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(vw_order_quantities);
        }

        // PATCH: odata/OrderQuantitiesReporting(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<vw_order_quantities> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            vw_order_quantities vw_order_quantities = db.vw_order_quantities.Find(key);
            if (vw_order_quantities == null)
            {
                return NotFound();
            }

            patch.Patch(vw_order_quantities);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!vw_order_quantitiesExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(vw_order_quantities);
        }

        // DELETE: odata/OrderQuantitiesReporting(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            vw_order_quantities vw_order_quantities = db.vw_order_quantities.Find(key);
            if (vw_order_quantities == null)
            {
                return NotFound();
            }

            db.vw_order_quantities.Remove(vw_order_quantities);
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

        private bool vw_order_quantitiesExists(int key)
        {
            return db.vw_order_quantities.Count(e => e.order_id == key) > 0;
        }
    }
}
