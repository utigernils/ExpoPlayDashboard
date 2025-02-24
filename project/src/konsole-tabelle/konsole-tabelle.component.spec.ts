import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KonsoleTabelleComponent } from './konsole-tabelle.component';

describe('KonsoleTabelleComponent', () => {
  let component: KonsoleTabelleComponent;
  let fixture: ComponentFixture<KonsoleTabelleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KonsoleTabelleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KonsoleTabelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
