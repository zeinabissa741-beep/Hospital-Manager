using Microsoft.EntityFrameworkCore;
using UserManagementDataLayer;
using UserManagementRole.Models;
using UserRoleManagement.Dto;
using UserRoleManagement.Interfaces;

namespace UserRoleManagement.Repository
{
    public class RoleRepository : BaseRepository<Role, RoleDto>, InterRoleRep
    {
        public RoleRepository(UserManagementContext context) : base(context)
        {
            _context = context;
        }

        public override bool Create(RoleDto roleDto)
        {
            Role role = new Role
            {
                RoleName = roleDto.RoleName,
                
            };

            _context.Roles.Add(role);

            return SaveChanges();
        }

        public override Role GetById(int id)
        {
            var role = _context.Roles.FirstOrDefault(p => p.Id == id);
            if (role == null)
                throw new KeyNotFoundException($"Role with Id {id} not found.");
            return role;
        }

        public override Role Get(string roleName)
        {
            Role? role = _context.Roles.FirstOrDefault(p => p.RoleName == roleName);
            if (role == null)
                throw new KeyNotFoundException($"Role with Title '{roleName}' not found.");
            return role;
        }
        
        public override ICollection<Role> GetAll()
        {
            return _context.Roles.OrderBy(p => p.Id).ToList();
        }
        public async Task<List<Role>> GetUserRole(string email)
        {
            //int? userId = await _context.Users.Where(u => u.Email == email).Select(u => u.Id).FirstOrDefaultAsync();
            List<Role>? roles = await _context.UserRoles.Where(ur => ur.User.Email == email).Select(ur => ur.Role).ToListAsync();

            if (roles.Count == 0)
            {
                throw new InvalidOperationException($"User {email} does not have a role assigned.");
            }
            return roles;
        }
    }
}
