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
    builder.EntitySet<order_detail>("OrderDetails");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class OrderDetailsController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/OrderDetail
        [EnableQuery]
        public IQueryable<order_detail> GetOrderDetail()
        {
            return db.order_detail;
        }

        // GET: odata/OrderDetail(5)
        [EnableQuery]
        public SingleResult<order_detail> Getorder_detail([FromODataUri] int key)
        {
            return SingleResult.Create(db.order_detail.Where(order_detail => order_detail.order_detail_id == key));
        }

        // PUT: odata/OrderDetail(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<order_detail> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            order_detail order_detail = db.order_detail.Find(key);
            if (order_detail == null)
            {
                return NotFound();
            }

            patch.Put(order_detail);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!order_detailExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(order_detail);
        }

        // POST: odata/OrderDetail
        public IHttpActionResult Post(order_detail order_detail)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.order_detail.Add(order_detail);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (order_detailExists(order_detail.order_detail_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(order_detail);
        }

        // PATCH: odata/OrderDetail(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<order_detail> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            order_detail order_detail = db.order_detail.Find(key);
            if (order_detail == null)
            {
                return NotFound();
            }

            patch.Patch(order_detail);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!order_detailExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(order_detail);
        }

        // DELETE: odata/OrderDetail(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            order_detail order_detail = db.order_detail.Find(key);
            if (order_detail == null)
            {
                return NotFound();
            }

            db.order_detail.Remove(order_detail);
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

        private bool order_detailExists(int key)
        {
            return db.order_detail.Count(e => e.order_detail_id == key) > 0;
        }
    }
}
