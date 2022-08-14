using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace shoppingCartAPI
{
    public class cart
    {
        public int id { get; set; }

        public int product_id { get; set; }

        public int? user_id { get; set; }

        public int qty { get; set; }

        public DateTime? created { get; set; }
    }
}

