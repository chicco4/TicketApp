import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-organizer-guide',
  imports: [MatCardModule, MatIconModule, MatListModule],
  templateUrl: './guide.html',
  styleUrls: ['./guide.css']
})
export class OrganizerGuide {

}
