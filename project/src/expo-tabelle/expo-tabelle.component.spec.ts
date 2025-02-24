import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpoTabelleComponent } from './expo-tabelle.component';

describe('ExpoTabelleComponent', () => {
  let component: ExpoTabelleComponent;
  let fixture: ComponentFixture<ExpoTabelleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpoTabelleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpoTabelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
