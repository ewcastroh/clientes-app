import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClientesService } from './clientes.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Region } from './region';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

	public cliente: Cliente = new Cliente();
	public regiones: Region[];
	public titulo = 'Create Client';
	errors: string[];

	constructor(private clienteService: ClientesService,
		private router: Router,
		private activatedRoute: ActivatedRoute) { }

	ngOnInit() {
		this.cargarCliente();
		this.cargarRegiones();
		/* this.activatedRoute.paramMap.subscribe(params => {
		  const id = +params.get('id');
		  if (id) {
			this.clienteService.getCliente(id).subscribe(cliente => this.cliente = cliente);
		  }
		});
		this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones); */
	}

	cargarCliente(): void {
		this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			if (id) {
				this.clienteService.getCliente(id).subscribe(cliente => this.cliente = cliente);
			}
		});
		// this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
	}

	cargarRegiones(): void {
		this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
	}

	public create(): void {
		console.log('Clicked!');
		console.log(this.cliente);
		this.clienteService.create(this.cliente).subscribe(
			cliente => {
				this.router.navigate(['/clientes']);
				Swal.fire('Nuevo cliente', `El cliente ${cliente.nombre} ha sido creado con éxito!`, 'success');
			},
			err => {
				this.errors = err.error.error as string[];
				console.error('Código del error desde el Backend: ' + err.status);
				console.error(err.error.error);
				console.error(this.errors);
			}
		);
	}

	update(): void {
		console.log(this.cliente);
		this.cliente.facturas = null;
		this.clienteService.update(this.cliente)
			.subscribe(response => {
				this.router.navigate(['/clientes']);
				Swal.fire('Cliente Actualizado', `${response.mensaje}: ${response.cliente.nombre}`, 'success');
			},
				err => {
					this.errors = err.error.errors as string[];
					console.error('Código del error desde el Backend: ' + err.status);
					console.error(err.error.error);
				});
	}

	compararRegion(o1: Region, o2: Region): boolean {
		if (o1 === undefined && o2 === undefined) {
			return true;
		}
		return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
	}
}
