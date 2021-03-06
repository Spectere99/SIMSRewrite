﻿using System;
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
    builder.EntitySet<order_art_placement>("OrderArtPlacement");
    builder.EntitySet<order>("orders"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class OrderArtPlacementController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/OrderArtPlacement
        [EnableQuery]
        public IQueryable<order_art_placement> GetOrderArtPlacement()
        {
            return db.order_art_placement;
        }

        // GET: odata/OrderArtPlacement(5)
        [EnableQuery]
        public SingleResult<order_art_placement> Getorder_art_placement([FromODataUri] int key)
        {
            return SingleResult.Create(db.order_art_placement.Where(order_art_placement => order_art_placement.order_art_placement_id == key));
        }

        // PUT: odata/OrderArtPlacement(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<order_art_placement> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            order_art_placement order_art_placement = db.order_art_placement.Find(key);
            if (order_art_placement == null)
            {
                return NotFound();
            }

            patch.Put(order_art_placement);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!order_art_placementExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(order_art_placement);
        }

        // POST: odata/OrderArtPlacement
        public IHttpActionResult Post(order_art_placement order_art_placement)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.order_art_placement.Add(order_art_placement);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (order_art_placementExists(order_art_placement.order_art_placement_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(order_art_placement);
        }

        // PATCH: odata/OrderArtPlacement(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<order_art_placement> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            order_art_placement order_art_placement = db.order_art_placement.Find(key);
            if (order_art_placement == null)
            {
                return NotFound();
            }

            patch.Patch(order_art_placement);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!order_art_placementExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(order_art_placement);
        }

        // DELETE: odata/OrderArtPlacement(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            order_art_placement order_art_placement = db.order_art_placement.Find(key);
            if (order_art_placement == null)
            {
                return NotFound();
            }

            db.order_art_placement.Remove(order_art_placement);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/OrderArtPlacement(5)/order
        [EnableQuery]
        public SingleResult<order> Getorder([FromODataUri] int key)
        {
            return SingleResult.Create(db.order_art_placement.Where(m => m.order_art_placement_id == key).Select(m => m.order));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool order_art_placementExists(int key)
        {
            return db.order_art_placement.Count(e => e.order_art_placement_id == key) > 0;
        }
    }
}
