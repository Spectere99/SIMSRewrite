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
    builder.EntitySet<lookup_items>("LookupItems");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class LookupItemsController : ODataController
    {
        private simsEntities db = new simsEntities();
        static ILog _log = log4net.LogManager.GetLogger(
            System.Reflection.MethodBase.GetCurrentMethod().DeclaringType
        );
        // GET: odata/LookupItems
        [EnableQuery]
        public IQueryable<lookup_items> GetLookupItems()
        {
            try
            {
                return db.lookup_items;
            }
            catch (Exception e)
            {
                _log.Error("An error occurred while getting Lookup Items.", e);
                return null;
            }
        }

        // GET: odata/LookupItems(5)
        [EnableQuery]
        public SingleResult<lookup_items> Getlookup_items([FromODataUri] int key)
        {
            return SingleResult.Create(db.lookup_items.Where(lookup_items => lookup_items.id == key));
        }

        // PUT: odata/LookupItems(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<lookup_items> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            lookup_items lookup_items = db.lookup_items.Find(key);
            if (lookup_items == null)
            {
                return NotFound();
            }

            patch.Put(lookup_items);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!lookup_itemsExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(lookup_items);
        }

        // POST: odata/LookupItems
        public IHttpActionResult Post(lookup_items lookup_items)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.lookup_items.Add(lookup_items);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (lookup_itemsExists(lookup_items.id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(lookup_items);
        }

        // PATCH: odata/LookupItems(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<lookup_items> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            lookup_items lookup_items = db.lookup_items.Find(key);
            if (lookup_items == null)
            {
                return NotFound();
            }

            patch.Patch(lookup_items);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!lookup_itemsExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(lookup_items);
        }

        // DELETE: odata/LookupItems(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            lookup_items lookup_items = db.lookup_items.Find(key);
            if (lookup_items == null)
            {
                return NotFound();
            }

            db.lookup_items.Remove(lookup_items);
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

        private bool lookup_itemsExists(int key)
        {
            return db.lookup_items.Count(e => e.id == key) > 0;
        }
    }
}
