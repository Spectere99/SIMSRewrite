
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
    
public partial class customer_person
{

    public int customer_person_id { get; set; }

    public Nullable<int> customer_id { get; set; }

    public Nullable<System.DateTime> setup_date { get; set; }

    public string person_type { get; set; }

    public string first_name { get; set; }

    public string last_name { get; set; }

    public string email_address { get; set; }

    public string address_1 { get; set; }

    public string address_2 { get; set; }

    public string city { get; set; }

    public string state { get; set; }

    public string zip { get; set; }

    public string country { get; set; }

    public string phone_1 { get; set; }

    public string phone_1_type { get; set; }

    public string phone_2 { get; set; }

    public string phone_2_type { get; set; }

    public string ccnum { get; set; }

    public Nullable<System.DateTime> ccexp_date { get; set; }

    public string ccverfcode { get; set; }

    public string phone_1_ext { get; set; }

    public string phone_2_ext { get; set; }



    public virtual customer customers { get; set; }

}

}
