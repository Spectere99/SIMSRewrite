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
    
    public partial class order_task
    {
        public int order_id { get; set; }
        public string task_code { get; set; }
        public Nullable<int> order_by { get; set; }
        public string is_complete { get; set; }
        public string completed_by { get; set; }
        public Nullable<System.DateTime> completed_date { get; set; }
    
        public virtual order order { get; set; }
        public virtual vw_order_info vw_order_info { get; set; }
    }
}
