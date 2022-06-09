import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  constructor(
    private router: Router,
    public userService: UserService
  ) {
    this.userService.loggedInUser = JSON.parse(localStorage.getItem('user'));
    if(this.userService.loggedInUser != null) {
      this.userService.loggedInUser.order = JSON.parse(localStorage.getItem('order'));
    }

  }

  ngOnInit() {

  }

  onLogout() {
    console.log('logout')
    var clearOrder = [];
    localStorage.setItem('user', null);
    localStorage.setItem('order', JSON.stringify(clearOrder));
    this.userService.loggedInUser = null;
    this.router.navigate(['/auth/signin']);
  }

}
