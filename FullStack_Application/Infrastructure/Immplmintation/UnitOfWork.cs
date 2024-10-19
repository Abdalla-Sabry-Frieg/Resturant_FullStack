using Infrastructure.DataBase;
using Infrastructure.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Immplmintation
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly RestaurantDbContext _context;
        public IApplicationUserRepository Users { get; private set; }
        public IBranchRepository Branches { get; private set; }
        public ITableBookingRepository TableBookings { get; private set; }
        public IMealRepository Meals { get; private set; }
        public IApplicationUserRepository ApplicationUser { get; private set; }

        public UnitOfWork(RestaurantDbContext context)
        {
            _context = context;

            // Initialize repositories in constractor
            Users = new ApplicationUserRepository(_context);
            Branches = new BranchRepository(_context);
            TableBookings = new TableBookingRepository(_context);
            Meals = new MealRepository(_context);
            ApplicationUser = new ApplicationUserRepository(_context);
        }

        // Commits all changes made within the unit of work to the database.
        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        // Dispose the context when done
        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
