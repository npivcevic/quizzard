import { Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-simple-dialog',
  templateUrl: './simple-dialog.component.html',
  styleUrls: ['./simple-dialog.component.css']
})
export class SimpleDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {text: string}, private dialogRef: MatDialogRef<SimpleDialogComponent>) { }

  ngOnInit(): void {
  }

}
