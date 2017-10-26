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
using SIMSEntities;

namespace SIMSDataService.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using SIMSEntities;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<task>("Tasks");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class TasksController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/Tasks
        [EnableQuery]
        public IQueryable<task> GetTasks()
        {
            return db.tasks;
        }

        // GET: odata/Tasks(5)
        [EnableQuery]
        public SingleResult<task> Gettask([FromODataUri] int key)
        {
            return SingleResult.Create(db.tasks.Where(task => task.task_id == key));
        }

        // PUT: odata/Tasks(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<task> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            task task = db.tasks.Find(key);
            if (task == null)
            {
                return NotFound();
            }

            patch.Put(task);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!taskExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(task);
        }

        // POST: odata/Tasks
        public IHttpActionResult Post(task task)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.tasks.Add(task);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (taskExists(task.task_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(task);
        }

        // PATCH: odata/Tasks(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<task> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            task task = db.tasks.Find(key);
            if (task == null)
            {
                return NotFound();
            }

            patch.Patch(task);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!taskExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(task);
        }

        // DELETE: odata/Tasks(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            task task = db.tasks.Find(key);
            if (task == null)
            {
                return NotFound();
            }

            db.tasks.Remove(task);
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

        private bool taskExists(int key)
        {
            return db.tasks.Count(e => e.task_id == key) > 0;
        }
    }
}
