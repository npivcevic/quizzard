import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  @Input() title:string = "asdas"

  constructor(private dialogRef: MatDialogRef<DialogComponent>){}

  closedialog(){
    this.dialogRef.close()
  }

}
