using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.DTOs
{
    public class TableBookingViewDto
    {
        public int Id { get; set; }
        public DateTime BookingDate { get; set; }
        public string FirstName { get; set; }  // Extracted from ApplicationUser
        public string PhoneNumber { get; set; }
        public decimal TotalPrice { get; set; }
        public string BranchName { get; set; }  // Extracted from Branch
        public int NumberOfGuests { get; set; }
        public List<string> Meals { get; set; }  // List of meal names
    }
}
