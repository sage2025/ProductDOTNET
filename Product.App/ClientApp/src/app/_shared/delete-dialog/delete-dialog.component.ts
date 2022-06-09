import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DeleteDialogData } from 'src/app/models/delete-dialog-data.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

  itemId: number;
  itemName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:DeleteDialogData,
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    private userService: UserService
  ) {
    this.itemId = data.itemId;
    this.itemName = data.itemName;
  }

  ngOnInit() {
  }

}
