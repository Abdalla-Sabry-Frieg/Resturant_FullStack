using Entities.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.DataBase
{
    public class RestaurantDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Meal> Meals { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<TableBooking> TableBookings { get; set; }
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<PaymentDetail> PaymentDetails { get; set; }

        public RestaurantDbContext(DbContextOptions<RestaurantDbContext> options) : base(options)
        {
        }


    }
}
