import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, filter, finalize, of, tap } from 'rxjs';
import { ClienteService } from '../../services/componentService/cliente.service';
import { ClienteInterface } from '../../interfaces/cliente-interface';
import { SweetAlertService } from '../../services/notificationsService/sweet-alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent{

  formularioCliente!: FormGroup;
  cliente: ClienteInterface | null = null;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private clienteService:ClienteService,
    private sweetAlertService: SweetAlertService,
    private router: Router) {
    this.initForm();
  }
  
  initForm() {
    this.formularioCliente = this.formBuilder.group({
    tipoDocumento: ['', Validators.required],
    numeroDocumento: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(11), Validators.pattern('^[0-9]*$')]]
    });
  }
  
  onSubmit() {
    if (this.formularioCliente.valid) {
    this.isLoading = true;
    const { tipoDocumento, numeroDocumento } = this.formularioCliente.value;
    
    this.clienteService.searchCliente(tipoDocumento, numeroDocumento)
      .pipe(
        filter(result => !!result),
        tap(cliente => {
          if (cliente) {
            console.log(cliente.primerNombre);
            // Paso los datos del cliente a través de la navegación
            this.router.navigate(['/content'], { state: { cliente: cliente } });
          } else {
            this.sweetAlertService.GenericError({
              error: { error: 'Cliente no encontrado' },
              status: 404
            } as HttpErrorResponse);
          }
        }),
        catchError(error => {
          this.sweetAlertService.GenericError(error);
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
    }
    }
    

}
