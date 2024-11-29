import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { SweetAlertService } from '../notificationsService/sweet-alert.service';
import { ClienteInterface } from '../../interfaces/cliente-interface';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient)
  private baseUrl:string=environment.apiUrl;

    constructor(private sweetAlertService:SweetAlertService) { 

    }

    searchCliente(tipoDocumento: string, numeroDocumento: string): Observable<ClienteInterface | null> {
      const url = `${this.baseUrl}clientes/${tipoDocumento}/${numeroDocumento}`;
      return this.http.get<ClienteInterface>(url)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.sweetAlertService.GenericError(error);
            return of(null);
          })
        );
    }
}
