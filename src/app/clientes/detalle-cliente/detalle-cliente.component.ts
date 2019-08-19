import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClientesService } from './../clientes.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.css']
})
export class DetalleClienteComponent implements OnInit {

  cliente: Cliente;
  titulo = 'Detalle del cliente';
  private fotoSeleccionada: File;

  constructor(private clienteService: ClientesService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id: number = +params.get('id');
      if (id) {
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        });
      }
    });
  }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    console.log(this.fotoSeleccionada);
  }

  subirFoto() {
    this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(cliente => {
      this.cliente = cliente;
      Swal.fire('La foto se ha subido correctamente!', `La foto se ha subido con éxito: ${this.cliente.foto}`, 'success');
    });
  }

}
