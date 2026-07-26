using BaseController.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using UserManagementDataLayer;
using UserManagementRole;
using UserManagementRole.Models;
using UserRoleManagement.Dto;
using UserRoleManagement.Interfaces;
using UserRoleManagement.Repository;

namespace UserRoleManagement.Controllers;

[Route("api/[controller]")]
[ApiController]

public class UserController : BaseController<User, UserDto>
{
    private readonly InterUserRep _userRepository;
    public UserController(InterUserRep userRepository, UserManagementContext context)
        : base(userRepository, context){
        _userRepository = userRepository;
    }

    [ProducesResponseType(200, Type = typeof(ICollection<User>))]
    [HttpGet("GetAll")]
    public override IActionResult GetAll()
    {
        var users = _userRepository.GetAll();
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        return Ok(users);
    }

    [HttpGet("GetById")]
    [ProducesResponseType(200, Type = typeof(User))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public override IActionResult GetById( int id)
    {
        if (!_userRepository.UserExists(id))
            return NotFound();

        var user = _userRepository.GetById(id);
        if (user == null)
            return NotFound();

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        return Ok(user);
    }


    [HttpGet("GetIdByEmail")]
    [ProducesResponseType(200, Type = typeof(User))]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult GetUserid(string email)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);     
        
        User? user = _context.Users.FirstOrDefault(u => u.Email == email);

        if (user == null)
            return NotFound($"User with email {email} not found.");

        return Ok(user.Id);
    }
    
    [HttpGet("Me")]
    public IActionResult GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = _context.Users.Find(int.Parse(userId));
        return Ok(new { user.Id, user.Email });
    }

    [HttpPost("Create")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [Authorize(Roles = "Admin")]
    public override IActionResult Create([FromBody] UserDto userCreate)
    {
        if (userCreate == null)
            return BadRequest();

        if (!_userRepository.Create(userCreate))
            return StatusCode(500, "Something went wrong while saving the user");

        return Ok("User created successfully");
    }

    [HttpPut("UpdateUser")]
    [Authorize(Roles = "Admin")]
    public override async Task<IActionResult> Update(UserDto user)
    {
        User? currentUser = await _context.Users.FindAsync(user.Id);
        if (currentUser == null)
            return NotFound($"User with ID {user.Id} not found.");
        currentUser.Name = user.Name;
        currentUser.Email = user.email;
        currentUser.CreationDate = user.CreationDate;
        await _context.SaveChangesAsync();
        return NoContent();

    }

    [HttpPut("UpdatePassword")]
    [ProducesResponseType(400)]
    [ProducesResponseType(204)]
    public async Task<IActionResult> UpdatePassword(int id, string Password)
    {
        if (Password == null)
            return BadRequest("Password is null");
        User? user = await _context.Users.FindAsync(id);
        if (!_userRepository.UpdatePass(user, Password))
            return StatusCode(500, "Something went wrong while saving the user");
        await _context.SaveChangesAsync();
        return NoContent();

    }

    [HttpDelete("DeleteUserId")]
    [ProducesResponseType(400)]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    [Authorize(Roles = "Admin")]
    public override IActionResult Delete(int Id)
    {
        User? UserToDelete = _context.Users.Find(Id);

        if (UserToDelete == null)
            return NotFound($"User with id {Id} not found.");

        var userRoles = _context.UserRoles.Where(ur => ur.UserId == Id).ToList();
        _context.UserRoles.RemoveRange(userRoles);

        _context.Users.Remove(UserToDelete!);
        _context.SaveChanges();

        return NoContent();
    }




}
