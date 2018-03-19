using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SIMSReporting;

namespace SIMSDataService.Controllers
{
    public class ReportingController : ApiController
    {
        ReportingEntities db = new ReportingEntities();

        // GET: api/Reporting
        public IHttpActionResult Get(HttpRequestMessage request)
        {
            var headers = request.Headers;
            //Check the request object to see if they passed a userId
            if (headers.Contains("orderDate"))
            {
                var orderDateVar = DateTime.Parse(headers.GetValues("orderDate").First());
                var returnValue = db.order_rpt.Where(p => p.order_date == orderDateVar);

                return Ok(returnValue);
            }

            return BadRequest();
        }

        // GET: api/Reporting/5
        public string Get(int id)
        {
            return "value";
        }

    }
}
