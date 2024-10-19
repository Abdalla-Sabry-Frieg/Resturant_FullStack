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
    public class MealRepository : GenericRepository<Meal> , IMealRepository
    {
        public MealRepository(RestaurantDbContext context) : base(context)
        {
            
        }
    }
}
