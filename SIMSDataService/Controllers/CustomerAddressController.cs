using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
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
    builder.EntitySet<customer_address>("CustomerAddress");
    builder.EntitySet<customer>("customers"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class CustomerAddressController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/CustomerAddress
        [EnableQuery]
        public IQueryable<customer_address> GetCustomerAddress()
        {
            return db.customer_address;
        }

        // GET: odata/CustomerAddress(5)
        [EnableQuery]
        public SingleResult<customer_address> Getcustomer_address([FromODataUri] int key)
        {
            return SingleResult.Create(db.customer_address.Where(customer_address => customer_address.customer_address_id == key));
        }

        // PUT: odata/CustomerAddress(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<customer_address> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            customer_address customer_address = await db.customer_address.FindAsync(key);
            if (customer_address == null)
            {
                return NotFound();
            }

            patch.Put(customer_address);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!customer_addressExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(customer_address);
        }

        // POST: odata/CustomerAddress
        public async Task<IHttpActionResult> Post(customer_address customer_address)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.customer_address.Add(customer_address);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (customer_addressExists(customer_address.customer_address_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(customer_address);
        }

        // PATCH: odata/CustomerAddress(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<customer_address> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            customer_address customer_address = await db.customer_address.FindAsync(key);
            if (customer_address == null)
            {
                return NotFound();
            }

            patch.Patch(customer_address);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!customer_addressExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(customer_address);
        }

        // DELETE: odata/CustomerAddress(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            customer_address customer_address = await db.customer_address.FindAsync(key);
            if (customer_address == null)
            {
                return NotFound();
            }

            db.customer_address.Remove(customer_address);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/CustomerAddress(5)/customer
        [EnableQuery]
        public SingleResult<customer> Getcustomer([FromODataUri] int key)
        {
            return SingleResult.Create(db.customer_address.Where(m => m.customer_address_id == key).Select(m => m.customer));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool customer_addressExists(int key)
        {
            return db.customer_address.Count(e => e.customer_address_id == key) > 0;
        }
    }
}
