import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwsContentUploadComponent } from './aws-content-upload.component';

describe('AwsContentUploadComponent', () => {
  let component: AwsContentUploadComponent;
  let fixture: ComponentFixture<AwsContentUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwsContentUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwsContentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
