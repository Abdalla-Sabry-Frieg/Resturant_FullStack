using Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Threading.Tasks;

public class RoleLoadingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly UserManager<ApplicationUser> _userManager;

    public RoleLoadingMiddleware(RequestDelegate next, UserManager<ApplicationUser> userManager)
    {
        _next = next;
        _userManager = userManager;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Check if the user is authenticated
        if (context.User.Identity.IsAuthenticated)
        {
            // Get user ID from claims
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                // Find the user and load their roles
                var user = await _userManager.FindByIdAsync(userId);
                if (user != null)
                {
                    var roles = await _userManager.GetRolesAsync(user);

                    // Add roles to claims
                    var claimsIdentity = (ClaimsIdentity)context.User.Identity;
                    foreach (var role in roles)
                    {
                        if (!claimsIdentity.HasClaim(c => c.Type == ClaimTypes.Role && c.Value == role))
                        {
                            claimsIdentity.AddClaim(new Claim(ClaimTypes.Role, role));
                        }
                    }
                }
            }
        }

        // Call the next middleware in the pipeline
        await _next(context);
    }
}
