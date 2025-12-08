namespace UserRoleManagement.Interfaces
{
    public interface InterBaseRep<TEntity, TDto>
    {
        bool Create(TDto entity);
        TEntity GetById(int id);
        TEntity Get(string name);
        ICollection<TEntity> GetAll();
        bool Update(int id, TDto entity);
        bool Delete(int id);
        bool SaveChanges();

    }
}
