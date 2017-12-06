import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  template: `
      <h1 mat-dialog-title>Confirm</h1>
      <mat-dialog-content>
        Are you sure?
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-raised-button color="warn" type="button" (click)="submit();">Yes</button>
        <button mat-raised-button type="button" (click)="cancel();">No</button>
      </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {}

  ngOnInit() {
  }

  submit() {
    this.dialogRef.close(true);
  }
  cancel() {
    this.dialogRef.close(false);
  }
}
