using UserManagementRole.Models;
using Tasks = System.Threading.Tasks.Task;

namespace UserRoleManagement.Interfaces
{
    public interface InterUserRoleRep
    {
        Task<IEnumerable<Role>> GetRolesForUser(int id);
        bool AddRoleToUser(int userId, int roleId);
        Tasks RemoveRoleForUser(int userId, int roleId);
        Tasks AssignDefaultToUsers();
        bool SaveChanges();
    }

}
