import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './_layout/nav-menu/nav-menu.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material';
/* Angular material */
import { AngularMaterialModule } from './angular-material.module';
import { SigninComponent } from './components/auth/signin/signin.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { AdminComponent } from './components/admin/admin.component';
import { UsersComponent } from './components/admin/users/users.component';
import { CategoryComponent } from './components/admin/category/category.component';
import { ProductComponent } from './components/admin/product/product.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DeleteDialogComponent } from './_shared/delete-dialog/delete-dialog.component';
import { CategoryAddDialogComponent } from './_shared/category-add-dialog/category-add-dialog.component';
import { ProductAddDialogComponent } from './_shared/product-add-dialog/product-add-dialog.component';
import { OrderComponent } from './components/order/order.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent,
    AdminComponent,
    UsersComponent,
    CategoryComponent,
    ProductComponent,
    ProfileComponent,
    DeleteDialogComponent,
    CategoryAddDialogComponent,
    ProductAddDialogComponent,
    OrderComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      {
        path: 'auth',
        children: [
          {
            path: 'signin',
            component: SigninComponent
          },
          {
            path: 'signup',
            component: SignupComponent
          }
        ]
      },
      {
        path: 'admin',
        component: AdminComponent,
        children: [
          {
            path: '',
            redirectTo: 'users',
            pathMatch: 'full'
          },
          {
            path: 'categories',
            component: CategoryComponent
          },
          {
            path: 'products',
            component: ProductComponent
          },
          {
            path: 'users',
            component: UsersComponent
          }
        ]
      },
      {
        path: 'order',
        component: OrderComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      }
    ]),
    BrowserAnimationsModule,
    AngularMaterialModule,
    MatStepperModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    DeleteDialogComponent,
    CategoryAddDialogComponent,
    ProductAddDialogComponent
  ]
})
export class AppModule { }
