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
    builder.EntitySet<order_art_file>("OrderArtFile");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class OrderArtFileController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/OrderArtFile
        [EnableQuery]
        public IQueryable<order_art_file> GetOrderArtFile()
        {
            return db.order_art_file;
        }

        // GET: odata/OrderArtFile(5)
        [EnableQuery]
        public SingleResult<order_art_file> Getorder_art_file([FromODataUri] long key)
        {
            return SingleResult.Create(db.order_art_file.Where(order_art_file => order_art_file.order_art_id == key));
        }

        // PUT: odata/OrderArtFile(5)
        public async Task<IHttpActionResult> Put([FromODataUri] long key, Delta<order_art_file> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            order_art_file order_art_file = await db.order_art_file.FindAsync(key);
            if (order_art_file == null)
            {
                return NotFound();
            }

            patch.Put(order_art_file);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!order_art_fileExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(order_art_file);
        }

        // POST: odata/OrderArtFile
        public async Task<IHttpActionResult> Post(order_art_file order_art_file)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.order_art_file.Add(order_art_file);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (order_art_fileExists(order_art_file.order_art_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(order_art_file);
        }

        // PATCH: odata/OrderArtFile(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] long key, Delta<order_art_file> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            order_art_file order_art_file = await db.order_art_file.FindAsync(key);
            if (order_art_file == null)
            {
                return NotFound();
            }

            patch.Patch(order_art_file);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!order_art_fileExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(order_art_file);
        }

        // DELETE: odata/OrderArtFile(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] long key)
        {
            order_art_file order_art_file = await db.order_art_file.FindAsync(key);
            if (order_art_file == null)
            {
                return NotFound();
            }

            db.order_art_file.Remove(order_art_file);
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

        private bool order_art_fileExists(long key)
        {
            return db.order_art_file.Count(e => e.order_art_id == key) > 0;
        }
    }
}
