using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.OData;
using SIMSEntities;

namespace SIMSDataService.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using SIMSEntities;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<order>("Orders");
    builder.EntitySet<customer>("customers"); 
    builder.EntitySet<order_detail>("order_detail"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class OrdersController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/Orders
        [EnableQuery]
        public IQueryable<order> GetOrders()
        {
            return db.orders;
        }

        // GET: odata/Orders(5)
        [EnableQuery]
        public SingleResult<order> Getorder([FromODataUri] int key)
        {
            return SingleResult.Create(db.orders.Where(order => order.order_id == key));
        }

        // PUT: odata/Orders(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<order> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            order order = await db.orders.FindAsync(key);
            if (order == null)
            {
                return NotFound();
            }

            patch.Put(order);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!orderExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Debug.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Debug.WriteLine("- Property: \"{0}\", Value: \"{1}\", Error: \"{2}\"",
                            ve.PropertyName,
                            eve.Entry.CurrentValues.GetValue<object>(ve.PropertyName),
                            ve.ErrorMessage);
                    }
                }
                throw;
            }

            return Updated(order);
        }

        // POST: odata/Orders
        public async Task<IHttpActionResult> Post(order order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //Generate Primary Key (Next number)
            //int nextPk =
            //        db.orders.OrderByDescending(
            //                p => p.order_id)
            //            .FirstOrDefault()
            //            .order_id +
            //        1;
            //order.order_id = nextPk;

            //Need to set the orderNumber
            DateTime startDate = DateTime.Now.Date;
            if (order.order_date != null)
            {
                startDate = order.order_date.Value.Date;
            }

            order.order_date = startDate;

            List<order> todaysOrders = db.orders.Where(p => p.order_date == startDate).ToList();
            order.order_number = order.order_number + (todaysOrders.Count + 1);

            db.orders.Add(order);

            try
            {
                await db.SaveChangesAsync();
                // db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (orderExists(order.order_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Debug.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Debug.WriteLine("- Property: \"{0}\", Value: \"{1}\", Error: \"{2}\"",
                            ve.PropertyName,
                            eve.Entry.CurrentValues.GetValue<object>(ve.PropertyName),
                            ve.ErrorMessage);
                    }
                }
                throw;
            }

            return Created(order);
        }

        // PATCH: odata/Orders(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<order> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            order order = await db.orders.FindAsync(key);
            if (order == null)
            {
                return NotFound();
            }

            patch.Patch(order);

            try
            {
                await db.SaveChangesAsync();
                //db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!orderExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(order);
        }

        // DELETE: odata/Orders(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            order order = await db.orders.FindAsync(key);
            if (order == null)
            {
                return NotFound();
            }

            db.orders.Remove(order);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Orders(5)/customer
        [EnableQuery]
        public SingleResult<customer> Getcustomer([FromODataUri] int key)
        {
            return SingleResult.Create(db.orders.Where(m => m.order_id == key).Select(m => m.customer));
        }

        // GET: odata/Orders(5)/order_detail
        [EnableQuery]
        public IQueryable<order_detail> Getorder_detail([FromODataUri] int key)
        {
            return db.orders.Where(m => m.order_id == key).SelectMany(m => m.order_detail);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool orderExists(int key)
        {
            return db.orders.Count(e => e.order_id == key) > 0;
        }
    }
}
