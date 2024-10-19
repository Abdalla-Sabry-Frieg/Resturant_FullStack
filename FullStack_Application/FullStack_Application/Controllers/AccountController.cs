using Entities.DTOs;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly RoleManager<IdentityRole> _roleManager;

    public AccountsController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,
                IConfiguration configuration , RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _roleManager = roleManager;
    }

    // POST: api/accounts/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = new ApplicationUser
        {
            UserName = registerDto.Email,
            Email = registerDto.Email,
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            PhoneNumber = registerDto.PhoneNumber
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        // Ensure the Admin role exists
        if (!await _roleManager.RoleExistsAsync("Admin"))
        {
            await _roleManager.CreateAsync(new IdentityRole("Admin"));
        }

        // Assign "Admin" role to the new user
        await _userManager.AddToRoleAsync(user, "Admin");

        return Ok(new { message = "User registered successfully and assigned Admin role." });
    }

    // GET: api/accounts/users
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = _userManager.Users.ToList();
        var userList = new List<UserDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userList.Add(new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber= user.PhoneNumber,
                Roles = roles
            });
        }

        return Ok(userList);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
     {
        // Find user by email
        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user == null) return Unauthorized("Invalid email or password.");

        // Check password validity
        var result = await _signInManager.PasswordSignInAsync(user.UserName, loginDto.Password, false, false);
        if (!result.Succeeded) return Unauthorized("Invalid login attempt.");

        // Log the roles for debugging
     //   _logger.LogInformation("Roles for user {Email}: {Roles}", user.Email, string.Join(", ", roles));

        // Get the roles of the user
        var roles = await _userManager.GetRolesAsync(user);

        // Generate the token with roles in claims
        var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Unique identifier for the token
    };

        // Add roles as claims
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role.ToString()));
        }

        // Define the signing key
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Define token expiration (e.g., 10 hours from now)
        var expirationTime = DateTime.UtcNow.AddHours(10);

        // Create the JWT token
        var token = new JwtSecurityToken(
            claims: claims,
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            expires: expirationTime,
            signingCredentials: creds
        );

        // Return the token and expiration time
        return Ok(new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token),
            expiration = token.ValidTo ,         // Return expiration date to the client
            role = roles,
            userName = user.FirstName
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        // This will sign out the user from the Identity system (if using cookies, session, etc.)
        await _signInManager.SignOutAsync();

        // Since JWT tokens are stateless, you just inform the client to remove the token
        return Ok(new { message = "User logged out successfully." });
    }


    // DELETE: api/accounts/delete/{id}
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        if (string.IsNullOrEmpty(id))
        {
            return BadRequest("User ID cannot be empty.");
        }

        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok(new { message = "User deleted successfully." });
    }

}
