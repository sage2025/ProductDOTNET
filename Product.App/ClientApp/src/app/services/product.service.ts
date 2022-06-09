import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public httpOptions: any;
  _baseUrl: string = window.location.origin;

  constructor(
    private http: HttpClient
  ) {
    this.httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json; charset=utf-8'
        }
      )
    }
   }

  getProduct() {
    let requestUrl = `${this._baseUrl}/api/Products`;
    return this.http.get(requestUrl);
  }

  addProduct(productData) {
    let requestUrl = `${this._baseUrl}/api/Products/add_product`;
    return this.http.post<Product>(requestUrl, productData);
  }

  deleteProduct(productId) {
    let requestUrl = `${this._baseUrl}/api/Products/${productId}`;
    return this.http.delete(requestUrl);
  }

  updateProduct(product: Product, productId) {
    let requestUrl = `${this._baseUrl}/api/Products/${productId}`;
    return this.http.put(requestUrl, product);
  }

  searchProduct(categoryKey: number, productKey: string, minPrice: number, maxPrice: number) {
    let requestUrl = `${this._baseUrl}/api/Products/search?categoryKey=${categoryKey}&productKey=${productKey}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    return this.http.get(requestUrl);
  }
}
