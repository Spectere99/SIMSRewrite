//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace SIMSReporting
{
    using System;
    using System.Collections.Generic;
    
    public partial class vw_order_quantities
    {
        public int order_id { get; set; }
        public string order_number { get; set; }
        public string order_type { get; set; }
        public Nullable<System.DateTime> order_date { get; set; }
        public Nullable<System.DateTime> order_due_date { get; set; }
        public string total { get; set; }
        public string customer_name { get; set; }
        public Nullable<decimal> TOTAL_QTY { get; set; }
        public string order_type_desc { get; set; }
    }
}
