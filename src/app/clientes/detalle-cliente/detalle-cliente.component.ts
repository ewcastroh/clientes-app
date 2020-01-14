import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClientesService } from './../clientes.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from './../../usuarios/auth.service';
import { FacturaService } from '../../facturas/services/factura.service';
import { Factura } from 'src/app/facturas/models/factura';

@Component({
	selector: 'app-detalle-cliente',
	templateUrl: './detalle-cliente.component.html',
	styleUrls: ['./detalle-cliente.component.css']
})
export class DetalleClienteComponent implements OnInit {

	@Input() cliente: Cliente;
	titulo = 'Client details';
	private fotoSeleccionada: File;
	private progreso = 0;

	constructor(private clienteService: ClientesService,
		private activatedRoute: ActivatedRoute,
		public modalService: ModalService,
		public authService: AuthService,
		private facturaService: FacturaService) { }

	ngOnInit() {
		/* this.activatedRoute.paramMap.subscribe(params => {
		  let id: number = +params.get('id');
		  if (id) {
			this.clienteService.getCliente(id).subscribe(cliente => {
			  this.cliente = cliente;
			});
		  }
		}); */
	}

	seleccionarFoto(event) {
		this.fotoSeleccionada = event.target.files[0];
		this.progreso = 0;
		console.log(this.fotoSeleccionada);
		if (this.fotoSeleccionada.type.indexOf('image') < 0) {
			Swal.fire('Error seleccionar imagen', 'El archivo debe ser de tipo imagen!', 'error');
			this.fotoSeleccionada = null;
		}
	}

	subirFoto() {

		if (!this.fotoSeleccionada) {
			Swal.fire('Error Upload', 'Debe seleccionar una foto!', 'error');
		} else {
			this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
				.subscribe(event => {
					if (event.type === HttpEventType.UploadProgress) {
						this.progreso = Math.round((event.loaded / event.total) * 100);
					} else if (event.type === HttpEventType.Response) {
						const response: any = event.body;
						this.cliente = response.cliente as Cliente;
						this.modalService.notificarUpload.emit(this.cliente);
						// this.cliente = cliente;
						Swal.fire('La foto se ha subido correctamente!', response.mensaje, 'success');
					}
				});
		}
	}

	cerrarModal() {
		this.modalService.cerrarModal();
		this.fotoSeleccionada = null;
		this.progreso = 0;
	}

	delete(factura: Factura): void {
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
				text: `¿Seguro desea eliminar la factura ${factura.id}`,
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Si, eliminar!',
				cancelButtonText: 'No, cancelar!',
				reverseButtons: true
			})
			.then(result => {
				if (result.value) {
					this.facturaService
						.delete(factura.id)
						.subscribe(response => {
							this.cliente.facturas = this.cliente.facturas.filter(
								fact => fact !== factura
							);
							swalWithBootstrapButtons.fire(
								'Factura Eliminada!',
								`Factura ${
								factura.id
								} eliminada con éxito!`,
								'success'
							);
						});
				}
			});
	}

}
