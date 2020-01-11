import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo = 'SIGN IN';
  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      Swal.fire('Login', `Hola ${this.authService.usuario.username} ya estás autenticado!`, 'info');
      this.router.navigate(['/clientes']);
    }
  }

  login(): void {
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null) {
      Swal.fire('Error login', 'Username o Password vacíos!', 'error');
    }
    this.authService.login(this.usuario).subscribe(response => {
      console.log(response);
      // let payload = JSON.parse(atob(response.access_token.split('.')[1]));
      const usuario = this.authService.usuario;
      console.log(usuario);

      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);

      this.router.navigate(['/clientes']);
      Swal.fire('Login', `Bienvenido ${usuario.username}, has iniciado sesión con éxito`, 'success');
    }, err => {
      if (err.status == 400) {
        Swal.fire('Error login', 'Usuario o clave incorrectas!', 'error');
      }
    });
  }

}
