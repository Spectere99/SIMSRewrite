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
    
    public partial class order_fees
    {
        public int order_fee_id { get; set; }
        public Nullable<int> order_id { get; set; }
        public Nullable<int> fee_line_number { get; set; }
        public Nullable<int> fee_quantity { get; set; }
        public Nullable<int> pricelist_id { get; set; }
        public string fee_price_each { get; set; }
        public string fee_price_ext { get; set; }
        public string taxable_ind { get; set; }
        public string notes { get; set; }
    }
}
