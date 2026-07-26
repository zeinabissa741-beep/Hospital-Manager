using UserRoleManagement.Dto;
using UserManagementRole.Models;

namespace UserRoleManagement.Interfaces
{
    public interface InterRoleRep : InterBaseRep<Role, RoleDto>
    {
        Task<List<Role>> GetUserRole(string email);
    }
}
