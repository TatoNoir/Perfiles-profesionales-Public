import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfessionalService, Professional } from '../../services/professional';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal';

@Component({
  selector: 'app-professional-detail',
  imports: [CommonModule, ContactModalComponent],
  templateUrl: './professional-detail.html',
  styleUrl: './professional-detail.css'
})
export class ProfessionalDetailComponent implements OnInit, OnDestroy {
  professional: Professional | null = null;
  isContactModalOpen = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private professionalService: ProfessionalService
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadProfessional(id);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadProfessional(id: string) {
    this.subscription.add(
      this.professionalService.getProfessionalById(id).subscribe(professional => {
        this.professional = professional || null;
      })
    );
  }

  goBack() {
    this.router.navigate(['/professionals']);
  }

  contactProfessional() {
    console.log('Contactar a:', this.professional?.name);
    this.isContactModalOpen = true;
  }

  onCloseContactModal() {
    this.isContactModalOpen = false;
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'available': return 'Disponible';
      case 'busy': return 'Ocupado';
      case 'offline': return 'Desconectado';
      default: return 'Desconectado';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'available': return '#10B981';
      case 'busy': return '#F59E0B';
      case 'offline': return '#EF4444';
      default: return '#6B7280';
    }
  }
}
