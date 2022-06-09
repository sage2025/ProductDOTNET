import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { CategoryAddDialogComponent } from 'src/app/_shared/category-add-dialog/category-add-dialog.component';
import { DeleteDialogComponent } from 'src/app/_shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements AfterViewInit {
  displayedColumns: string[] = ['no', 'name', 'action'];
  categoryData = new MatTableDataSource<Category>();
  isLoadingData: boolean = true;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) { }

  ngAfterViewInit() {
    this.categoryService.getCategories().subscribe(
      (result: any) => {
        this.categoryData.data = result;
        this.categoryData.paginator = this.paginator;
        this.isLoadingData = false;
      }
    )
  }

  onAdd() {
    const dialogRef = this.dialog.open(CategoryAddDialogComponent, {
      width: '25%',
      data: {
        type: 'New',
        categoryName: ''
      }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if(result != undefined && result != 'no') {
          this.isLoadingData = true;
          this.categoryData.data.push(result);
          this.categoryData._updateChangeSubscription();
          this.isLoadingData = false;
        }

      }
    )
  }

  onDelete(category, index) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '30%',
      data: {
        itemId: category.id,
        itemName: category.name
      }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if( result === 'yes') {
          this.categoryService.deleteCategory(category.id).subscribe(
            result => {
              this.isLoadingData = true;
              this.categoryData.data.splice(index, 1);
              this.categoryData._updateChangeSubscription();
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

  onEdit(category, index) {
    const dialogRef = this.dialog.open(CategoryAddDialogComponent, {
      width: '25%',
      data: {
        type: 'Edit',
        category: category
      }
    });
  }

  onSearch(key) {
    this.isLoadingData = true;
    this.categoryService.searchCategory(key).subscribe(
      (result: any) => {
        console.log(result);
        this.categoryData.data = result;
        this.categoryData._updateChangeSubscription();
        this.isLoadingData = false;
      },
      error => {
        console.error(error);
      }
    )
  }

}
