import { Component, OnInit} from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-host-disconnected',
  templateUrl: './host-disconnected.component.html',
  styleUrls: ['./host-disconnected.component.css']
})
export class HostDisconnectedComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<HostDisconnectedComponent>) { }

  ngOnInit(): void {
  }

}
