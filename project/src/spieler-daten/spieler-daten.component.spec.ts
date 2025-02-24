import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpielerDatenComponent } from './spieler-daten.component';

describe('SpielerDatenComponent', () => {
  let component: SpielerDatenComponent;
  let fixture: ComponentFixture<SpielerDatenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpielerDatenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpielerDatenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
