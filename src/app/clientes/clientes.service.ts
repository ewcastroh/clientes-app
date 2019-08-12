import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
// import { CLIENTES } from './clientes.json';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate, DatePipe } from '@angular/common';

@Injectable({
	providedIn: 'root'
})
export class ClientesService {
	private urlEndpoint = 'http://localhost:8080/api/clientes';
	private httpHeaders = new HttpHeaders({
		'Content-Type': 'application/json'
	});

	constructor(private http: HttpClient, private router: Router) {}

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
			.post(this.urlEndpoint, cliente, { headers: this.httpHeaders })
			.pipe(
				map((response: any) => response.cliente as Cliente),
				catchError(e => {
					if (e.status === 400) {
						return throwError(e);
					}
					console.error(e.error);
					Swal.fire(e.error.mensaje, e.error.error, 'error');
					return throwError(e);
				})
			);
	}

	getCliente(id: any): Observable<Cliente> {
		return this.http.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
			catchError(e => {
				this.router.navigate(['/clientes']);
				console.error(e.error.mensaje);
				Swal.fire(
					'Error al cargar el cliente',
					e.error.mensaje,
					'error'
				);
				return throwError(e);
			})
		);
	}

	update(cliente: Cliente): Observable<any> {
		return this.http
			.put<any>(`${this.urlEndpoint}/${cliente.id}`, cliente, {
				headers: this.httpHeaders
			})
			.pipe(
				catchError(e => {
					if (e.status === 400) {
						return throwError(e);
					}
					this.router.navigate(['/clientes']);
					console.error(e.error.mensaje);
					Swal.fire(e.error.mensaje, e.error.error, 'error');
					return throwError(e);
				})
			);
	}

	delete(id: number): Observable<Cliente> {
		return this.http
			.delete<Cliente>(`${this.urlEndpoint}/${id}`, {
				headers: this.httpHeaders
			})
			.pipe(
				catchError(e => {
					this.router.navigate(['/clientes']);
					console.error(e.error.mensaje);
					Swal.fire(e.error.mensaje, e.error.error, 'error');
					return throwError(e);
				})
			);
	}
}
