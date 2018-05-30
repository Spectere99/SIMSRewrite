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
    builder.EntitySet<customer_person>("CustomerPerson");
    builder.EntitySet<customer>("customers"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class CustomerPersonController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/CustomerPerson
        [EnableQuery]
        public IQueryable<customer_person> GetCustomerPerson()
        {
            return db.customer_person.Where(p=>p.status_code == "act");
        }

        // GET: odata/CustomerPerson(5)
        [EnableQuery]
        public SingleResult<customer_person> Getcustomer_person([FromODataUri] int key)
        {
            return SingleResult.Create(db.customer_person.Where(customer_person => customer_person.customer_person_id == key));
        }

        // PUT: odata/CustomerPerson(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<customer_person> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            customer_person customer_person = await db.customer_person.FindAsync(key);
            if (customer_person == null)
            {
                return NotFound();
            }

            patch.Put(customer_person);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!customer_personExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(customer_person);
        }

        // POST: odata/CustomerPerson
        public async Task<IHttpActionResult> Post(customer_person customer_person)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.customer_person.Add(customer_person);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (customer_personExists(customer_person.customer_person_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(customer_person);
        }

        // PATCH: odata/CustomerPerson(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<customer_person> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            customer_person customer_person = await db.customer_person.FindAsync(key);
            if (customer_person == null)
            {
                return NotFound();
            }

            patch.Patch(customer_person);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!customer_personExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(customer_person);
        }

        // DELETE: odata/CustomerPerson(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            customer_person customer_person = await db.customer_person.FindAsync(key);
            if (customer_person == null)
            {
                return NotFound();
            }

            db.customer_person.Remove(customer_person);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/CustomerPerson(5)/customers
        [EnableQuery]
        public SingleResult<customer> Getcustomers([FromODataUri] int key)
        {
            return SingleResult.Create(db.customer_person.Where(m => m.customer_person_id == key).Select(m => m.customers));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool customer_personExists(int key)
        {
            return db.customer_person.Count(e => e.customer_person_id == key) > 0;
        }
    }
}
