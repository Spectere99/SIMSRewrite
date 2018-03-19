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
    builder.EntitySet<order_status_history>("OrderStatusHistory");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class OrderStatusHistoryController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/OrderStatusHistory
        [EnableQuery]
        public IQueryable<order_status_history> GetOrderStatusHistory()
        {
            return db.order_status_history;
        }

        // GET: odata/OrderStatusHistory(5)
        [EnableQuery]
        public SingleResult<order_status_history> Getorder_status_history([FromODataUri] int key)
        {
            return SingleResult.Create(db.order_status_history.Where(order_status_history => order_status_history.order_status_history_id == key));
        }

        // PUT: odata/OrderStatusHistory(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<order_status_history> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            order_status_history order_status_history = db.order_status_history.Find(key);
            if (order_status_history == null)
            {
                return NotFound();
            }

            patch.Put(order_status_history);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!order_status_historyExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(order_status_history);
        }

        // POST: odata/OrderStatusHistory
        public IHttpActionResult Post(order_status_history order_status_history)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.order_status_history.Add(order_status_history);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (order_status_historyExists(order_status_history.order_status_history_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(order_status_history);
        }

        // PATCH: odata/OrderStatusHistory(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<order_status_history> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            order_status_history order_status_history = db.order_status_history.Find(key);
            if (order_status_history == null)
            {
                return NotFound();
            }

            patch.Patch(order_status_history);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!order_status_historyExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(order_status_history);
        }

        // DELETE: odata/OrderStatusHistory(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            order_status_history order_status_history = db.order_status_history.Find(key);
            if (order_status_history == null)
            {
                return NotFound();
            }

            db.order_status_history.Remove(order_status_history);
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

        private bool order_status_historyExists(int key)
        {
            return db.order_status_history.Count(e => e.order_status_history_id == key) > 0;
        }
    }
}
