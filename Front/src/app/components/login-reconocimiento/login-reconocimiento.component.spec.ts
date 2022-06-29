import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginReconocimientoComponent } from './login-reconocimiento.component';

describe('LoginReconocimientoComponent', () => {
  let component: LoginReconocimientoComponent;
  let fixture: ComponentFixture<LoginReconocimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginReconocimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginReconocimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
