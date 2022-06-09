import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CategoryAddDialogData } from 'src/app/models/category-add-dialog-data.model';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-add-dialog',
  templateUrl: './category-add-dialog.component.html',
  styleUrls: ['./category-add-dialog.component.css']
})
export class CategoryAddDialogComponent implements OnInit {

  categoryForm: FormGroup;
  categoryData: string;
  nameHasToken: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<CategoryAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryAddDialogData
  ) { }

  ngOnInit() {
    this.categoryForm = this.formBuilder.group({
      name: ['',[
        Validators.required
      ]]
    })
  }

  get name() {
    return this.categoryForm.get('name');
  }

  onSubmit() {
    if(this.categoryForm.valid) {
      var categoryData = this.categoryForm.value;
      if(this.data.type === 'New') {
        this.categoryService.addCategory(categoryData).subscribe(
          result => {
            this.dialogRef.close(result)
          },
          error => {
            console.log(error);
          }
        )
      } else {
        this.data.category.name = categoryData.name;
        this.categoryService.updateCategory(this.data.category, this.data.category.id).subscribe(
          result => {
            this.dialogRef.close(result);
          },
          error => {
            console.error(error);
          }
        )
      }

    } else {
      console.log('invalid')
    }
  }

  // onCheckCategory() {
  //   var categoryName = this.name.value;
  //   this.categoryService.checkCategory(categoryName).subscribe(
  //     result => {
  //       console.log(result);
  //       if(result == false) {
  //         this.name.setErrors([{"has_token": 'true'}]);
  //         this.nameHasToken = true;
  //       }else {
  //         this.name.setErrors([{"has_token": null}]);
  //         this.nameHasToken = false;
  //       }
  //     },
  //     error => {
  //       console.error(error);
  //     }
  //   )
  // }

}
