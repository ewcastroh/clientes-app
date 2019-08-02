import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClientesService } from './clientes.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  private cliente: Cliente = new Cliente();
  private titulo = 'Crear Cliente';
  private errors: string[];

  constructor(private clienteService: ClientesService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id) {
        this.clienteService.getCliente(id).subscribe(cliente => this.cliente = cliente);
      }
    });
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
}
