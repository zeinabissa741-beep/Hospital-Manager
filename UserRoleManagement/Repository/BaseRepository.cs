using Microsoft.EntityFrameworkCore;
using UserManagementDataLayer;
using UserRoleManagement.Interfaces;

namespace UserRoleManagement.Repository
{
    public abstract class BaseRepository<T, TDto> : InterBaseRep<T, TDto> where T : class where TDto : class
    {
        protected UserManagementContext _context;
        protected DbSet<T> _dbSet;
        public BaseRepository(UserManagementContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public abstract bool Create(TDto tdto);

        public abstract T GetById(int id);
        public abstract T Get(string name);
        public abstract ICollection<T> GetAll();
        public virtual bool Update(int id, TDto entity) {
            _context.Update(entity);
            return SaveChanges();
        }
        public virtual bool Delete(int id)
        {
            T? entity = _dbSet.Find(id);
            if (entity == null)
                throw new KeyNotFoundException($"{typeof(T).Name} with ID '{id}' not found.");

            _dbSet.Remove(entity);
            return SaveChanges();

        }
        public virtual bool SaveChanges() {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }

    }
}
