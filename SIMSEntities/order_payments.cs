
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
    
public partial class order_payments
{

    public int order_payment_id { get; set; }

    public Nullable<int> order_id { get; set; }

    public Nullable<System.DateTime> payment_date { get; set; }

    public string payment_type_code { get; set; }

    public string check_number { get; set; }

    public string payment_amount { get; set; }

    public Nullable<int> entered_user_id { get; set; }

}

}
