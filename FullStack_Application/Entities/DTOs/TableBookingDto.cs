using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.DTOs  
{
    public class TableBookingDto
    {
        public int id { get; set; }
        public int BranchId { get; set; }  // Selected Branch ID
        public int NumberOfGuests { get; set; }  // Number of guests for the booking
        public string PhoneNumber { get; set; }
        public DateTime BookingDate { get; set; } = DateTime.Now;  // The date and time of the booking
        public List<int>? SelectedMealIds { get; set; }  // IDs of selected meals
        public string? firstName { get; set; }

        // This property calculates the total price of the selected meals
        public decimal TotalPrice { get; set; }
        public int Count { get; set; }= 0;


    }
}
