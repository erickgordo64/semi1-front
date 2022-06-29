import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
@Component({
  selector: 'main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.css']
})
export class MainNavbarComponent implements OnInit {

  constructor(public userService: UserService,public router: Router) { }

  ngOnInit(): void {
  }
  
  gotoEditar(){
    this.router.navigate(['/editarUsuario']);
  }
  cerrarSesion(){
    this.userService.logout();
  }
  crearPublicacion(){
    this.router.navigate(['/crearPublicacion']);
  }
  verPublicacion(){
    this.router.navigate(['']);
  }
}
