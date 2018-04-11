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
    builder.EntitySet<vw_order_info>("OrderInfo");
    builder.EntitySet<order_task>("order_task"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class OrderInfoController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/OrderInfo
        [EnableQuery]
        public IQueryable<vw_order_info> GetOrderInfo()
        {
            return db.vw_order_info;
        }

        // GET: odata/OrderInfo(5)
        [EnableQuery]
        public SingleResult<vw_order_info> Getvw_order_info([FromODataUri] int key)
        {
            return SingleResult.Create(db.vw_order_info.Where(vw_order_info => vw_order_info.order_id == key));
        }

        // PUT: odata/OrderInfo(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<vw_order_info> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            vw_order_info vw_order_info = db.vw_order_info.Find(key);
            if (vw_order_info == null)
            {
                return NotFound();
            }

            patch.Put(vw_order_info);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!vw_order_infoExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(vw_order_info);
        }

        // POST: odata/OrderInfo
        public IHttpActionResult Post(vw_order_info vw_order_info)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.vw_order_info.Add(vw_order_info);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (vw_order_infoExists(vw_order_info.order_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(vw_order_info);
        }

        // PATCH: odata/OrderInfo(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<vw_order_info> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            vw_order_info vw_order_info = db.vw_order_info.Find(key);
            if (vw_order_info == null)
            {
                return NotFound();
            }

            patch.Patch(vw_order_info);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!vw_order_infoExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(vw_order_info);
        }

        // DELETE: odata/OrderInfo(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            vw_order_info vw_order_info = db.vw_order_info.Find(key);
            if (vw_order_info == null)
            {
                return NotFound();
            }

            db.vw_order_info.Remove(vw_order_info);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/OrderInfo(5)/order_task
        [EnableQuery]
        public IQueryable<order_task> Getorder_task([FromODataUri] int key)
        {
            return db.vw_order_info.Where(m => m.order_id == key).SelectMany(m => m.order_task);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool vw_order_infoExists(int key)
        {
            return db.vw_order_info.Count(e => e.order_id == key) > 0;
        }
    }
}
