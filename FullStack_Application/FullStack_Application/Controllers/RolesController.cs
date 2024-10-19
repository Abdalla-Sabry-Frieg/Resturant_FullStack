using Entities.DTOs;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class RolesController : ControllerBase
{
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<ApplicationUser> _userManager;

    public RolesController(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
    {
        _roleManager = roleManager;
        _userManager = userManager;
    }

    // Get all roles
    [HttpGet("all")]
    public IActionResult GetAllRoles()
    {
        var roles = _roleManager.Roles.ToList();
        return Ok(roles);
    }

    // Create a new role
    [HttpPost("create")]
    public async Task<IActionResult> CreateRole([FromBody] string roleName)
    {
        if (string.IsNullOrEmpty(roleName)) return BadRequest("Role name cannot be empty.");

        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (roleExists) return BadRequest("Role already exists.");

        var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
        if (!result.Succeeded) return BadRequest(result.Errors);

        return Ok($"Role {roleName} created successfully.");
    }

    // Update role
    [HttpPut("update")]
    public async Task<IActionResult> UpdateRole([FromBody] RoleUpdateDto model)
    {
        var role = await _roleManager.FindByIdAsync(model.RoleId);
        if (role == null) return NotFound("Role not found.");

        role.Name = model.NewRoleName;
        var result = await _roleManager.UpdateAsync(role);
        if (!result.Succeeded) return BadRequest(result.Errors);

        return Ok($"Role {model.NewRoleName} updated successfully.");
    }


    // Assign role to a user
    [HttpPost("assign")]
    public async Task<IActionResult> AssignRoleToUser([FromBody] UserRoleDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null) return NotFound("User not found.");

        var result = await _userManager.AddToRoleAsync(user, model.Role);
        if (!result.Succeeded) return BadRequest(result.Errors);

        return Ok($"Role {model.Role} assigned to {user.UserName}.");
    }

    // Remove role from a user
    [HttpPost("remove-role")]
    public async Task<IActionResult> RemoveRoleFromUser([FromBody] UserRoleDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null) return NotFound("User not found.");

        var result = await _userManager.RemoveFromRoleAsync(user, model.Role);
        if (!result.Succeeded) return BadRequest(result.Errors);

        return Ok($"Role {model.Role} removed from {user.UserName}.");
    }

    // Delete a role
    [HttpDelete("delete/{roleName}")]
    public async Task<IActionResult> DeleteRole(string roleName)
    {
        var role = await _roleManager.FindByNameAsync(roleName);
        if (role == null) return NotFound("Role not found.");

        var result = await _roleManager.DeleteAsync(role);
        if (!result.Succeeded) return BadRequest(result.Errors);

        return Ok($"Role {roleName} deleted successfully.");
    }
}
