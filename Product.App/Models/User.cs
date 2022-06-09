using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Product.App.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [Column(TypeName = "varchar(100)")]
        public string UserName { get; set; }
        [Required]
        [Column(TypeName = "varchar(100)")]
        public string Email { get; set; }
        [Required]
        [Column(TypeName = "varchar(255)")]
        public string Password { get; set; }
        [Required]
        public bool IsAdmin { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        [NotMapped]
        public string CurrentPassword { get; set; }
    }
}
