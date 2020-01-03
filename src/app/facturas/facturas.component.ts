import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClientesService } from '../clientes/clientes.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-facturas',
	templateUrl: './facturas.component.html',
	styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

	titulo = 'Nueva factura';
	factura: Factura = new Factura();

	constructor(private clientesService: ClientesService,
				private activatedRoute: ActivatedRoute) { }

	ngOnInit() {
		this.activatedRoute.paramMap.subscribe(params => {
			let clienteId = +params.get('clienteId');
			this.clientesService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
		});
	}

}
