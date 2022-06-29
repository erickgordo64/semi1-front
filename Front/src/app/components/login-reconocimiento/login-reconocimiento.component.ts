import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserInterface } from 'src/app/models/user-interface';
import { Router } from "@angular/router";
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

@Component({
  selector: 'app-login-reconocimiento',
  templateUrl: './login-reconocimiento.component.html',
  styleUrls: ['./login-reconocimiento.component.css']
})
export class LoginReconocimientoComponent implements OnInit {
  email: string = "";
  imgURL: any = "https://t4.ftcdn.net/jpg/01/19/32/93/240_F_119329387_sUTbUdeyhk0nuhNw5WaFvOyQFmxeppjX.jpg";
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

  constructor(public auth: UserService, public router: Router) { }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }
  login() {
    if (this.imgURL != "https://t4.ftcdn.net/jpg/01/19/32/93/240_F_119329387_sUTbUdeyhk0nuhNw5WaFvOyQFmxeppjX.jpg") {
      if(this.email===""){
        alert("Debe ingresar un nombre de usuario");
      }else{
        this.auth.loginReconocimiento(this.email,this.webcamImage.imageAsBase64).subscribe((res) => {
          if (!res['error']) {
            let DataUser: UserInterface = res['DataUser'];
            this.auth.setCurrentUser(DataUser);
            this.router.navigate(['/']);
    
          } else {
             alert(res['msg']);
          }
        })
      }
    }else{
      alert("Debe agregar una foto");
    }
    /*if (this.email===""||this.password===""){
      alert("Debe llenar todos los campos");
    }else{
      this.auth.Login(this.email,this.password).subscribe((res) => {
        if (!res['error']) {
          let DataUser: UserInterface = res['DataUser'];
          this.auth.setCurrentUser(DataUser);
          this.router.navigate(['/']);
  
        } else {
           alert(res['msg']);
        }
      })
      this.email="";
      this.password="";
    }*/

  }

  registrarse() {
    this.router.navigate(['/insertarUsuario']);

  }

  normal() {
    this.router.navigate(['/login']);
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
