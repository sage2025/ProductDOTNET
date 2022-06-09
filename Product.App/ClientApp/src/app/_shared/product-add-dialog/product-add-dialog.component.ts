import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { ProductDialogData } from 'src/app/models/product-dialog-data.model';
import { CategoryService } from 'src/app/services/category.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-add-dialog',
  templateUrl: './product-add-dialog.component.html',
  styleUrls: ['./product-add-dialog.component.css']
})
export class ProductAddDialogComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[];

  constructor(
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ProductDialogData,
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductAddDialogComponent>,
    private fileUploadService: FileUploadService
  ) { }

  get imageUrl() {
    return this.productForm.get('imageUrl');
  }
  get catId() {
    return this.productForm.get('catId');
  }
  get name() {
    return this.productForm.get('name');
  }
  get price() {
    return this.productForm.get('price');
  }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      imageUrl: ['', [
        Validators.required
      ]],
      catId: ['', [
        Validators.required
      ]],
      name: ['', [
        Validators.required
      ]],
      price: ['', [
        Validators.required
      ]],

    })
    this.categoryService.getCategories().subscribe(
      (result: any) => {
        this.categories = result;
      },
      error => {
        console.log(error);
      }
    )
  }

  onSubmit() {
    var productData = this.productForm.value;
    if(this.productForm.valid) {
      if(this.data.type === 'New') {
        this.productService.addProduct(productData).subscribe(
          result => {
            this.message = [];

            if (this.selectedFiles) {
              for (let i = 0; i < this.selectedFiles.length; i++) {
                this.upload(i, this.selectedFiles[i], result.id);
              }
              this.dialogRef.close(result);
            }
          },
          error => {
            console.error(error);
          }
        )
      } else {
        this.data.product.name = productData.name;
        this.data.product.catId = productData.catId;
        this.data.product.price = productData.price;
        this.productService.updateProduct(this.data.product, this.data.product.id).subscribe(
          result => {
            this.message = [];

            if (this.selectedFiles) {
              for (let i = 0; i < this.selectedFiles.length; i++) {
                this.upload(i, this.selectedFiles[i], this.data.product.id);
              }
              this.dialogRef.close(result);
            }
          },
          error => {
            console.error(error);
          }
        )
      }

    } else {
      console.log('Invalid');
    }
  }


  onChangeCategory(event: any) {
    if(this.data.type === 'Edit') {
      this.data.product.catName = event.source.selected.viewValue;
    }
  }
  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  progressInfos: any[] = [];
  message: string[] = [];

  previews: string = '';
  imageInfos?: Observable<any>;
  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;

    this.previews = '';
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          if(this.data.type == 'New') {
            this.previews = e.target.result;
          } else {
            this.data.product.imageUrl = e.target.result;
          }

        };

        reader.readAsDataURL(this.selectedFiles[i]);

        this.selectedFileNames.push(this.selectedFiles[i].name);
      }
    }
  }

  upload(idx: number, file: File, productId: number): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    if (file) {
      this.fileUploadService.upload(file, productId).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
            this.imageInfos = this.fileUploadService.getFiles();
          }
        },
        (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        });
    }
  }
}
