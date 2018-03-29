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
    builder.EntitySet<correspondence>("Correspondence");
    builder.EntitySet<customer>("customers"); 
    builder.EntitySet<order>("orders"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class CorrespondenceController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/Correspondence
        [EnableQuery]
        public IQueryable<correspondence> GetCorrespondence()
        {
            return db.correspondences;
        }

        // GET: odata/Correspondence(5)
        [EnableQuery]
        public SingleResult<correspondence> Getcorrespondence([FromODataUri] int key)
        {
            return SingleResult.Create(db.correspondences.Where(correspondence => correspondence.correspondence_id == key));
        }

        // PUT: odata/Correspondence(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<correspondence> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            correspondence correspondence = db.correspondences.Find(key);
            if (correspondence == null)
            {
                return NotFound();
            }

            patch.Put(correspondence);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!correspondenceExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(correspondence);
        }

        // POST: odata/Correspondence
        public IHttpActionResult Post(correspondence correspondence)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.correspondences.Add(correspondence);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (correspondenceExists(correspondence.correspondence_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(correspondence);
        }

        // PATCH: odata/Correspondence(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<correspondence> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            correspondence correspondence = db.correspondences.Find(key);
            if (correspondence == null)
            {
                return NotFound();
            }

            patch.Patch(correspondence);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!correspondenceExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(correspondence);
        }

        // DELETE: odata/Correspondence(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            correspondence correspondence = db.correspondences.Find(key);
            if (correspondence == null)
            {
                return NotFound();
            }

            db.correspondences.Remove(correspondence);
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

        private bool correspondenceExists(int key)
        {
            return db.correspondences.Count(e => e.correspondence_id == key) > 0;
        }
    }
}
