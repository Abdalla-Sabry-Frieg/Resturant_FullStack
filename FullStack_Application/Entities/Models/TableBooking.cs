using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class TableBooking
    {
        public int Id { get; set; }
        public DateTime BookingDate { get; set; } = DateTime.Now;
        public int NumberOfGuests { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public string Phonenumber { get; set; }
        public decimal TotalPrice { get; set; }
        public string? fristName { get; set; }
     
        public int BranchId { get; set; }
        public Branch? Branch { get; set; }
        public List<Meal>? Meals { get; set; } = new List<Meal>();
        public int Count { get; set; } = 0;

    }
}
