using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace UserManagementRole.Models
{
    public class User
    {   
        [Required]
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public DateOnly CreationDate { get; set; }
        public ICollection<UserRole> UserRole { get; set; } = null!;
        public ICollection<Task> Task { get; set; } = null!;
    }
}
