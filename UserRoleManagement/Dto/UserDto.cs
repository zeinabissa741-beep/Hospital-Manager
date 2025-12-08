using System.ComponentModel.DataAnnotations;

namespace UserRoleManagement.Dto
{
    public class UserDto
    {
        [Required]
        [Key]
        public int Id { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        public string? email { get; set; }
        [Required]
        public string? PasswordHash { get; set; }
        [Required]
        public DateOnly CreationDate { get; set; }
    }
}
