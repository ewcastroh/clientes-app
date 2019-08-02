import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { ClientesService } from './clientes.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];

  constructor(private clientesService: ClientesService) { }

  ngOnInit() {
    this.clientesService.getClientes().pipe(
      tap(clientes => {
          this.clientes = clientes;
          console.log('ClienteComponent: tap 3.');
				      clientes.forEach(cliente => {
					  console.log(cliente.nombre);
          });
        })
    ).subscribe( clientes => this.clientes = clientes );
  }

  delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: `¿Seguro desea eliminar el cliente ${cliente.nombre}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.clientesService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito!`,
              'success'
            );
          }
        );
      }
    });
  }

}
