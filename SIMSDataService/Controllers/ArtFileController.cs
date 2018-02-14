using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Net.Http;
using System.Web.Http;

namespace SIMSDataService.Controllers
{
    public class ArtFileController : ApiController
    {
        public HttpResponseMessage Post()
        {
            //Get the orderNumber from the header.  With this, we can prefix the name of the file and save it
            string saveFolder = System.Configuration.ConfigurationManager.AppSettings["ArtFileFolder"];
            HttpResponseMessage result = null;

            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count > 0)
            {
                var docfiles = new List<string>();

                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    if (!System.IO.Directory.Exists(HttpContext.Current.Server.MapPath("~/" + saveFolder + "/")))
                    {
                        System.IO.Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + saveFolder + "/"));
                    }
                    var filePath = HttpContext.Current.Server.MapPath("~/" + saveFolder + "/" + postedFile.FileName);
                    //var filePath = saveFolder + postedFile.FileName;
                    postedFile.SaveAs(filePath);

                    docfiles.Add(filePath);
                }
                result = Request.CreateResponse(HttpStatusCode.Created, docfiles);
            }
            else
            {
                result = Request.CreateResponse(HttpStatusCode.BadRequest);
            }
            return result;
        }
}
}
