using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.IO;
using System.Net.Http;
using System.Web.Http;
using SIMSDataService.Models;
using SIMSEntities;

namespace SIMSDataService.Controllers
{
    public class DocumentController : ApiController
    {
        private simsEntities db = new simsEntities();

        public HttpResponseMessage Post(CorrespondenceModel corresp)
        {
            if (ModelState.IsValid)
            {
                //Get the orderNumber from the header.  With this, we can prefix the name of the file and save it
                string saveFolder = System.Configuration.ConfigurationManager.AppSettings["DocumentFolder"];
                HttpResponseMessage result = null;

                SIMSEntities.correspondence newCorr = db.correspondences.Create();
                newCorr.corr_date = corresp.CorrDate;
                newCorr.corr_disp = corresp.CorrDisp;
                newCorr.corr_type = corresp.CorrType;
                newCorr.order_id = corresp.OrderId;
                newCorr.user_id = corresp.UserId;
                newCorr.customer_id = corresp.CustomerId;
                newCorr.correspondence_id = 0;

                db.correspondences.Add(newCorr);

                db.SaveChanges();

                var postedFile = "invoi" + newCorr.correspondence_id + ".pdf";

                newCorr.corr_filename = saveFolder + @"\" + postedFile;

                db.SaveChanges();

                if (!System.IO.Directory.Exists(HttpContext.Current.Server.MapPath("~/" + saveFolder + "/")))
                {
                    System.IO.Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/" + saveFolder + "/"));
                }
                var filePath = HttpContext.Current.Server.MapPath("~/" + saveFolder + "/" + postedFile);

                var streamArray = corresp.FileStream.Split(',');

                byte[] docBytes = Convert.FromBase64String(streamArray[1]);

                File.WriteAllBytes(filePath, docBytes);

                result = Request.CreateResponse(HttpStatusCode.OK, newCorr.corr_filename);

                return result;
            }
            
           
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }
        
    }
}
