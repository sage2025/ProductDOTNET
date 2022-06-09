using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Product.App.Models;

namespace Product.App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationContext _context;
        public readonly ConnectionString _connectionString;

        public ProductsController(ApplicationContext context, ConnectionString connectionString)
        {
            _context = context;
            _connectionString = connectionString;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult> GetProducts()
        {
            var result = await (from p in _context.Products
                   join c in _context.Categories
                   on p.CatId equals c.Id
                   select new
                   {
                       p.Id,
                       p.Name,
                       p.ImageUrl,
                       p.Price,
                       p.CatId,
                       CatName = c.Name
                   }).ToListAsync();
            return Ok(result);
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Products>> GetProducts(int id)
        {
            var products = await _context.Products.FindAsync(id);

            if (products == null)
            {
                return NotFound();
            }

            return products;
        }

        [HttpGet("search")]
        public async Task<ActionResult> SearchProducts(int categoryKey, string productKey, float minPrice, float maxPrice)
        {
            try
            {
                if (categoryKey == 0 && productKey == null)
                {
                    if(maxPrice > minPrice && maxPrice != 0)
                    {
                        var result = await _context.Products.Where(p => p.Price >= minPrice).Join(_context.Categories, p => p.CatId, c => c.Id, (p, c) => new
                        {
                            p.Id,
                            p.Name,
                            p.ImageUrl,
                            p.Price,
                            p.CatId,
                            CatName = c.Name
                        }).ToListAsync();

                        return Ok(result);
                    }
                    else
                    {
                        var result = await _context.Products.Where(p => p.Price >= minPrice && p.Price <= maxPrice).Join(_context.Categories, p => p.CatId, c => c.Id, (p, c) => new
                        {
                            p.Id,
                            p.Name,
                            p.ImageUrl,
                            p.Price,
                            p.CatId,
                            CatName = c.Name
                        }).ToListAsync();

                        return Ok(result);
                    }
                    

                }
                else if (categoryKey != 0 && productKey == null)
                {
                    if(maxPrice > minPrice && maxPrice != 0)
                    {
                        var result = await _context.Products.Where(p => p.CatId == categoryKey && p.Price >= minPrice && p.Price <= maxPrice).Join(_context.Categories, p => p.CatId, c => c.Id, (p, c) => new
                        {
                            p.Id,
                            p.Name,
                            p.ImageUrl,
                            p.Price,
                            p.CatId,
                            CatName = c.Name
                        }).ToListAsync();

                        return Ok(result);
                    } else
                    {
                        var result = await _context.Products.Where(p => p.CatId == categoryKey && p.Price >= minPrice).Join(_context.Categories, p => p.CatId, c => c.Id, (p, c) => new
                        {
                            p.Id,
                            p.Name,
                            p.ImageUrl,
                            p.Price,
                            p.CatId,
                            CatName = c.Name
                        }).ToListAsync();

                        return Ok(result);
                    }
                    
                }
                else if (categoryKey == 0 && productKey != null)
                {
                    if(maxPrice > minPrice && maxPrice != 0)
                    {
                        var result = await _context.Products.Where(p => p.Name.Contains(productKey) && p.Price >= minPrice && p.Price <= maxPrice).Join(_context.Categories, p => p.CatId, c => c.Id, (p, c) => new
                        {
                            p.Id,
                            p.Name,
                            p.ImageUrl,
                            p.Price,
                            p.CatId,
                            CatName = c.Name
                        }).ToListAsync();

                        return Ok(result);
                    } else
                    {
                        var result = await _context.Products.Where(p => p.Name.Contains(productKey) && p.Price >= minPrice).Join(_context.Categories, p => p.CatId, c => c.Id, (p, c) => new
                        {
                            p.Id,
                            p.Name,
                            p.ImageUrl,
                            p.Price,
                            p.CatId,
                            CatName = c.Name
                        }).ToListAsync();

                        return Ok(result);
                    }
                }
                else if (categoryKey != 0 && productKey != null)
                {
                    if(maxPrice > minPrice && maxPrice != 0)
                    {
                        var result = await _context.Products.Where(p => p.CatId == categoryKey && p.Name.Contains(productKey) && p.Price >= minPrice && p.Price <= maxPrice).Join(_context.Categories, p => p.CatId, c => c.Id, (p, c) => new
                        {
                            p.Id,
                            p.Name,
                            p.ImageUrl,
                            p.Price,
                            p.CatId,
                            CatName = c.Name
                        }).ToListAsync();

                        return Ok(result);
                    }
                    else
                    {
                        var result = await _context.Products.Where(p => p.CatId == categoryKey && p.Name.Contains(productKey) && p.Price >= minPrice).Join(_context.Categories, p => p.CatId, c => c.Id, (p, c) => new
                        {
                            p.Id,
                            p.Name,
                            p.ImageUrl,
                            p.Price,
                            p.CatId,
                            CatName = c.Name
                        }).ToListAsync();

                        return Ok(result);
                    }
                }
                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProducts(int id, Products products)
        {
            if (id != products.Id)
            {
                return BadRequest();
            }
            products.ImageUrl = "/assets/uploads/products/product-" + products.Id + ".jpg";
            _context.Entry(products).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(products);
        }

        [HttpPost("image_upload/{id}"), DisableRequestSizeLimit]
        public async Task<IActionResult> UploadAsync(int id)
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("ClientApp", "src", "assets", "uploads", "products");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                if (file.Length > 0)
                {
                    //var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fileName = "product-" + id + ".jpg";
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        // POST: api/Products
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("add_product")]
        public async Task<ActionResult<Products>> AddProducts(Products products)
        {
            _context.Products.Add(products);
            await _context.SaveChangesAsync();

            products.ImageUrl = "/assets/uploads/products/product-" + products.Id + ".jpg";
            _context.Products.Update(products);
            await _context.SaveChangesAsync();

            var category = await _context.Categories.Where(c => c.Id == products.CatId).FirstOrDefaultAsync();
            Console.WriteLine(category);
            Products product = new Products
            {
                Id = products.Id,
                CatId = products.CatId,
                CatName = category.Name,
                Name = products.Name,
                ImageUrl = products.ImageUrl,
                Price = products.Price,
                CreatedAt = products.CreatedAt
            };
            return Ok(product);
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducts(int id)
        {
            var products = await _context.Products.FindAsync(id);
            if (products == null)
            {
                return NotFound();
            }

            _context.Products.Remove(products);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductsExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
