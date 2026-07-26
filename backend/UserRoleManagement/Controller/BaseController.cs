using Microsoft.AspNetCore.Mvc;
using UserManagementDataLayer;
using UserManagementRole.Models;
using UserRoleManagement.Dto;
using UserRoleManagement.Interfaces;


namespace BaseController.Controllers { 
    public abstract class BaseController<T, TDto> : ControllerBase where T : class where TDto : class
    {
        protected InterBaseRep<T, TDto> _baseRepository;
        protected UserManagementContext? _context;

        protected BaseController(InterBaseRep<T, TDto> baseRepository, UserManagementContext context)
        {
            _context = context;
            _baseRepository = baseRepository;
        }

        [HttpGet("GetAll")]
        [ProducesResponseType(200)]
        public abstract IActionResult GetAll();

        public abstract IActionResult GetById(int id);

        public abstract IActionResult Create([FromBody] TDto dto);
        public abstract Task<IActionResult> Update(TDto dto);
        public abstract IActionResult Delete(int Id);



    }
}
