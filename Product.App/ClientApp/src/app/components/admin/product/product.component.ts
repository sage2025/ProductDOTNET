import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { Category } from 'src/app/models/category.model';
import { Product } from 'src/app/models/product.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { DeleteDialogComponent } from 'src/app/_shared/delete-dialog/delete-dialog.component';
import { ProductAddDialogComponent } from 'src/app/_shared/product-add-dialog/product-add-dialog.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements AfterViewInit {
  displayedColumns: string[] = ['no', 'image', 'name', 'category', 'price', 'action'];
  productData = new MatTableDataSource<Product>();
  isLoadingData: boolean = true;
  categories: Category[];
  categoryKey: number = 0;
  productKey: string = '';
  minPrice: number = 0;
  maxPrice: number = 100000;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) { }

  ngAfterViewInit() {
    this.categoryService.getCategories().subscribe(
      (result: any) => {
        this.categories = result;
      },
      error => {
        console.log(error);
      }
    )
    this.productService.getProduct().subscribe(
      (result: any) => {
        this.productData.data = result;
        this.productData.paginator = this.paginator;
        this.isLoadingData = false;
      },
      error => {
        console.error(error);
      }
    )
  }

  onAdd() {
    const dialogRef = this.dialog.open(ProductAddDialogComponent,{
      width: '30%',
      data: {
        type: 'New',
        product: ''
      }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        console.log(result)
        if(result != 'no' && result != undefined) {
          console.log(result)
          this.isLoadingData = true;
          this.productData.data.push(result);
          this.productData._updateChangeSubscription();
          this.isLoadingData = false;
        }
      },
      error => {
        console.error(error);
      }
    )
  }

  onDelete(product, index) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '30%',
      data : {
        itemId: product.id,
        itemName: product.name
      }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if(result === 'yes') {
          this.productService.deleteProduct(product.id).subscribe(
            result => {
              this.isLoadingData = true;
              this.productData.data.splice(index, 1);
              this.productData._updateChangeSubscription();
              this.isLoadingData = false;
            },
            error => {
              console.error(error);
            }
          )
        }
      }
    )
  }

  onEdit(product, index) {
    const dialogRef = this.dialog.open(ProductAddDialogComponent, {
      width: '30%',
      data: {
        type: 'Edit',
        product: product
      }
    });
    var oldCategory = product.catName;
    var oldImageUrl = product.imageUrl;
    dialogRef.afterClosed().subscribe(
      result => {
        if(result === 'no' || result === undefined) {
          product.catName = oldCategory;
          product.imageUrl = oldImageUrl;
        } else {
          console.log(result)
          // this.productData.data[index].imageUrl = result.imageUrl;
        }
      }
    )
  }

  onSearchByCategory(event: any) {
    this.categoryKey = event.source.selected.value;
    this.onSearch();
  }

  onSearchByProduct(productName) {
    this.productKey = productName;
    this.onSearch();
  }

  onSearchByMaxPrice(maxPrice) {
    if(maxPrice == '') {
      maxPrice = 0;
    }
    this.maxPrice = maxPrice;
    this.onSearch();
  }

  onSearchByMinPrice(minPrice) {
    if(minPrice == '') {
      minPrice = 0;
    }
    this.minPrice = minPrice;
    this.onSearch();
  }

  onSearch() {
    this.isLoadingData = true;
    this.productService.searchProduct(this.categoryKey, this.productKey, this.minPrice, this.maxPrice).subscribe(
      (result:any) => {
        this.productData.data = result;
        this.productData._updateChangeSubscription();
        this.isLoadingData = false;
      },
      error => {
        console.error(error);
      }
    )
  }

}
