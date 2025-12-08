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

namespace UserRoleManagement.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRoleController : ControllerBase
    {
        private readonly InterUserRoleRep _userRoleRepository;
        UserManagementContext _context;

        public UserRoleController(InterUserRoleRep userRoleRepository, UserManagementContext context)
        {
            _context = context;
            _userRoleRepository = userRoleRepository;
        }
        [ProducesResponseType(200, Type = typeof(IEnumerable<UserRole>))]
        [HttpGet("GetRolesForUser")]
        public async Task<IActionResult> GetRolesForUser(int userId)
        {
            var roles = await _userRoleRepository.GetRolesForUser(userId);
            if (roles == null)
                return NotFound("No roles found for this user.");
            return Ok(roles);
        }
        
        [HttpPost("EmployUser")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [Authorize(Roles = "Admin")]
        public IActionResult AddRoleToUser(int userId, int roleId)
        {
            _userRoleRepository.AddRoleToUser(userId, roleId);
            return Ok("Role Added to User successfully");
        }

        [HttpDelete("DeleteRoleForUser")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteRoleForUser(int userId, int roleId)
        {
            await _userRoleRepository.RemoveRoleForUser(userId, roleId);
            return Ok($"Role Removed for User {userId}");
        }

        [HttpPost("AssignDefaultToUsers")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> AssignDefaultToUsers()
        {
            await _userRoleRepository.AssignDefaultToUsers();
            return Ok("All users with no roles now have role 'User'");
        }

    }
}
