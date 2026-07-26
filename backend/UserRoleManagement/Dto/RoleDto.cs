using System.ComponentModel.DataAnnotations;
using UserManagementRole.Models;

namespace UserRoleManagement.Dto
{
    public class RoleDto
    {
        [Required]
        [Key]
        public int Id { get; set; }
        [Required]
        public string? RoleName { get; set; }
    }
}
