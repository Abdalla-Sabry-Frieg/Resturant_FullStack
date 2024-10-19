using Entities.DTOs;
using Entities.Models;
using Infrastructure.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FullStack_Application.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MealController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork; 
        private readonly IWebHostEnvironment _env;

        public MealController(IUnitOfWork unitOfWork , IWebHostEnvironment env)
        {
            _unitOfWork = unitOfWork;
            _env = env;
        }

        // Get all meals
        [HttpGet]
        public async Task<IActionResult> GetMeals()
        {
            var meals = await _unitOfWork.Meals.GetAllAsync();

            return Ok(meals);
        }

        // Get meal by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMeal(int id)
        {
            var meal = await _unitOfWork.Meals.GetByIdAsync(id);
            if (meal == null)
                return NotFound();

            return Ok(meal);
        }

        // Create a new meal
        [HttpPost]
        [Authorize(Roles = "Admin")]  // Only admin can add meals
        public async Task<IActionResult> CreateMeal([FromForm] MealDto mealDto )
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Handle image upload logic here, for example saving the file
            // Handle image upload logic here
            if (mealDto.Image != null)
            { 
                var imagePath = Path.Combine(_env.WebRootPath, "uploads", mealDto.Image.FileName);

                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await mealDto.Image.CopyToAsync(stream);
                }
            }

            var meal = new Meal
            {
                Name = mealDto.Name,
                Price = mealDto.Price,
                Image = mealDto.Image != null ? $"/uploads/{mealDto.Image.FileName}" : null  // Store relative path to image

            };
           

            await _unitOfWork.Meals.AddAsync(meal);    
            await _unitOfWork.CompleteAsync();

            return CreatedAtAction(nameof(GetMeal), new { id = meal.Id }, meal);
        }

        // Update a meal
        [HttpPut("{id}")]
       [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateMeal(int id, [FromForm] MealDto mealDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var meal = await _unitOfWork.Meals.GetByIdAsync(id);
            if (meal == null)
                return NotFound();

            // Handle image upload logic here
            if (mealDto.Image != null)
            {
                var imagePath = Path.Combine(_env.WebRootPath, "uploads", mealDto.Image.FileName);
                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await mealDto.Image.CopyToAsync(stream);
                }
                meal.Image = $"uploads/{mealDto.Image.FileName}";
            }
           

            meal.Name = mealDto.Name;
            meal.Price = mealDto.Price;
        

            _unitOfWork.Meals.Update(meal);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // Delete a meal
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMeal(int id)
        {
            var meal = await _unitOfWork.Meals.GetByIdAsync(id);
            if (meal == null)
                return NotFound();

            _unitOfWork.Meals.Remove(meal);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}
