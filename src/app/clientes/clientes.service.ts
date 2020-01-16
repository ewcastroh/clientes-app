import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
// import { CLIENTES } from './clientes.json';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate, DatePipe } from '@angular/common';
import { Region } from './region';
import { AuthService } from './../usuarios/auth.service';
import { URL_BACKEND } from '../config/config';

@Injectable({
	providedIn: 'root'
})
export class ClientesService {

	// Local
	// private urlEndpoint = 'http://localhost:8080/api/clientes';

	// Firebase
	private urlEndpoint = URL_BACKEND + '/api/clientes';

	// private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

	constructor(private http: HttpClient, private router: Router/*,  private authService: AuthService */) {}

	/* private agregarAuthorizationHeader() {
		let token = this.authService.token;
		if (token != null) {
			return this.httpHeaders.append('Authorization', 'Bearer ' + token);
		}
		return this.httpHeaders;
	} */

	/* private isNoAutorizado(error): boolean {
		if (error.status == 401) {
			if (this.authService.isAuthenticated()) {
				this.authService.logout();
			}
			this.router.navigate(['/login']);
			return true;
		}
		if (error.status == 403) {
			Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`, 'warning');
			this.router.navigate(['/clientes']);
			return true;
		}
		return false;
	} */

	getRegiones(): Observable<Region[]> {
		// return this.http.get<Region[]>(this.urlEndpoint + '/regiones', { headers: this.agregarAuthorizationHeader()}).pipe(
		return this.http.get<Region[]>(this.urlEndpoint + '/regiones');
		/* .pipe(
			catchError(error => {
				this.isNoAutorizado(error);
				return throwError(error);
			})
		); */
	}

	getClientes(page: number): Observable<any> {
		// return of(CLIENTES);
		// return this.http.get<Cliente[]>(this.urlEndpoint);
		return this.http.get(this.urlEndpoint + '/page/' + page).pipe(
			tap((response: any) => {
        // let clientes = response as Cliente[];
        console.log('ClienteService: tap 1.');
				    (response.content as Cliente[]).forEach(cliente => {
					console.log(cliente.nombre);
				});
			}),
			map((response: any) => {
				// let clientes = response as Cliente[];
				(response.content as Cliente[]).map(cliente => {
					cliente.nombre = cliente.nombre.toUpperCase();
					// cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
					// let datePipe = new DatePipe('es');
					// cliente.createAt = datePipe.transform(cliente.createAt, 'dd/MM/yyyy');
					// cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
					return cliente;
				});
				return response;
			}),
			tap(response => {
          console.log('ClienteService: tap 2.');
				      (response.content as Cliente[]).forEach(cliente => {
					console.log(cliente.nombre);
				});
			})
		);
	}

	create(cliente: Cliente): Observable<Cliente> {
		return this.http
			// .post(this.urlEndpoint, cliente, { headers: this.agregarAuthorizationHeader() })
			.post(this.urlEndpoint, cliente)
			.pipe(
				map((response: any) => response.cliente as Cliente),
				catchError(e => {
					/* if (this.isNoAutorizado(e)) {
						return throwError(e);
					} */
					if (e.status === 400) {
						return throwError(e);
					}
					if (e.error.mensaje) {
						console.error(e.error);
					}
					// Swal.fire(e.error.mensaje, e.error.error, 'error');
					return throwError(e);
				})
			);
	}

	getCliente(id: any): Observable<Cliente> {
		// return this.http.get<Cliente>(`${this.urlEndpoint}/${id}`, { headers: this.agregarAuthorizationHeader() }).pipe(
		return this.http.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
			catchError(e => {
				/* if (this.isNoAutorizado(e)) {
					return throwError(e);
				} */
				if (e.status != 401 && e.error.mensaje) {
					this.router.navigate(['/clientes']);
					console.error(e.error.mensaje);
				}
				// Swal.fire('Error al cargar el cliente', e.error.mensaje, 'error');
				return throwError(e);
			})
		);
	}

	update(cliente: Cliente): Observable<any> {
		return this.http
			// .put<any>(`${this.urlEndpoint}/${cliente.id}`, cliente, { headers: this.agregarAuthorizationHeader() })
			.put<any>(`${this.urlEndpoint}/${cliente.id}`, cliente)
			.pipe(
				catchError(e => {
					/* if (this.isNoAutorizado(e)) {
						return throwError(e);
					} */
					if (e.status === 400) {
						return throwError(e);
					}
					this.router.navigate(['/clientes']);
					if (e.error.mensaje) {
						console.error(e.error);
					}
					// Swal.fire(e.error.mensaje, e.error.error, 'error');
					return throwError(e);
				})
			);
	}

	delete(id: number): Observable<Cliente> {
		return this.http
			// .delete<Cliente>(`${this.urlEndpoint}/${id}`, { headers: this.agregarAuthorizationHeader() })
			.delete<Cliente>(`${this.urlEndpoint}/${id}`)
			.pipe(
				catchError(e => {
					/* if (this.isNoAutorizado(e)) {
						return throwError(e);
					} */
					this.router.navigate(['/clientes']);
					if (e.error.mensaje) {
						console.error(e.error);
					}
					// Swal.fire(e.error.mensaje, e.error.error, 'error');
					return throwError(e);
				})
			);
	}

	subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
		const formData = new FormData();
		formData.append('archivo', archivo);
		formData.append('id', id);

		/* let httpHeaders = new HttpHeaders();
		let token = this.authService.token;
		if (token != null) {
			httpHeaders.append('Authorization', 'Bearer ' + token);
		} */
		const req = new HttpRequest('POST', `${this.urlEndpoint}/upload`, formData, {
			reportProgress: true,
			// headers: httpHeaders
		});

		return this.http.request(req);
		/* .pipe(
			catchError(e => {
				this.isNoAutorizado(e);
				return throwError(e);
			})
		); */
	}
}
