import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { BackendError } from '../../interfaces/backend-error';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  public GenericError(error: HttpErrorResponse): void {
    const errorMessage = this.getErrorMessage(error);
    
    // Muestra el mensaje de error al usuario con SweetAlert2
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      timer: 3500,
      showConfirmButton: false
    });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return this.handleClientError(error.error); // Pasa solo error.error
    } else if (error.status === 0) {
      return 'No se pudo conectar al servidor. Verifica tu conexión o que el servidor esté en línea.';
    } else {
      return this.handleServerError(error);
    }
  }

  private handleClientError(error: ErrorEvent): string {
    if (error.message.includes('ERR_CONNECTION_REFUSED')) {
      return 'No se puede conectar al servidor. Verifica tu conexión a Internet o el estado del servidor.';
    }
    return `Error: ${error.message}`;
  }

  private handleServerError(error: HttpErrorResponse): string {
    const backendError: BackendError = error.error;

    // Mapa de mensajes por código de estado
    const errorMessages: { [key: number]: string } = {
      400: backendError?.error || 'Solicitud incorrecta.',
      404: backendError?.error || 'Recurso no encontrado.',
      409: backendError?.error || 'Conflicto en la solicitud.',
      500: backendError?.error || 'Error interno del servidor.',
    };

    return errorMessages[error.status] || backendError?.error || 'Error desconocido';
  }
}