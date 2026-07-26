using System.ComponentModel.DataAnnotations;
using UserManagementRole.Models;

namespace UserRoleManagement.Dto
{
    public class UserRoleDto
    {
        [Key]
        [Required]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public User User { get; set; } = null!;
        public Role Role { get; set; } = null!;
    }
}
