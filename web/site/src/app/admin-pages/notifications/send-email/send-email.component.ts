import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { UserService } from './../../../services/user.service';
import { map, catchError } from 'rxjs/operators';
declare var $;

@Component({
  selector: 'ss-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit {
  fg: FormGroup;
  config = {
    callbacks: {
      onImageUpload: (files) => this.uploadImage(files)
    }
  };

  constructor(fb: FormBuilder, private messageService: MessageService, private service: UserService) {
    this.fg = fb.group({
      user_type: fb.control('', Validators.required),
      subject: fb.control('', Validators.required),
      message: fb.control('', Validators.required)
    });
  }

  get message() {
    return this.fg.get('message').value;
  }

  ngOnInit() {

  }

  onSubmit() {
    const formData: FormData = new FormData();
    formData.append('user_type', this.fg.get('user_type').value);
    formData.append('subject', this.fg.get('subject').value);
    formData.append('message', this.fg.get('message').value);

    this.service.sendEmail(formData)
      .subscribe((value: any) => {
        if (value.success) {
          this.messageService.add({ severity: 'info', summary: 'Email has been successfully sent to ' + this.fg.get('user_type').value + ' Users!', detail: '' });
          this.fg.reset();
          this.fg.get('user_type').setValue("");
        }
        else {
          this.messageService.add({ severity: 'error', summary: value.message, detail: '' });
        }
      });
  }

  private async uploadImage(files) {
    var formData = new FormData();
    formData.append('image', files[0]);
    this.service.uploadImage(formData)
      .pipe(
        map((response: { path: string }) => response && typeof response.path === 'string' && response.path),
        catchError(e => { return e }))
      .subscribe(dataIn => {
        if (dataIn) {
          $('.summernote').summernote('insertImage', dataIn);
        }
      }, (e) => {
        return e;
      });
  }

}
