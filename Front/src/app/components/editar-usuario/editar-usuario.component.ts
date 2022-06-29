import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { Router } from "@angular/router";
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { UserInterface } from 'src/app/models/user-interface';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {
  imgURL: any = "https://t4.ftcdn.net/jpg/01/19/32/93/240_F_119329387_sUTbUdeyhk0nuhNw5WaFvOyQFmxeppjX.jpg";
  public message: string = "";
  public imagePath: any;
  nombre: string = "";
  usuario: string = "";
  password: string = "";
  foto: string = "";
  uploadedFiles: Array<File> = [];
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  // toggle webcam on/off
  public showWebcam = false;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string = "";

  public errors: WebcamInitError[] = [];
  // latest snapshot
  public webcamImage: any = null;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  constructor(public userService: UserService, private http: HttpClient, public router: Router) { }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
    this.foto = this.userService.getCurrentUser()['foto_usuario'];
    this.usuario = this.userService.getCurrentUser()['usuario'];
    this.imgURL = 'https://grupo7-bucket.s3.us-east-2.amazonaws.com/' + this.userService.getCurrentUser()['foto_usuario'];
    console.log(this.imgURL);
    this.nombre = this.userService.getCurrentUser()['nombre_usuario'];
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
  async editarUsuario() {
    if (this.password === '') {
      alert('Debes ingresar la contrasena!');
    } else {
      if (this.imgURL === 'https://grupo7-bucket.s3.us-east-2.amazonaws.com/' + this.userService.getCurrentUser()['foto_usuario']) {
        this.userService.updateUser(this.usuario, this.password, this.nombre, this.foto)
          .subscribe((res: any) => {
            if (!res['error']) {
              let DataUser: UserInterface = res['DataUser'];
              this.userService.setCurrentUser(DataUser);
              alert("Se guardaron los cambios correctamente!");
              window.location.reload();

            } else {
              alert(res['msg']);
            }

          })
      } else {
        let formData = new FormData();
        var asyncResult: any
        if (this.uploadedFiles[0] != undefined) {
          for (var i = 0; i < this.uploadedFiles.length; i++) {
            formData.append("file", this.uploadedFiles[i], this.uploadedFiles[i].name);
            asyncResult = await this.http.post('http://localhost:3000/uploadImage', formData).toPromise()
            console.log(asyncResult["msg"]);

            this.userService.updateUser(this.usuario,this.password, this.nombre, asyncResult["msg"])
              .subscribe((res: any) => {
                console.log(res);
                if (!res['error']) {
                  let DataUser: UserInterface = res['DataUser'];
                  this.userService.setCurrentUser(DataUser);
                  alert("Se guardaron los cambios correctamente!");
                  window.location.reload();
    
                } else {
                  alert(res['msg']);
                }

              })
          }
        } else {

          this.userService.uploadWebImage(this.webcamImage.imageAsBase64)
            .subscribe((res: any) => {
              asyncResult = res;
              console.log(asyncResult["msg"]);

              this.userService.updateUser(this.usuario,this.password, this.nombre, asyncResult["msg"])
                .subscribe((res: any) => {
                  console.log(res);
                if (!res['error']) {
                  let DataUser: UserInterface = res['DataUser'];
                  this.userService.setCurrentUser(DataUser);
                  alert("Se guardaron los cambios correctamente!");
                  window.location.reload();
    
                } else {
                  alert(res['msg']);
                }
                })
            })
        }
      }
    }
  }



  async upload() {
    var retorno;
    let formData = new FormData();
    for (var i = 0; i < this.uploadedFiles.length; i++) {
      formData.append("uploads[]", this.uploadedFiles[i], this.uploadedFiles[i].name);
    }
    var asyncResult = await this.http.post('http://localhost:3000/uploadImage', formData).toPromise()
    /*.subscribe((response) => {
         console.log('response received is ', response);
         retorno= response;
         return retorno;
    })*/
    console.log('response received is ', asyncResult);

  }
  gotoLogin() {
    this.router.navigate(['/verAmigo']);
  }

  public triggerSnapshot(): void {
    this.trigger.next();
    console.log(this.webcamImage)
    this.imgURL = this.webcamImage.imageAsDataUrl

  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
