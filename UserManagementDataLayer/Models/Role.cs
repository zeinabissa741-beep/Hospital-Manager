using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UserManagementRole.Models
{
    public class Role
    {   [Key][Required]
        public int Id { get; set; }
        public string RoleName { get; set; } = null!;
        public ICollection<UserRole>? UserRole { get; set; }
    }
}

