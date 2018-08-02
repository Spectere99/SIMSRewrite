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
    
    public partial class order_detail
    {
        public int order_detail_id { get; set; }
        public Nullable<int> order_id { get; set; }
        public string item_type { get; set; }
        public Nullable<int> item_line_number { get; set; }
        public Nullable<int> item_quantity { get; set; }
        public Nullable<int> pricelist_id { get; set; }
        public string style_code { get; set; }
        public string color_code { get; set; }
        public string size_code { get; set; }
        public string vendor { get; set; }
        public string manufacturer { get; set; }
        public string product_code { get; set; }
        public string item_price_each { get; set; }
        public string item_price_ext { get; set; }
        public string taxable_ind { get; set; }
        public string shipping_po { get; set; }
        public string notes { get; set; }
        public string checked_in_ind { get; set; }
        public string checked_out_ind { get; set; }
        public Nullable<int> xsmall_qty { get; set; }
        public Nullable<int> small_qty { get; set; }
        public Nullable<int> med_qty { get; set; }
        public Nullable<int> large_qty { get; set; }
        public Nullable<int> xl_qty { get; set; }
        public Nullable<int> C2xl_qty { get; set; }
        public Nullable<int> C3xl_qty { get; set; }
        public Nullable<int> C4xl_qty { get; set; }
        public Nullable<int> C5xl_qty { get; set; }
        public string other1_type { get; set; }
        public Nullable<int> other1_qty { get; set; }
        public string other2_type { get; set; }
        public Nullable<int> other2_qty { get; set; }
        public string other3_type { get; set; }
        public Nullable<int> other3_qty { get; set; }
        public string order_number { get; set; }
        public string customer_name { get; set; }
        public Nullable<System.DateTime> garment_order_date { get; set; }
        public Nullable<System.DateTime> garment_recvd_date { get; set; }
    
        public virtual order order { get; set; }
        public virtual pricelist pricelists { get; set; }
    }
}
