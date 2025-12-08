using BaseController.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserManagementDataLayer;
using UserManagementRole.Models;
using UserRoleManagement.Dto;
using UserRoleManagement.Interfaces;
using UserRoleManagement.Repository;

namespace UserRoleManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : BaseController<Role, RoleDto>
    {
        private readonly InterRoleRep _roleRepository;
        public RoleController(InterRoleRep roleRepository, UserManagementContext context)
        : base(roleRepository, context) {
            _roleRepository = roleRepository;
        }

        [HttpGet("GetAll")]
        [ProducesResponseType(200, Type = typeof(ICollection<Role>))]
        public override IActionResult GetAll()
        {
            var roles = _roleRepository.GetAll();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(roles);
        }

        [HttpGet("GetRoleByEmail")]
        [ProducesResponseType(200, Type = typeof(List<Role>))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetRoleByEmail(string email)
        {
            try
            {
                List<Role> role = await _roleRepository.GetUserRole(email);

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                return Ok(role);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("GetRoleId")]
        [ProducesResponseType(200, Type = typeof(Role))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public override IActionResult GetById(int id)
        {
            var role = _roleRepository.GetById(id);
            if (role == null) return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(role);
        }

        [HttpPost("Create")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public override IActionResult Create([FromBody] RoleDto roleCreate)
        {
            if (roleCreate == null)
                return BadRequest();

            if (!_roleRepository.Create(roleCreate))
                return StatusCode(500, "Something went wrong while saving the role");

            return Ok("Role created successfully");
        }

        [HttpPut("update")]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [Authorize(Roles = "Admin")]
        public override async Task<IActionResult> Update(RoleDto roleUpdate)
        {
            Role? currentRole = await _context.Roles.FindAsync(roleUpdate.Id);
            if (currentRole==null)
                return NotFound($"role with ID {roleUpdate.Id} not found.");
            else if (roleUpdate.RoleName != null)
            { 
                currentRole.RoleName = roleUpdate.RoleName;
            }
               
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("Delete")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [Authorize(Roles = "Admin")]
        public override IActionResult Delete(int Id)
        {
            Role? RoleToDelete = _context.Roles.Find(Id);
            if (RoleToDelete == null)
                return NotFound($"User with id {Id} not found.");
            _context.Roles.Remove(RoleToDelete!);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
