using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.IO;
using System.Net.Http;
using System.Web.Http;
using SIMSEntities;

namespace SIMSDataService.Controllers
{
    public class ArtFileController : ApiController
    {
        private simsEntities db = new simsEntities();

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

                    //Save file record to database

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
        public HttpResponseMessage Put(order_art_file orderArtFile)
        {
            HttpResponseMessage result = null;

            if (orderArtFile.order_art_id < 0)  // Insert
            {
                orderArtFile.order_art_id = 0;
                db.order_art_file.Add(orderArtFile);
                db.SaveChanges();
                result = Request.CreateResponse(HttpStatusCode.OK, orderArtFile);
            } else // Must be an update
            {
                var artFile = db.order_art_file.Find(orderArtFile.order_art_id);
                if (artFile != null)
                {
                    artFile = orderArtFile;
                    db.SaveChanges();
                }
            }

            return result;
        }
        public HttpResponseMessage Delete(int id)
        {
            string deleteFromFolder = System.Configuration.ConfigurationManager.AppSettings["ArtFileFolder"];

            order_art_file orderArtFile = db.order_art_file.Find(id);
            try
            {
                if (orderArtFile == null)
                {
                    if (File.Exists(HttpContext.Current.Server.MapPath("~/"+ deleteFromFolder + "/" + orderArtFile.image_file)))
                    {
                        File.Delete(HttpContext.Current.Server.MapPath("~/" + deleteFromFolder + "/" + orderArtFile.image_file));
                        return Request.CreateResponse(HttpStatusCode.OK, id);
                    }
                    return Request.CreateResponse(HttpStatusCode.NotFound, id);
                }
            
                db.order_art_file.Remove(orderArtFile);
                db.SaveChanges();

                if (File.Exists(HttpContext.Current.Server.MapPath("~/" + deleteFromFolder + "/" + orderArtFile.image_file)))
                {
                    File.Delete(HttpContext.Current.Server.MapPath("~/" + deleteFromFolder + "/" + orderArtFile.image_file));
                    return Request.CreateResponse(HttpStatusCode.OK, id);
                }

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, id);
        }
    }
}
