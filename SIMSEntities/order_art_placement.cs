//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace SIMSEntities
{
    using System;
    using System.Collections.Generic;
    
    public partial class order_art_placement
    {
        public int order_art_placement_id { get; set; }
        public Nullable<int> order_id { get; set; }
        public string art_placement_code { get; set; }
        public string added_by { get; set; }
        public Nullable<System.DateTime> added_date { get; set; }
        public string colors { get; set; }
        public string color_codes { get; set; }
        public string notes { get; set; }
    
        public virtual order order { get; set; }
    }
}
