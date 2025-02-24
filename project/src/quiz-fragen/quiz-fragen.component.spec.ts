import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizFragenComponent } from './quiz-fragen.component';

describe('QuizFragenComponent', () => {
  let component: QuizFragenComponent;
  let fixture: ComponentFixture<QuizFragenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizFragenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizFragenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
