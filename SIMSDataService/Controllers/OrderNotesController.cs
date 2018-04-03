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
    builder.EntitySet<order_notes>("OrderNotes");
    builder.EntitySet<order>("orders"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class OrderNotesController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/OrderNotes
        [EnableQuery]
        public IQueryable<order_notes> GetOrderNotes()
        {
            return db.order_notes;
        }

        // GET: odata/OrderNotes(5)
        [EnableQuery]
        public SingleResult<order_notes> Getorder_notes([FromODataUri] int key)
        {
            return SingleResult.Create(db.order_notes.Where(order_notes => order_notes.order_notes_id == key));
        }

        // PUT: odata/OrderNotes(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<order_notes> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            order_notes order_notes = db.order_notes.Find(key);
            if (order_notes == null)
            {
                return NotFound();
            }

            patch.Put(order_notes);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!order_notesExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(order_notes);
        }

        // POST: odata/OrderNotes
        public IHttpActionResult Post(order_notes order_notes)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.order_notes.Add(order_notes);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (order_notesExists(order_notes.order_notes_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(order_notes);
        }

        // PATCH: odata/OrderNotes(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<order_notes> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            order_notes order_notes = db.order_notes.Find(key);
            if (order_notes == null)
            {
                return NotFound();
            }

            patch.Patch(order_notes);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!order_notesExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(order_notes);
        }

        // DELETE: odata/OrderNotes(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            order_notes order_notes = db.order_notes.Find(key);
            if (order_notes == null)
            {
                return NotFound();
            }

            db.order_notes.Remove(order_notes);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/OrderNotes(5)/order
        [EnableQuery]
        public SingleResult<order> Getorder([FromODataUri] int key)
        {
            return SingleResult.Create(db.order_notes.Where(m => m.order_notes_id == key).Select(m => m.order));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool order_notesExists(int key)
        {
            return db.order_notes.Count(e => e.order_notes_id == key) > 0;
        }
    }
}
