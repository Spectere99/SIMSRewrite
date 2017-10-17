using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIMSDataService.DataActions
{
    public interface IActions<T>
    {
        IEnumerable<T> Get();
        T GetById(int id);
        void Insert(T modelObj, string user);
        void Update(T modelObj, string user);
        void Delete(int id, string user);

    }
}