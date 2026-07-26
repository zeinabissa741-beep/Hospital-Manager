using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UserManagementRole.Models;

namespace UserManagementRole.Models
{
    public class Task
    {
        [Key]
        [Required]
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public bool IsCompleted { get; set; }
        [ForeignKey(nameof(Task))]
        public int UserId { get; set; }
        public DateOnly CreatedAt { get; set; }
        public User? User { get; set; }

    }
}
