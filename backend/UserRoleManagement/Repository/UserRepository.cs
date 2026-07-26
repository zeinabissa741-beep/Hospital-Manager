using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using UserManagementDataLayer;
using UserManagementRole.Models;
using UserRoleManagement.Dto;
using UserRoleManagement.Interfaces;

namespace UserRoleManagement.Repository
{
    public class UserRepository : BaseRepository<User, UserDto> ,InterUserRep
    {
        //private readonly UserManagementContext _context;

        public UserRepository(UserManagementContext context) : base(context)
        {
            _context = context;
        }
        public override bool Create(UserDto userDto)
        {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.PasswordHash);
            User user = new User
            {
                Name = userDto.Name,
                Email = userDto.email,
                PasswordHash = hashedPassword,
                CreationDate = userDto.CreationDate,
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            Role? defaultRole = _context.Roles.FirstOrDefault(p => p.RoleName == "User");
            _context.UserRoles.Add(new UserRole
            {
                UserId = userDto.Id,
                RoleId = defaultRole.Id,
                Role = defaultRole,
                User = user,
            });
            
            return _context.SaveChanges() > 0;

        }


        public override User GetById(int id)
        {
            return _context.Users.FirstOrDefault(p => p.Id == id) ?? new User();
        }
        public override User Get(string name)
        {
            User? user = _context.Users.FirstOrDefault(p => p.Name == name);
            if (user == null)
                throw new KeyNotFoundException($"User with Name '{name}' not found.");
            return user;
        }
        public async Task<int> GetUserByEmail(string email)
        {
            int userId = await _context.Users.Where(u => u.Email == email).Select(u => u.Id).FirstOrDefaultAsync();
            if (userId == null)
                throw new KeyNotFoundException($"User with Salary '{email}' not found.");
            return userId;
        }
        public override ICollection<User> GetAll()
        {
            return _context.Users.OrderBy(p => p.Id).ToList();
        }
        public bool UserExists(int userId)
        {
            return _context.Users.Any(p => p.Id == userId);
        }
        
        public bool UpdatePass(User user, string Password)
        {
            string passHash = BCrypt.Net.BCrypt.HashPassword(Password);
            user.PasswordHash = passHash;
            return SaveChanges();
        }
    }
}
