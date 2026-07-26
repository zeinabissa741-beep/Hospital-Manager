namespace UserRoleManagement.Dto
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public bool IsCompleted { get; set; }
        public int UserId { get; set; }
        public DateOnly CreatedAt { get; set; }

    }
}
