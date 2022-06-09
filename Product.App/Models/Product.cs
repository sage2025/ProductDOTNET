using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Product.App.Models
{
    public class Products
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [Column(TypeName = "varchar(100)")]
        public string Name { get; set; }
        [Required]
        public int CatId { get; set; }
        [Required]
        [Column(TypeName = "varchar(255)")]
        public string ImageUrl { get; set; }
        [Required]
        [Column(TypeName = "float")]
        public float Price { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [NotMapped]
        public string CatName { get; set; }
    }
}
