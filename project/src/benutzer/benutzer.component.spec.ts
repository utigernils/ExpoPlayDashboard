import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenutzerComponent } from './benutzer.component';

describe('BenutzerTabelleComponent', () => {
  let component: BenutzerComponent;
  let fixture: ComponentFixture<BenutzerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenutzerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BenutzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
