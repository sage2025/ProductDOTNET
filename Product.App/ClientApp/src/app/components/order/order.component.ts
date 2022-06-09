import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Product } from 'src/app/models/product.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  displayedColumns: string[] = ['no', 'image', 'name', 'price', 'action'];
  orderData = new MatTableDataSource<Product>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  isLoadingData:boolean = true;
  totalAmount: number = 0;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.orderData.data = this.userService.loggedInUser.order;
    this.orderData.paginator = this.paginator;
    this.calculateTotalAmount();
    this.isLoadingData = false;

  }

  onDelete(order, index) {
    this.isLoadingData = true;
    this.userService.loggedInUser.order.splice(index, 1);
    localStorage.setItem('order', JSON.stringify(this.userService.loggedInUser.order));
    this.orderData.data = this.userService.loggedInUser.order;
    this.orderData._updateChangeSubscription();
    this.calculateTotalAmount();
    this.isLoadingData = false;
  }

  calculateTotalAmount() {
    this.totalAmount = 0;
    this.orderData.data.forEach(order => {
      this.totalAmount += order.price;
    });
  }

}
