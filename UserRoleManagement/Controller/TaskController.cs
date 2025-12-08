using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserManagementDataLayer;
using UserManagementRole.Models;
using UserRoleManagement.Dto;
using UserRoleManagement.Interfaces;
using UserRoleManagement.Repository;
using TaskModel = UserManagementRole.Models.Task;

namespace UserRoleManagement.Controller 
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController: ControllerBase
    {
        private readonly InterTaskRep _taskRepository;
        private readonly UserManagementContext _context;

        public TaskController(InterTaskRep taskRepository, UserManagementContext context)
        {
            _taskRepository = taskRepository;
        }

        [HttpPost("tasks")]
        [Authorize(Roles = "Admin")]
        public IActionResult tasks(TaskDto ts)
        {
            if (ts == null)
            {
                return BadRequest();
            }

            if (!_taskRepository.tasks(ts))
                return StatusCode(500, "Something went wrong while saving the task");

            return Ok("Task created successfully");
        }

        [HttpGet("GetTaskUser")]
        public IActionResult GetTaskUser(int userId)
        {
            ICollection<TaskModel> tas = _taskRepository.GetTaskUser(userId);
            if (tas == null)
                return NotFound();
            return Ok(tas);
        }

        [HttpGet("Complete")]
        public IActionResult Complete(int id)
        {
            bool status = _taskRepository.Complete(id);
            return Ok(status);
        }

        [HttpGet("All")]
        [Authorize(Roles = "Admin")]
        public IActionResult All() 
        {
            var tasks = _taskRepository.All();
            if (tasks == null)
                return NotFound();
            return Ok(tasks);
        }

    }
}
