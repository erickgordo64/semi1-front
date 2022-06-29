import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { Router } from "@angular/router";
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-crear-publicacion',
  templateUrl: './crear-publicacion.component.html',
  styleUrls: ['./crear-publicacion.component.css']
})
export class CrearPublicacionComponent implements OnInit {
  imgURL: any = "https://t4.ftcdn.net/jpg/01/19/32/93/240_F_119329387_sUTbUdeyhk0nuhNw5WaFvOyQFmxeppjX.jpg";
  idUsuario:string="";
  public message: string = "";
  public imagePath: any;
  nombre: string = "";
  uploadedFiles: Array<File> = [];
  constructor(public userService: UserService, private http: HttpClient, public router: Router) { }

  ngOnInit(): void {
    this.idUsuario = this.userService.getCurrentUser()['id_usuario'];
  }
  async crearPublicacion() {
    if (this.imgURL === "https://t4.ftcdn.net/jpg/01/19/32/93/240_F_119329387_sUTbUdeyhk0nuhNw5WaFvOyQFmxeppjX.jpg") {
      alert("la publicacion debe contener una imagen");
    } else {
      let formData = new FormData();
      var asyncResult: any
      for (var i = 0; i < this.uploadedFiles.length; i++) {
        formData.append("file", this.uploadedFiles[i], this.uploadedFiles[i].name);
        asyncResult = await this.http.post('http://localhost:3000/uploadImagePubli', formData).toPromise()
        console.log(asyncResult);
        if(!asyncResult['error']){
          var nombreImagen = asyncResult['msg'];
          this.userService.crearPublicacion(nombreImagen,this.nombre,this.idUsuario, this.nombre, this.nombre)
          .subscribe((res: any) => {
            console.log(res);
            if (!res['error']) {
              //alert(res['msg']);
              window.location.reload();

            } else {
              //alert(res['msg']);
            }

          })
        }else{
          //alert(asyncResult['msg']);
        }
      }
    }
  }
  addImage(element: any) {

    this.uploadedFiles = element.target.files; // outputs the first file
    console.log(element.target.files)
    if (element.length === 0)
      return;

    var mimeType = element.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      alert(this.message);
      return;
    }

    var reader = new FileReader();
    this.imagePath = element.target.files;
    reader.readAsDataURL(element.target.files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }

  }
}
