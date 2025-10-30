import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea, IonChip, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { save, create, close } from 'ionicons/icons';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea, IonChip, IonButton, IonIcon],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  editMode = false;

  profile: any = {
    id: 65,
    username: null,
    first_name: 'Mariano',
    last_name: 'Gimenez',
    document_type: null,
    document_number: null,
    birth_date: null,
    nationality: 'Argentina',
    country_phone: '+54',
    area_code: '186',
    phone_number: '483335',
    email: 'mgimenez@mail.com',
    profile_picture: null,
    description: 'sdfsdf',
    locality_id: 2,
    zone: 'CABA',
    address: 'av los alerces 145',
    street: 'av los alerces',
    street_number: '145',
    floor: '',
    apartment: '',
    user_type_id: 2,
    user_type: { id: 2, name: 'Profesional', description: 'Prestador de servicios o trabajador' },
    activities: [ { id: 16, name: 'Cerrajero' } ],
    locality: {
      id: 2,
      name: '12 de agosto',
      state: { id: 2, name: 'Buenos Aires' }
    }
  };

  constructor() { addIcons({ save, create, close }); }

  toggleEdit(on?: boolean) { this.editMode = on != null ? on : !this.editMode; }

  save() {
    // TODO: llamar endpoint de actualización
    console.log('Guardar perfil', this.profile);
    this.editMode = false;
  }
}


