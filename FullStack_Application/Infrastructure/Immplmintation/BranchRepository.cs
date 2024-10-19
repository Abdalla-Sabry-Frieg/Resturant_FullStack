using Entities.Immplmintation;
using Entities.Models;
using Infrastructure.DataBase;
using Infrastructure.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Immplmintation
{
    public class BranchRepository : GenericRepository<Branch>, IBranchRepository
    {
        public BranchRepository(RestaurantDbContext context) : base(context)
        {
        }
    }
}
