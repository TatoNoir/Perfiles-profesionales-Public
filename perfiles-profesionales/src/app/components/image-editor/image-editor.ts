import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonFooter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, refreshOutline, swapHorizontalOutline, checkmark } from 'ionicons/icons';

@Component({
  selector: 'app-image-editor',
  imports: [CommonModule, ImageCropperComponent, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonFooter],
  templateUrl: './image-editor.html',
  styleUrl: './image-editor.css'
})
export class ImageEditorComponent implements OnInit, OnChanges {
  @Input() imageFile: File | null = null;
  @Input() showEditor: boolean = false;
  @Output() imageEdited = new EventEmitter<File>();
  @Output() editorClosed = new EventEmitter<void>();

  croppedImage: any = '';
  rotation: number = 0;
  scale: number = 1;
  containWithinAspectRatio: boolean = true;
  aspectRatio: number = 1; // 1:1 para fotos de perfil cuadradas
  resizeToWidth: number = 400; // Tamaño final de la imagen

  constructor() {
    addIcons({ close, refreshOutline, swapHorizontalOutline, checkmark });
  }

  ngOnInit() {
    // Componente inicializado
  }

  ngOnChanges() {
    // Cambios detectados
  }

  imageCropped(event: any) {
    console.log('Evento imageCropped recibido:', event);
    console.log('Tipo de evento:', typeof event);
    console.log('Propiedades del evento:', Object.keys(event));

    if (event.objectUrl) {
      console.log('Usando objectUrl:', event.objectUrl);
      this.croppedImage = event.objectUrl;
    } else if (event.base64) {
      console.log('Usando base64:', event.base64.substring(0, 50) + '...');
      this.croppedImage = event.base64;
    } else if (event.blob) {
      console.log('Usando blob:', event.blob);
      this.croppedImage = event.blob;
    } else {
      console.log('Formato no reconocido, usando evento completo:', event);
      this.croppedImage = event;
    }
  }

  imageLoaded() {
    console.log('Imagen cargada correctamente en el editor');
  }

  cropperReady() {
    console.log('Cropper listo para usar');
  }

  loadImageFailed() {
    console.error('Error al cargar la imagen en el editor');
  }

  rotateLeft() {
    this.rotation -= 90;
  }

  rotateRight() {
    this.rotation += 90;
  }

  flipHorizontal() {
    this.scale = -this.scale;
  }

  resetImage() {
    this.rotation = 0;
    this.scale = 1;
  }

  changeAspectRatio(aspect: number) {
    this.aspectRatio = aspect;
  }

  saveImage() {
    console.log('Guardando imagen, croppedImage:', this.croppedImage);
    console.log('Tipo de croppedImage:', typeof this.croppedImage);

    if (this.croppedImage) {
      // Si es un blob URL, convertir a File directamente
      if (typeof this.croppedImage === 'string' && this.croppedImage.startsWith('blob:')) {
        console.log('Es un blob URL, usando archivo original');
        if (this.imageFile) {
          this.imageEdited.emit(this.imageFile);
          this.closeEditor();
        }
        return;
      }

      // Si es base64, convertir a File
      if (typeof this.croppedImage === 'string' && this.croppedImage.includes('data:')) {
        console.log('Es base64, convirtiendo a File');
        this.dataURLtoFile(this.croppedImage, 'profile-photo.jpg')
          .then(file => {
            this.imageEdited.emit(file);
            this.closeEditor();
          })
          .catch(error => {
            console.error('Error converting image:', error);
            // Fallback: usar el archivo original si hay error
            if (this.imageFile) {
              this.imageEdited.emit(this.imageFile);
              this.closeEditor();
            }
          });
        return;
      }

      // Si es un Blob, convertir a File
      if (this.croppedImage instanceof Blob) {
        console.log('Es un Blob, convirtiendo a File');
        const file = new File([this.croppedImage], 'profile-photo.jpg', { type: this.croppedImage.type });
        this.imageEdited.emit(file);
        this.closeEditor();
        return;
      }
    }

    // Fallback: usar el archivo original
    console.log('Usando archivo original como fallback');
    if (this.imageFile) {
      this.imageEdited.emit(this.imageFile);
      this.closeEditor();
    }
  }

  closeEditor() {
    this.showEditor = false;
    this.editorClosed.emit();
  }

  private dataURLtoFile(dataurl: string, filename: string): Promise<File> {
    return new Promise((resolve, reject) => {
      try {
        console.log('Convirtiendo dataURL:', dataurl.substring(0, 100) + '...');

        // Verificar que sea un data URL válido
        if (!dataurl.startsWith('data:')) {
          reject(new Error('No es un data URL válido'));
          return;
        }

        const arr = dataurl.split(',');
        if (arr.length < 2) {
          reject(new Error('Formato de data URL inválido'));
          return;
        }

        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) {
          reject(new Error('No se pudo determinar el tipo MIME'));
          return;
        }

        const mime = mimeMatch[1];
        console.log('Tipo MIME detectado:', mime);

        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        const file = new File([u8arr], filename, { type: mime });
        console.log('Archivo creado exitosamente:', file.name, file.size, 'bytes');
        resolve(file);
      } catch (error) {
        console.error('Error en dataURLtoFile:', error);
        reject(error);
      }
    });
  }
}
