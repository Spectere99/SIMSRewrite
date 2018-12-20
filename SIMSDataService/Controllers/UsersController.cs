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
using log4net;
using SIMSEntities;

namespace SIMSDataService.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using SIMSEntities;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<user>("Users");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class UsersController : ODataController
    {
        private simsEntities db = new simsEntities();
        static ILog _log = log4net.LogManager.GetLogger(
            System.Reflection.MethodBase.GetCurrentMethod().DeclaringType
        );
        // GET: odata/Users
        [EnableQuery]
        public IQueryable<user> GetUsers()
        {
            try
            {
                return db.users;
            }
            catch (Exception e)
            {
                _log.Error("An error occurred while getting User Items.", e);
                return null;
            }
            
        }

        // GET: odata/Users(5)
        [EnableQuery]
        public SingleResult<user> Getuser([FromODataUri] int key)
        {
            return SingleResult.Create(db.users.Where(user => user.user_id == key));
        }

        // PUT: odata/Users(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<user> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            user user = await db.users.FindAsync(key);
            if (user == null)
            {
                return NotFound();
            }

            patch.Put(user);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!userExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(user);
        }

        // POST: odata/Users
        public async Task<IHttpActionResult> Post(user user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.users.Add(user);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (userExists(user.user_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(user);
        }

        // PATCH: odata/Users(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<user> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            user user = await db.users.FindAsync(key);
            if (user == null)
            {
                return NotFound();
            }

            patch.Patch(user);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!userExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(user);
        }

        // DELETE: odata/Users(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            user user = await db.users.FindAsync(key);
            if (user == null)
            {
                return NotFound();
            }

            db.users.Remove(user);
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

        private bool userExists(int key)
        {
            return db.users.Count(e => e.user_id == key) > 0;
        }
    }
}
