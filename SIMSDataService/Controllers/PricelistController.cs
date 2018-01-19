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
    builder.EntitySet<pricelist>("Pricelist");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class PricelistController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/Pricelist
        [EnableQuery]
        public IQueryable<pricelist> GetPricelist()
        {
            return db.pricelists;
        }

        // GET: odata/Pricelist(5)
        [EnableQuery]
        public SingleResult<pricelist> Getpricelist([FromODataUri] int key)
        {
            return SingleResult.Create(db.pricelists.Where(pricelist => pricelist.pricelist_id == key));
        }

        // PUT: odata/Pricelist(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<pricelist> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            pricelist pricelist = await db.pricelists.FindAsync(key);
            if (pricelist == null)
            {
                return NotFound();
            }

            patch.Put(pricelist);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!pricelistExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(pricelist);
        }

        // POST: odata/Pricelist
        public async Task<IHttpActionResult> Post(pricelist pricelist)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.pricelists.Add(pricelist);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (pricelistExists(pricelist.pricelist_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(pricelist);
        }

        // PATCH: odata/Pricelist(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<pricelist> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            pricelist pricelist = await db.pricelists.FindAsync(key);
            if (pricelist == null)
            {
                return NotFound();
            }

            patch.Patch(pricelist);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!pricelistExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(pricelist);
        }

        // DELETE: odata/Pricelist(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            pricelist pricelist = await db.pricelists.FindAsync(key);
            if (pricelist == null)
            {
                return NotFound();
            }

            db.pricelists.Remove(pricelist);
            await db.SaveChangesAsync();

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

        private bool pricelistExists(int key)
        {
            return db.pricelists.Count(e => e.pricelist_id == key) > 0;
        }
    }
}
