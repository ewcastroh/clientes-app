import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() paginador: any;
  pages: number[];

  desde: number;
  hasta: number;

  constructor() { }

  ngOnInit() {
    this.initPaginator();
  }

  ngOnChanges(changes: SimpleChanges) {
    const paginadorActualizado = changes.paginador;

    if (paginadorActualizado.previousValue) {
      this.initPaginator();
    }
  }

  private initPaginator(): void {
    this.desde = Math.min(Math.max(1, this.paginador.number - 4), this.paginador.totalPages - 5);
    this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number + 4), 6);

    if (this.paginador.totalPages > 5) {
      this.pages = new Array(this.hasta - this.desde + 1).fill(0).map((valor, indice) => indice + this.desde);
    } else {
      this.pages = new Array(this.paginador.totalPages).fill(0).map((valor, indice) => indice + 1);
    }
  }

}
