
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
    
public partial class customer
{

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
    public customer()
    {

        this.customer_address = new HashSet<customer_address>();

        this.orders = new HashSet<order>();

        this.correspondence = new HashSet<correspondence>();

        this.customer_person = new HashSet<customer_person>();

        this.parent = new HashSet<customer>();

    }


    public int customer_id { get; set; }

    public string customer_name { get; set; }

    public Nullable<System.DateTime> setup_date { get; set; }

    public Nullable<int> setup_by { get; set; }

    public string status_code { get; set; }

    public string ship_to_bill_ind { get; set; }

    public string website_url { get; set; }

    public string account_number { get; set; }

    public string override_validation_ind { get; set; }

    public Nullable<int> parent_id { get; set; }

    public string parent_ind { get; set; }



    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]

    public virtual ICollection<customer_address> customer_address { get; set; }

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]

    public virtual ICollection<order> orders { get; set; }

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]

    public virtual ICollection<correspondence> correspondence { get; set; }

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]

    public virtual ICollection<customer_person> customer_person { get; set; }

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]

    public virtual ICollection<customer> parent { get; set; }

    public virtual customer child_customers { get; set; }

}

}
