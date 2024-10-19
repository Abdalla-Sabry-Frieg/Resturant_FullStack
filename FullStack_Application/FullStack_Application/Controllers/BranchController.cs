using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Entities.Models;
using Infrastructure.IRepository;
using Entities.DTOs;

[ApiController]
[Route("api/[controller]")]
public class BranchController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public BranchController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    // Get all branches
    [HttpGet]
    public async Task<IActionResult> GetBranches()
    {
        var branches = await _unitOfWork.Branches.GetAllAsync();
        var branchDto = branches.Select(b => new BranchDto
        {
            Name = b.BranchName,
            Id = b.Id
            
        });
        return Ok(branchDto);
    }

    // Get branch by id
    [HttpGet("{id}")]
    public async Task<IActionResult> GetBranch(int id)
    {
        var branch = await _unitOfWork.Branches.GetByIdAsync(id);
        if (branch == null)
            return NotFound();

        //var branchDto =  new BranchDto
        //{
        //    Name = branch.BranchName // mapping with the class and return the value to angular
        //};

        return Ok(branch);
    }

    // Create a new branch
    [HttpPost]
    [Authorize(Roles = "Admin")]  // Only admin can add branches
    public async Task<IActionResult> CreateBranch([FromBody] BranchDto branchDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var branch = new Branch
        {
            BranchName = branchDto.Name
            
        };

        await _unitOfWork.Branches.AddAsync(branch);
        await _unitOfWork.CompleteAsync();

        // Return the branch object with its `id` after creation
        return CreatedAtAction(nameof(GetBranch), new { id = branch.Id }, branch);
    }

    // Update a branch
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateBranch(int id, [FromBody] BranchDto branchDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var branch = await _unitOfWork.Branches.GetByIdAsync(id);
        if (branch == null)
            return NotFound();

        branch.BranchName = branchDto.Name;
       

        _unitOfWork.Branches.Update(branch);
        await _unitOfWork.CompleteAsync();

        return NoContent();
    }

    // Delete a branch
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")] // Admin
    public async Task<IActionResult> DeleteBranch(int id)
    {
        var branch = await _unitOfWork.Branches.GetByIdAsync(id);
        if (branch == null)
            return NotFound();

        _unitOfWork.Branches.Remove(branch);
        await _unitOfWork.CompleteAsync();

        return NoContent();
    }
}
