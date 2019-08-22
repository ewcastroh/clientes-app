import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { ClientesService } from './clientes.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle-cliente/modal.service';

@Component({
	selector: 'app-clientes',
	templateUrl: './clientes.component.html',
	styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];
  paginador: any;
	clienteSeleccionado: Cliente;

	constructor(
		private clientesService: ClientesService,
		private activatedRoute: ActivatedRoute,
		private modalService: ModalService
	) {}

	ngOnInit() {
		this.activatedRoute.paramMap.subscribe(params => {
			let page: number = +params.get('page');
			if (!page) {
				page = 0;
			}
			this.clientesService
				.getClientes(page)
				.pipe(
					tap(response => {
						// this.clientes = clientes;
						console.log('ClienteComponent: tap 3.');
						(response.content as Cliente[]).forEach(cliente => {
							console.log(cliente.nombre);
						});
					})
				)
				.subscribe(response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        });
		});

		this.modalService.notificarUpload.subscribe(cliente => {
			this.clientes = this.clientes
				.map(clienteOriginal => {
					if (cliente.id === clienteOriginal.id) {
						clienteOriginal.foto = cliente.foto;
					}
					return clienteOriginal;
				});
		});
	}

	delete(cliente: Cliente): void {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-success',
				cancelButton: 'btn btn-danger'
			},
			buttonsStyling: false
		});

		swalWithBootstrapButtons
			.fire({
				title: 'Está seguro?',
				text: `¿Seguro desea eliminar el cliente ${cliente.nombre}`,
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Si, eliminar!',
				cancelButtonText: 'No, cancelar!',
				reverseButtons: true
			})
			.then(result => {
				if (result.value) {
					this.clientesService
						.delete(cliente.id)
						.subscribe(response => {
							this.clientes = this.clientes.filter(
								cli => cli !== cliente
							);
							swalWithBootstrapButtons.fire(
								'Eliminado!',
								`Cliente ${
									cliente.nombre
								} eliminado con éxito!`,
								'success'
							);
						});
				}
			});
	}

	abrirModal(cliente: Cliente) {
		this.clienteSeleccionado = cliente;
		this.modalService.abrirModal();
	}
}
