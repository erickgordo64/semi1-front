import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { UserInterface } from '../models/user-interface';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) { }
  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  })

  InsertUser(nombre: string, apellido:string, correo: string, contrasena: string,confirmacioncontrasena: string,fecha: string) {

    const url = "http://localhost:3000/registro"
    return this.http.post(
      url,
      {
        "nombre": nombre,
        "apellido": apellido,
        "contrasena": contrasena,
        "confirmacioncontrasena": confirmacioncontrasena,
        "correo": correo,
        "fecha": fecha,
      },
      { headers: this.headers }
    ).pipe(map(data => data));

  }
  uploadWebImage(foto:string){
    const url = "http://localhost:3000/uploadWebCamImage"
    return this.http.post(
      url,
      {
        "id": "foto",
        "foto": foto,
      },
      { headers: this.headers }
    ).pipe(map(data => data));

  }

  Login(correo: string, contrasena: string) {
    const url = "http://localhost:3000/login";

    console.log(correo, contrasena)

    return this.http.post<any>(url,
      {
        correo,
        contrasena
      }
      , { headers: this.headers })
      .pipe(map(data => data));
  }

  loginReconocimiento(usuario: string, imagen: string) {
    const url = "http://localhost:3000/login/reconocimiento";

    return this.http.post<any>(url,
      {
        "usuario_usuario": usuario,
        "imagen": imagen
      }
      , { headers: this.headers })
      .pipe(map(data => data));
  }

  updateUser(usuario:string,pw:string, nobmre:string,foto:string){
    const url = "http://localhost:3000/updateUser";

    return this.http.post<any>(url,
      {
        "usuario_usuario": usuario,
        "pw_usuario": pw,
        "nombre_usuario":nobmre,
        "foto_usuario":foto
      }
      , { headers: this.headers })
      .pipe(map(data => data));
  } 
  crearPublicacion(estudiante: string, curso: string, seccion: string, dia: string, hora: string){
    const url = "http://localhost:3000/asignacion";

    return this.http.post<any>(url,
      {
        estudiante,
        curso,
        seccion,
        dia,
        hora
      }
      , { headers: this.headers })
      .pipe(map(data => data));
  }

  getPublicaciones(){
    const url = "http://localhost:3000/getPublicaciones";

    return this.http.get<any>(url,
      { headers: this.headers })
      .pipe(map(data => data));
  }

  getLabels(){
    const url = "http://localhost:3000/getLabels";

    return this.http.get<any>(url,
      
      { headers: this.headers })
      .pipe(map(data => data));
  }

  getPubLabels(id_etiqueta:number){
    const url = "http://localhost:3000/getPubLabels";

    return this.http.post<any>(url,
      {
        "id_etiqueta": id_etiqueta
      }
      , { headers: this.headers })
      .pipe(map(data => data));
  }

  getTranslate(){
    const url = "http://localhost:3000/translate";

    return this.http.get<any>(url,
      
      { headers: this.headers })
      .pipe(map(data => data));
  }
  
  setCurrentUser(user: UserInterface) {
    let user_string = JSON.stringify(user);
    localStorage.setItem('UsuarioLogueado', user_string);
  }
  //TODO: GET CURRENT USER
  getCurrentUser() {
    let userCurrent = localStorage.getItem('UsuarioLogueado');
    if (userCurrent) {
      let user_json = JSON.parse(userCurrent);
      return user_json;
    } else {
      return null;
    }
  }

  logout() {
    localStorage.removeItem("UsuarioLogueado");
    this.router.navigate(['/login']);
  }

}

