
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

    public Nullable<long> xsmall_qty { get; set; }

    public Nullable<long> small_qty { get; set; }

    public Nullable<long> med_qty { get; set; }

    public Nullable<long> large_qty { get; set; }

    public Nullable<long> xl_qty { get; set; }

    public Nullable<long> C2xl_qty { get; set; }

    public Nullable<long> C3xl_qty { get; set; }

    public Nullable<long> C4xl_qty { get; set; }

    public Nullable<long> C5xl_qty { get; set; }

    public string other1_type { get; set; }

    public Nullable<long> other1_qty { get; set; }

    public string other2_type { get; set; }

    public Nullable<long> other2_qty { get; set; }

    public string other3_type { get; set; }

    public Nullable<long> other3_qty { get; set; }

    public string order_number { get; set; }

    public string customer_name { get; set; }

    public Nullable<System.DateTime> garment_order_date { get; set; }

    public Nullable<System.DateTime> garment_recvd_date { get; set; }



    public virtual order order { get; set; }

}

}
