import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Product } from 'src/app/models/product.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls:['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoadingData: boolean = true;
  price: number = 0;
  products: any = [];
  categoryList: any = [];
  categories = new FormControl();

  categoryKey: number = 0;
  productKey: string = '';
  minPrice: number = 0;
  maxPrice: number = 100000;

  cartList: any = JSON.parse(localStorage.getItem('order'))

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.productService.getProduct().subscribe(
      result => {
        this.products = result;
        this.isLoadingData = false;
      },
      error => {
        console.error(error);
      }
    )

    this.categoryService.getCategories().subscribe(
      result => {
        this.categoryList = result;
      },
      error => {
        console.error(error);
      }
    )
  }

  onSearchByCategory(event: any) {
    this.categoryKey = event.value;
    this.onSearch();
  }

  onSearchByProduct(productKey) {
    this.productKey = productKey;
    this.onSearch();
  }

  onSearchByMaxPrice(maxPrice) {
    this.maxPrice = maxPrice;
    this.onSearch();
  }

  onSearchByMinPrice(minPrice) {
    this.minPrice = minPrice;
    this.onSearch();
  }

  onSearch() {
    this.productService.searchProduct(this.categoryKey, this.productKey, this.minPrice, this.maxPrice).subscribe(
      result => {
        this.isLoadingData = true;
        this.products = result;
        this.isLoadingData = false;
      },
      error => {
        console.error(error);
      }
    )
  }

  onAddCart(product) {
    if(this.userService.loggedInUser != null) {
      this.cartList.push(product);
      localStorage.setItem('order', JSON.stringify(this.cartList));
      this.userService.loggedInUser.order = JSON.parse(localStorage.getItem('order'));
      this.snackBar.open("Successfully added to your cart.", 'x', {
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    } else {
      this.snackBar.open("Please sign in.", 'x', {
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    }

  }
}
