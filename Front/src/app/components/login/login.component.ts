import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserInterface } from 'src/app/models/user-interface';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = "";
  password: string="";
  constructor(public auth: UserService,public router: Router) { }

  ngOnInit(): void {
  }

  login() {

    if (this.email===""||this.password===""){
      alert("Debe llenar todos los campos");
    }else{
      console.log(this.email,this.password);
      this.auth.Login(this.email,this.password).subscribe((res) => {
        if (res.error===false) {
          let DataUser: UserInterface = res['DataUser'];
          this.auth.setCurrentUser(DataUser);
          this.router.navigate(['/']);
  
        } else {
           //alert(res.msg);
           console.log('esta aqui')
        }
      })
      this.email="";
      this.password="";
    }
    
  }

  registrarse(){
    this.router.navigate(['/insertarUsuario']);

  }

  reconocimiento(){
    this.router.navigate(['/login/reconocimiento']);
  }

}
