using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.IRepository
{
    public interface IGenericRepository<T>where T : class
    {
        // Get all records from the table
        Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>>? perdicat = null, string? includeWord = null);

        // Get a record by its primary key
        Task<T> GetByIdAsync(int id);

        // Find records that match a specific condition
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        // find the single or defualt with egar loading
        public T GetFirstOrDefualt(Expression<Func<T, bool>>? perdicat, string? includeWord);

        // Add a new entity to the table
        Task AddAsync(T entity);

        // Add a range of entities to the table
        Task AddRangeAsync(IEnumerable<T> entities);

        // Update an existing entity
        void Update(T entity);

        // Remove an entity from the table
        void Remove(T entity);

        // Remove a range of entities from the table
        void RemoveRange(IEnumerable<T> entities);
    }
}
