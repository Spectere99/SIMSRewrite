﻿

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
using System.Data.Entity;
using System.Data.Entity.Infrastructure;


public partial class simsEntities : DbContext
{
    public simsEntities()
        : base("name=simsEntities")
    {

    }

    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    {
        throw new UnintentionalCodeFirstException();
    }


    public virtual DbSet<correspondence> correspondences { get; set; }

    public virtual DbSet<customer> customers { get; set; }

    public virtual DbSet<customer_address> customer_address { get; set; }

    public virtual DbSet<customer_notes> customer_notes { get; set; }

    public virtual DbSet<customer_person> customer_person { get; set; }

    public virtual DbSet<lookup_items> lookup_items { get; set; }

    public virtual DbSet<navigation> navigations { get; set; }

    public virtual DbSet<order_art_file> order_art_file { get; set; }

    public virtual DbSet<order_art_placement> order_art_placement { get; set; }

    public virtual DbSet<order_colors> order_colors { get; set; }

    public virtual DbSet<order_detail> order_detail { get; set; }

    public virtual DbSet<order_fees> order_fees { get; set; }

    public virtual DbSet<order_notes> order_notes { get; set; }

    public virtual DbSet<order_payments> order_payments { get; set; }

    public virtual DbSet<order_status_history> order_status_history { get; set; }

    public virtual DbSet<order_task> order_task { get; set; }

    public virtual DbSet<order> orders { get; set; }

    public virtual DbSet<pricelist> pricelists { get; set; }

    public virtual DbSet<task> tasks { get; set; }

    public virtual DbSet<user> users { get; set; }

}

}

