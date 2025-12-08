using UserRoleManagement.Dto;
using TaskModel = UserManagementRole.Models.Task;

namespace UserRoleManagement.Interfaces
{
    public interface InterTaskRep
    {
        //public tasks(taskDto ts) create a new task
        bool tasks(TaskDto ts);
        //public GetTaskUser(int userId) retrieve all tasks for a user
        ICollection<TaskModel> GetTaskUser(int userId);
        //public Complete(int id) mark task
        bool Complete(int id);
        //public All() retrieve all tasks in DB
        ICollection<TaskModel> All();
        bool SaveChanges();

        
    }
}
