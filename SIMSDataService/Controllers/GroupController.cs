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
    builder.EntitySet<hotjas_group>("Group");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class GroupController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/Group
        [EnableQuery]
        public IQueryable<hotjas_group> GetGroup()
        {
            return db.hotjas_group;
        }

        // GET: odata/Group(5)
        [EnableQuery]
        public SingleResult<hotjas_group> Gethotjas_group([FromODataUri] int key)
        {
            return SingleResult.Create(db.hotjas_group.Where(hotjas_group => hotjas_group.hotjas_group_id == key));
        }

        // PUT: odata/Group(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<hotjas_group> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            hotjas_group hotjas_group = await db.hotjas_group.FindAsync(key);
            if (hotjas_group == null)
            {
                return NotFound();
            }

            patch.Put(hotjas_group);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!hotjas_groupExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(hotjas_group);
        }

        // POST: odata/Group
        public async Task<IHttpActionResult> Post(hotjas_group hotjas_group)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.hotjas_group.Add(hotjas_group);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (hotjas_groupExists(hotjas_group.hotjas_group_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(hotjas_group);
        }

        // PATCH: odata/Group(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<hotjas_group> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            hotjas_group hotjas_group = await db.hotjas_group.FindAsync(key);
            if (hotjas_group == null)
            {
                return NotFound();
            }

            patch.Patch(hotjas_group);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!hotjas_groupExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(hotjas_group);
        }

        // DELETE: odata/Group(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            hotjas_group hotjas_group = await db.hotjas_group.FindAsync(key);
            if (hotjas_group == null)
            {
                return NotFound();
            }

            db.hotjas_group.Remove(hotjas_group);
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

        private bool hotjas_groupExists(int key)
        {
            return db.hotjas_group.Count(e => e.hotjas_group_id == key) > 0;
        }
    }
}
