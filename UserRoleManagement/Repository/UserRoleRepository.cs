using UserManagementDataLayer;
using UserManagementRole.Models;
using UserRoleManagement.Dto;
using Microsoft.EntityFrameworkCore;
using UserRoleManagement.Interfaces;
using Tasks = System.Threading.Tasks.Task;

namespace UserRoleManagement.Repository
{
    public class UserRoleRepository : InterUserRoleRep
    {
        private readonly UserManagementContext _context;
        public UserRoleRepository(UserManagementContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Role>> GetRolesForUser(int id)
        {
            return await _context.UserRoles.Where(ur => ur.UserId == id).Select(ur => ur.Role).ToListAsync();
        }

        public bool AddRoleToUser(int userId, int roleId)
        {
            User? user = _context.Users.FirstOrDefault(p => p.Id == userId);
            if (user == null)
                throw new KeyNotFoundException($"User with Id {userId} is not found");

            Role? role = _context.Roles.FirstOrDefault(p => p.Id == roleId);
            if (role == null)
                throw new KeyNotFoundException($"Role with Id {roleId} is not found");

            UserRole userrole = new UserRole
            {
                UserId = userId,
                RoleId = roleId,
                User = user,
                Role = role,
            };

            _context.UserRoles.Add(userrole);

            return SaveChanges();
        }

        public async Tasks RemoveRoleForUser(int userId, int roleId) //1 2
        {
            UserRole? userRole = await _context.UserRoles.FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RoleId == roleId);
            if (userRole == null)
                throw new KeyNotFoundException($"Error removing role for User.");

            _context.Remove(userRole);
            await _context.SaveChangesAsync();

            //make sure the user is still included in the UserRole database with minimum role=user
            bool hasRoles = await _context.UserRoles.AnyAsync(ur => ur.UserId == userId);
            if (!hasRoles)
            {
                Role? role = _context.Roles.FirstOrDefault(p => p.RoleName == "User");
                User? user = _context.Users.FirstOrDefault(p => p.Id == userId);
                UserRole userrole = new UserRole
                {
                    UserId = userId,
                    RoleId = role.Id,
                    User = user,
                    Role = role,
                };
                _context.UserRoles.Add(userrole);
                await _context.SaveChangesAsync();
            }
        }

        public async Tasks AssignDefaultToUsers()
        {
            List<int> userIdsWithRoles = await _context.UserRoles.Select(ur => ur.UserId).Distinct().ToListAsync();

            List<User> userNoRole = await _context.Users.Where(u => !userIdsWithRoles.Contains(u.Id)).ToListAsync();
            Role? defaultRole = _context.Roles.FirstOrDefault(r => r.RoleName == "User");
            foreach (User user in userNoRole)
            {
                _context.UserRoles.Add(new UserRole
                {
                    UserId = user.Id,
                    RoleId = defaultRole.Id,
                    User = user,
                    Role = defaultRole,
                });
            }
            await _context.SaveChangesAsync();
        }
        public  bool SaveChanges()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
