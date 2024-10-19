using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Entities.Models;
using Infrastructure.IRepository;
using Entities.DTOs;
using System.Security.Claims;
using Infrastructure.Immplmintation;
using NuGet.Versioning;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class TableBookingController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TableBookingController(IUnitOfWork unitOfWork , IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpGet("user-bookings")]
    public async Task<IActionResult> GetUserBookings()
    {
        var userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized(new { message = "User is not logged in" });
        }

        var userBookings = await _unitOfWork.TableBookings
            .GetAllAsync(tb => tb.UserId == userId, includeWord: "Branch,Meals");

        var bookingsDto = userBookings.Select(tb => new TableBookingViewDto
        {
            Id = tb.Id,
            BookingDate = tb.BookingDate,
            FirstName = tb.fristName,
            PhoneNumber = tb.Phonenumber,
            TotalPrice = tb.TotalPrice,
            BranchName = tb.Branch.BranchName,
            NumberOfGuests = tb.NumberOfGuests,
            Meals = tb.Meals.Select(m => m.Name).ToList()  // Map meal names
        }).ToList();

        return Ok(bookingsDto);
    }



    [HttpGet("count")]
    public async Task<IActionResult> GetOrderCount()
    {
        var userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized(new { message = "User is not logged in" });
        }

        var bookings = await _unitOfWork.TableBookings.GetAllAsync(tb => tb.UserId == userId);

        var count = bookings.Count();

        // Return the count wrapped in an object
        return Ok(new { orderCount = count });
    }


    // Get all bookings
    [HttpGet("getAllBooking")]
    public async Task<IActionResult> GetBookings()
    {
        var bookings = await _unitOfWork.TableBookings.GetAllAsync(includeWord: "User,Branch,Meals");  // Include related entities

        // Map to DTOs
        var bookingDtos = bookings.Select(booking => new TableBookingViewDto
        {
            Id = booking.Id,
            BookingDate = booking.BookingDate,
            FirstName = booking.User?.FirstName ?? "N/A",  // Get first name from ApplicationUser
            PhoneNumber = booking.Phonenumber,
            TotalPrice = booking.TotalPrice,
            BranchName = booking.Branch?.BranchName ?? "Unknown",  // Get branch name
            NumberOfGuests = booking.NumberOfGuests,
            Meals = booking.Meals.Select(meal => meal.Name).ToList()  // List of meal names
        }).ToList();

        return Ok(bookingDtos);
    }

    // GET: api/bookings/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetBookingById(int id)
    {
        var booking =  _unitOfWork.TableBookings.GetFirstOrDefualt(x=>x.Id == id , includeWord: "User,Branch,Meals");
        if (booking == null)
        {
            return NotFound();
        }
        var bookingDtos = new TableBookingViewDto
        {
            Id = booking.Id,
            BookingDate = booking.BookingDate,
            FirstName = booking.User?.FirstName ?? "N/A",  // Get first name from ApplicationUser
            PhoneNumber = booking.Phonenumber,
            TotalPrice = booking.TotalPrice,
            BranchName = booking.Branch?.BranchName ?? "Unknown",  // Get branch name
            NumberOfGuests = booking.NumberOfGuests,
            Meals = booking.Meals.Select(meal => meal.Name).ToList() , // List of meal names
            
        };

        return Ok(bookingDtos);

    }

    // Get all branches (for user selection in frontend)
    [HttpGet("branches")]
    public async Task<IActionResult> GetBranchNames()
    {
        var branches = await _unitOfWork.Branches.GetAllAsync();

        return Ok(branches.Select(b => new BranchDto { Id = b.Id, Name = b.BranchName }));

    }

    [HttpGet("meals")]
    public async Task<IActionResult> GetMeals()
    {
        var meals = await _unitOfWork.Meals.GetAllAsync();
        return Ok(meals.Select(m => new MealDto { Id = m.Id, Name = m.Name, Price = m.Price }));
    }

    // Create a new booking
    [HttpPost("create-booking")]
    [Authorize]  // Only authorized users can book a table
    public async Task<IActionResult> CreateBooking([FromBody] TableBookingDto bookingDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Retrieve the UserId from the JWT token claims
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not found.");

        // Fetching meals based on a list of meal IDs selected by the user
        var meals = await _unitOfWork.Meals.GetAllAsync(x=> bookingDto.SelectedMealIds.Contains(x.Id));
        if (meals == null || meals.Count() == 0) return BadRequest("Invalid meals selected.");

        var count = _unitOfWork.TableBookings
             .GetAllAsync(tb => tb.UserId == userId).Result.Count()+1;

        var booking = new TableBooking
        {
            UserId = userId,
            BranchId = bookingDto.BranchId,
            NumberOfGuests = bookingDto.NumberOfGuests,
            BookingDate = bookingDto.BookingDate,
            Phonenumber = bookingDto.PhoneNumber,
            Meals = meals.ToList(),
            fristName = bookingDto.firstName,
            Count = count,

        };
        // Calculate the total price of the selected meals
        booking.TotalPrice = meals.Sum(m => m.Price);

        await _unitOfWork.TableBookings.AddAsync(booking);
        await _unitOfWork.CompleteAsync();

        // Return a JSON response
        return Ok(new { message = "Order placed successfully."  , id = booking.Id});
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")] // Admin
    public async Task<IActionResult> RemoveBooking(int id)
    {
        var book = await _unitOfWork.TableBookings.GetByIdAsync(id);

        if(book == null)
        {
            BadRequest("this booking is no't founded");
        }

        _unitOfWork.TableBookings.Remove(book);
       await _unitOfWork.CompleteAsync();

        return NoContent();
    }
}
