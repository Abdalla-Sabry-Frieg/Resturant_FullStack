using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.IRepository
{
    public interface IUnitOfWork
    {
        IMealRepository Meals { get; }
        IBranchRepository Branches { get; }
        ITableBookingRepository TableBookings { get; }
        IApplicationUserRepository ApplicationUser { get; }
        Task<int> CompleteAsync();
    }
}
