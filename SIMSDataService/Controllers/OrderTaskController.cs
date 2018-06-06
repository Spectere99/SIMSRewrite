using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
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
    builder.EntitySet<order_task>("OrderTask");
    builder.EntitySet<order>("orders"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class OrderTaskController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/OrderTask
        [EnableQuery]
        public IQueryable<order_task> GetOrderTask()
        {
            return db.order_task.Where(p=>p.is_complete != null);
        }

        // GET: odata/OrderTask(5)
        [EnableQuery]
        public SingleResult<order_task> Getorder_task([FromODataUri] int key)
        {
            return SingleResult.Create(db.order_task.Where(order_task => order_task.order_id == key));
        }

        // PUT: odata/OrderTask(5)
        public IHttpActionResult Put([FromODataUri] int order_id, [FromODataUri] string task_code, Delta<order_task> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            order_task order_task = db.order_task.Find(order_id);
            if (order_task == null)
            {
                return NotFound();
            }

            patch.Put(order_task);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!order_taskExists(order_id, task_code))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(order_task);
        }

        // POST: odata/OrderTask
        public IHttpActionResult Post(order_task order_task)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.order_task.Add(order_task);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (order_taskExists(order_task.order_id, order_task.task_code))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(order_task);
        }

        // PATCH: odata/OrderTask(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int order_id, [FromODataUri] string task_code, Delta<order_task> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // order_task order_task = db.order_task.Find(order_id);
            order_task order_task = db.order_task.FirstOrDefault(p => p.order_id == order_id && p.task_code == task_code);
            if (order_task == null)
            {
                return NotFound();
            }

            patch.Patch(order_task);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!order_taskExists(order_id, task_code))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(order_task);
        }

        // DELETE: odata/OrderTask(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            var delOrderTasks = db.order_task.Where(q => q.order_id == key);
            
            //order_task order_task = db.order_task.Find(key);
            if (delOrderTasks.Any())
            {
                foreach (order_task item in delOrderTasks)
                {
                    db.order_task.Remove(item);
                }
                db.SaveChanges();
                return Ok(key);
            }

            return Ok(key);
            

            
        }

        // GET: odata/OrderTask(5)/order
        [EnableQuery]
        public SingleResult<order> Getorder([FromODataUri] int key)
        {
            return SingleResult.Create(db.order_task.Where(m => m.order_id == key).Select(m => m.order));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool order_taskExists(int key, string key2)
        {
            return db.order_task.Count(e => e.order_id == key && e.task_code == key2) > 0;
        }
    }
}
