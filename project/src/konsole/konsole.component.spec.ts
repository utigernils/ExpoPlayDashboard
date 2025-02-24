import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KonsoleComponent } from './konsole.component';

describe('KonsoleTabelleComponent', () => {
  let component: KonsoleComponent;
  let fixture: ComponentFixture<KonsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KonsoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KonsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
