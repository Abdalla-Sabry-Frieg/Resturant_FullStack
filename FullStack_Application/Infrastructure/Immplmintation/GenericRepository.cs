using Infrastructure.DataBase;
using Infrastructure.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Immplmintation
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly RestaurantDbContext _context;
        private readonly DbSet<T> _dbSet;

        public GenericRepository(RestaurantDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> perdicat, string? includeWord)
        {
            IQueryable<T> query = _dbSet;
            if (perdicat != null) // Where
            {
                query = query.Where(perdicat);
            }
            if (includeWord != null) // Include
            {
                foreach (var item in includeWord.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(item);
                }
            }
            return query.ToList();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public async Task AddRangeAsync(IEnumerable<T> entities)
        {
            await _dbSet.AddRangeAsync(entities);
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public void Remove(T entity)
        {
            _dbSet.Remove(entity);
        }

        public void RemoveRange(IEnumerable<T> entities)
        {
            _dbSet.RemoveRange(entities);
        }

        public T GetFirstOrDefualt(Expression<Func<T, bool>>? perdicat, string? includeWord)
        {
            IQueryable<T> query = _dbSet;
            if (perdicat != null) // Where
            {
                query = query.Where(perdicat);
            }
            if (includeWord != null) // Include
            {
                foreach (var item in includeWord.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(item);
                }
            }
            return query.SingleOrDefault();
        }
    }
}
