import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {WebcamModule} from 'ngx-webcam';

import { FormsModule } from '@angular/forms';
import {  HttpClientModule  } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InsertarUsuarioComponent } from './components/insertar-usuario/insertar-usuario.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { LoginReconocimientoComponent } from './components/login-reconocimiento/login-reconocimiento.component';
import { EditarUsuarioComponent } from './components/editar-usuario/editar-usuario.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainNavbarComponent } from './components/main-navbar/main-navbar.component';
import { CrearPublicacionComponent } from './components/crear-publicacion/crear-publicacion.component';

@NgModule({
  declarations: [
    AppComponent,
    InsertarUsuarioComponent,
    LoginComponent,
    HomeComponent,
    LoginReconocimientoComponent,
    EditarUsuarioComponent,
    MainNavbarComponent,
    CrearPublicacionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    WebcamModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
