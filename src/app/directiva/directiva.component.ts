import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent implements OnInit {


  listaCursos: string[] = ['Typescript', 'JavaScript', 'Java SE', 'C#', 'PHP'];
  habilitar = true;
  mensajeBoton = 'Ocultar';

  constructor() { }

  ngOnInit() {
  }

  toogleBotonMostrarOcultar(): void {
    this.habilitar = !this.habilitar;
    if (this.habilitar === true) {
      this.mensajeBoton = 'Ocultar';
    } else {
      this.mensajeBoton = 'Mostrar';
    }
  }

}
