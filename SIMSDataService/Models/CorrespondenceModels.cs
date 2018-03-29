using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace SIMSDataService.Models
{
    public class CorrespondenceModel
    {
        [JsonProperty("correspondence_id")]
        public int Id { get; set; }
        [JsonProperty("customer_id")]
        public int CustomerId { get; set; }
        [JsonProperty("order_id")]
        public int OrderId { get; set; }
        [JsonProperty("corr_date")]
        public DateTime CorrDate { get; set; }
        [JsonProperty("corr_type")]
        public string CorrType { get; set; }
        [JsonProperty("corr_disp")]
        public string CorrDisp { get; set; }
        [JsonProperty("user_id")]
        public int UserId { get; set; }
        [JsonProperty("corr_filename")]
        public string CorrFileName { get; set; }
        [JsonProperty("file_stream")]
        public string FileStream { get; set; }


    }
}