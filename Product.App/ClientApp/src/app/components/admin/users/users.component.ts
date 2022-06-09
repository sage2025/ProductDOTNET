import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatTableDataSource } from '@angular/material';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { DeleteDialogComponent } from 'src/app/_shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements AfterViewInit {
  displayedColumns: string[] = ['no', 'username', 'email', 'permission', 'action'];
  userData = new MatTableDataSource<User>();
  isLoadingData: boolean = true;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngAfterViewInit() {
    this.userService.getUsers().subscribe(
      (result: any) => {
        this.userData.data = result;
        this.userData.paginator = this.paginator;
        this.isLoadingData = false;
      },
      error => {
        console.log(error);
      }
    )
  }

  onChangePermission(user, event: Event) {
    this.userService.updateUser(user).subscribe(
      result => {
        this.snackBar.open('Successfully changed user permission.', 'x', {
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      },
      error => {
        console.log(error);
      }
    )
  }

  onDelete(user, index) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '30%',
      data: {
        itemId: user.id,
        itemName: user.userName
      }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if(result === 'yes') {
          this.userService.deleteUser(user.id).subscribe(
            result => {
              this.isLoadingData = true;
              this.userData.data.splice(index, 1);
              this.userData._updateChangeSubscription();
              this.isLoadingData = false;
            },
            error => {
              console.log(error);
            }
          )

        }
      }
    )
  }

}
