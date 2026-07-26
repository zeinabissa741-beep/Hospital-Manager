using UserManagementRole.Models;
using UserRoleManagement.Dto;

namespace UserRoleManagement.Interfaces
{
    public interface InterUserRep : InterBaseRep<User, UserDto>
    {
       
        Task<int> GetUserByEmail(string email);
        bool UserExists(int userId);
        bool UpdatePass(User user, string password);
    }
}


