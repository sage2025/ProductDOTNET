import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public httpOptions: any;
  private _loggedInUser?: User;

  get loggedInUser(): User {
    return this._loggedInUser;
  }
  set loggedInUser(user: User) {
      this._loggedInUser = user;
  }

  _baseUrl: string = window.location.origin;
  userData: User = new User();

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json; charset=utf-8'
        }
      )
    }
  }

  signin(data) {
    let requestUrl = `${this._baseUrl}/api/Users/signin?email=${data.email}&password=${data.password}`;
    return this.http.get(requestUrl);
  }

  signup(data: any) {
    let requestUrl = `${this._baseUrl}/api/Users/signup`;
    return this.http.post(requestUrl, data);
  }

  checkingEmail(email: string) {
    let requestUrl = `${this._baseUrl}/api/Users/checking_email?email=${email}`;
    return this.http.get<boolean>(requestUrl);
  }

  checkingEmailByProfile(email: string, id: number) {
    let requestUrl = `${this._baseUrl}/api/Users/checking_email_by_profile?email=${email}&id=${id}`;
    return this.http.get<boolean>(requestUrl);
  }

  updateUser(userData) {
    let requestUrl = `${this._baseUrl}/api/Users/${userData.id}`;
    return this.http.put(requestUrl, userData);
  }

  updateProfile(userData, id) {
    let requestUrl = `${this._baseUrl}/api/Users/update_profile/${id}`;
    return this.http.put(requestUrl, userData);
  }

  deleteUser(id: number) {
    let requestUrl = `${this._baseUrl}/api/Users/${id}`;
    return this.http.delete(requestUrl);
  }

  getUsers() {
    let requestUrl = `${this._baseUrl}/api/Users`;
    return this.http.get(requestUrl);
  }
}
