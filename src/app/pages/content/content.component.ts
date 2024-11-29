import { Component} from '@angular/core';
import { ClienteInterface } from '../../interfaces/cliente-interface';
import { Router } from '@angular/router';
import { SweetAlertService } from '../../services/notificationsService/sweet-alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent{


  cliente: ClienteInterface | null = null;

  constructor(private router: Router,
              private sweetAlertService: SweetAlertService,
              private location: Location) {
    this.loadClienteFromState();
  }

  private loadClienteFromState(): void {
    const navigationState = this.router.getCurrentNavigation()?.extras?.state;
    console.log(navigationState);
    if (navigationState?.['cliente']) {
      this.cliente = navigationState['cliente'] as ClienteInterface;
    } else {
      this.sweetAlertService.GenericError({
        error: { error: 'Ocurrio un error durante el proceso' },
        status: 404
      } as HttpErrorResponse);
    }
  }

  goBack(): void {
    this.cliente = null;

    this.router.navigate(['/']);

    setTimeout(() => {
      window.history.replaceState({}, '', '/'); // Elimino referencia a la página actual
    }, 100); 
  }
}