import { Component } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar';
import { ActivityCardsComponent } from '../activity-cards/activity-cards';
import { PopularSearchesComponent } from '../popular-searches/popular-searches';
import { ProfessionalCardsComponent } from '../professional-cards/professional-cards';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-home',
  imports: [SearchBarComponent, ActivityCardsComponent, PopularSearchesComponent, ProfessionalCardsComponent, FooterComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

}
