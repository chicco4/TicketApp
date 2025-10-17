import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-organizer-home',
  imports: [MatCardModule, MatIconModule, MatListModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class OrganizerHome {

}
