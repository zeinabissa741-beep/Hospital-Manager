using Microsoft.AspNetCore.Http.HttpResults;
using System.Web.Helpers;
using UserManagementDataLayer;
using UserManagementRole.Models;
using UserRoleManagement.Dto;
using UserRoleManagement.Interfaces;
using TaskModel = UserManagementRole.Models.Task;

namespace UserRoleManagement.Repository
{
    public class TaskRepository : InterTaskRep
    {
        private readonly UserManagementContext _context;

        public TaskRepository(UserManagementContext context)
        {
            _context = context;
        }
        public bool tasks(TaskDto ts)
        {
            TaskModel task = new TaskModel
            {
                Title = ts.Title,
                Description = ts.Description,
                IsCompleted = ts.IsCompleted,
                UserId = ts.UserId,
                CreatedAt = ts.CreatedAt,
            };

            _context.Tasks.Add(task);
            return _context.SaveChanges() > 0;
        }

        public ICollection<TaskModel> GetTaskUser(int userId) 
        {
            List<TaskModel>? tasks = _context.Tasks.Where(ur => ur.User.Id == userId).ToList();

            if (tasks.Count == 0)
            {
                throw new InvalidOperationException($"User {userId} does not have tasks assigned.");
            }
            return tasks;
        }

        public bool Complete(int id)
        {
            TaskModel? ts = _context.Tasks.FirstOrDefault(p => p.Id == id);
            if (ts == null)
            {
                throw new InvalidOperationException($"Task not found.");
            }
            ts.IsCompleted = true;
            _context.SaveChanges();
            return ts.IsCompleted;
        }

        public ICollection<TaskModel> All()
        {
            return _context.Tasks.OrderBy(p => p.Id).ToList();
        }
        public virtual bool SaveChanges()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
