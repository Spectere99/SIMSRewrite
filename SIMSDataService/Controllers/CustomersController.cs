using System.Data;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
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
    builder.EntitySet<customer>("Customers");
    builder.EntitySet<customer_address>("customer_address"); 
    builder.EntitySet<order>("orders"); 
    builder.EntitySet<correspondence>("correspondences"); 
    builder.EntitySet<customer_person>("customer_person"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class CustomersController : ODataController
    {
        private simsEntities db = new simsEntities();

        // GET: odata/Customers
        [EnableQuery]
        public IQueryable<customer> GetCustomers()
        {
            return db.customers;
        }

        // GET: odata/Customers(5)
        [EnableQuery]
        public SingleResult<customer> Getcustomer([FromODataUri] int key)
        {
            return SingleResult.Create(db.customers.Where(customer => customer.customer_id == key));
        }

        // PUT: odata/Customers(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<customer> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            customer customer = await db.customers.FindAsync(key);
            if (customer == null)
            {
                return NotFound();
            }

            patch.Put(customer);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!customerExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(customer);
        }

        // POST: odata/Customers
        public async Task<IHttpActionResult> Post(customer customer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.customers.Add(customer);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (customerExists(customer.customer_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(customer);
        }

        // PATCH: odata/Customers(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<customer> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            customer customer = await db.customers.FindAsync(key);
            if (customer == null)
            {
                return NotFound();
            }

            patch.Patch(customer);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!customerExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(customer);
        }

        // DELETE: odata/Customers(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            customer customer = await db.customers.FindAsync(key);
            if (customer == null)
            {
                return NotFound();
            }

            db.customers.Remove(customer);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Customers(5)/customer_address
        [EnableQuery]
        public IQueryable<customer_address> Getcustomer_address([FromODataUri] int key)
        {
            return db.customers.Where(m => m.customer_id == key).SelectMany(m => m.customer_address);
        }

        // GET: odata/Customers(5)/orders
        [EnableQuery]
        public IQueryable<order> Getorders([FromODataUri] int key)
        {
            return db.customers.Where(m => m.customer_id == key).SelectMany(m => m.orders);
        }

        // GET: odata/Customers(5)/customer_person
        [EnableQuery]
        public IQueryable<customer_person> Getcustomer_person([FromODataUri] int key)
        {
            return db.customers.Where(m => m.customer_id == key).SelectMany(m => m.customer_person);
        }

        // GET: odata/Customers(5)/parent
        [EnableQuery]
        public IQueryable<customer> Getparent([FromODataUri] int key)
        {
            return db.customers.Where(m => m.customer_id == key).SelectMany(m => m.parent);
        }

        // GET: odata/Customers(5)/child_customers
        [EnableQuery]
        public SingleResult<customer> Getchild_customers([FromODataUri] int key)
        {
            return SingleResult.Create(db.customers.Where(m => m.customer_id == key).Select(m => m.child_customers));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool customerExists(int key)
        {
            return db.customers.Count(e => e.customer_id == key) > 0;
        }
    }
}
