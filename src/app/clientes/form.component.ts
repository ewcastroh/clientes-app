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
        Swal.fire('Nuevo cliente', `Cliente ${cliente.nombre} creado con éxito!`, 'success');
      }
    );
  }

  update(): void {
    this.clienteService.update(this.cliente)
      .subscribe(cliente => {
        this.router.navigate(['/clientes']);
        Swal.fire('Cliente Actualizado', `Cliente ${cliente.nombre} actualizado con éxito!`, 'success');
      });
  }
}
