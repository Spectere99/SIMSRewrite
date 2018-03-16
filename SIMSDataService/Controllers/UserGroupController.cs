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
    builder.EntitySet<user_group>("UserGroup");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class UserGroupController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/UserGroup
        [EnableQuery]
        public IQueryable<user_group> GetUserGroup()
        {
            return db.user_group;
        }

        // GET: odata/UserGroup(5)
        [EnableQuery]
        public SingleResult<user_group> Getuser_group([FromODataUri] int key)
        {
            return SingleResult.Create(db.user_group.Where(user_group => user_group.user_id == key));
        }

        // PUT: odata/UserGroup(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<user_group> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            user_group user_group = await db.user_group.FindAsync(key);
            if (user_group == null)
            {
                return NotFound();
            }

            patch.Put(user_group);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!user_groupExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(user_group);
        }

        // POST: odata/UserGroup
        public async Task<IHttpActionResult> Post(user_group user_group)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.user_group.Add(user_group);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (user_groupExists(user_group.user_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(user_group);
        }

        // PATCH: odata/UserGroup(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<user_group> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            user_group user_group = await db.user_group.FindAsync(key);
            if (user_group == null)
            {
                return NotFound();
            }

            patch.Patch(user_group);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!user_groupExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(user_group);
        }

        // DELETE: odata/UserGroup(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            user_group user_group = await db.user_group.FindAsync(key);
            if (user_group == null)
            {
                return NotFound();
            }

            db.user_group.Remove(user_group);
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

        private bool user_groupExists(int key)
        {
            return db.user_group.Count(e => e.user_id == key) > 0;
        }
    }
}
