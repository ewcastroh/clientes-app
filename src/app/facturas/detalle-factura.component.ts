import { Component, OnInit } from '@angular/core';
import { FacturaService } from './services/factura.service';
import { Factura } from './models/factura';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-detalle-factura',
	templateUrl: './detalle-factura.component.html',
	styleUrls: ['./detalle-factura.component.css']
})
export class DetalleFacturaComponent implements OnInit {

	factura: Factura;
	titulo = 'Factura';

	constructor(private facturaService: FacturaService,
		private activateRoute: ActivatedRoute) { }

	ngOnInit() {
		this.activateRoute.paramMap.subscribe(params => {
			let id = +params.get('id');
			this.facturaService.getFactura(id).subscribe(factura => this.factura = factura);
		});
	}

}
