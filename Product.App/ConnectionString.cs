using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Product.App
{
    public sealed class ConnectionString
    {
        public ConnectionString(string value) => Value = value;

        public string Value { get; }
    }
}
