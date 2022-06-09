import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

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

   getCategories() {
     let requestUrl = `${this._baseUrl}/api/Categories`;
     return this.http.get<Category>(requestUrl);
   }

   addCategory(categoryData) {
    let requestUrl = `${this._baseUrl}/api/Categories/add_category`;
    return this.http.post<Category>(requestUrl, categoryData);
   }

   checkCategory(categoryName) {
     let requestUrl = `${this._baseUrl}/api/Categories/checking_category?categoryName=${categoryName}`;
     return this.http.get<boolean>(requestUrl);
   }

   deleteCategory(id) {
     let requestUrl = `${this._baseUrl}/api/Categories/${id}`;
     return this.http.delete(requestUrl);
   }

   updateCategory(categoryData: Category, categoryId: number) {
     let requestUrl = `${this._baseUrl}/api/Categories/${categoryId}`;
     return this.http.put<Category>(requestUrl, categoryData);
   }

   searchCategory(key: string) {
     let requestUrl = `${this._baseUrl}/api/Categories/search?key=${key}`;
     return this.http.get(requestUrl);
   }
}
