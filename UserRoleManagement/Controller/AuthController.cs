using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserManagementDataLayer;
using UserRoleManagement.Dto;

namespace UserRoleManagement.Controller
{      
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly TokenGenerator _tokenGenerator;
        private readonly UserManagementContext _context;
        private readonly UserService userService = new UserService();
        public AuthController(TokenGenerator tokenGenerator, UserManagementContext context)
        {
            _tokenGenerator = tokenGenerator;
            _context = context;
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequestDto request)
        {
            try
            {
                var user = _context.Users.Include(u => u.UserRole)
                    .ThenInclude(ur => ur.Role).FirstOrDefault(u => u.Email == request.email);

                if (user == null || userService.VerifyPassword(user.PasswordHash, request.Password) == false)
                {
                    return Unauthorized(new { Message = "Invalid email or password" });
                }
                string token = _tokenGenerator.GenerateToken(user);
                return Ok(new { Token = token, Message = "Login successful!"});
            }
            catch(Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred during login.", Details = ex.Message });
            }

        }

    }
}
