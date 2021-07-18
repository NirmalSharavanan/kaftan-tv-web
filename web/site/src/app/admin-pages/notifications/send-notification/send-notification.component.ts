import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { FileUpload } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { UserService } from './../../../services/user.service';

@Component({
  selector: 'ss-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.scss']
})
export class SendNotificationComponent implements OnInit {

  fg: FormGroup;
  notificationImage: File | null;

  constructor(fb: FormBuilder, private messageService: MessageService, private service: UserService) {
    this.fg = fb.group({
      user_type: fb.control('', Validators.required),
      title: fb.control('', Validators.required),
      message: fb.control('', Validators.required),
      image_url: fb.control(''),
      link: fb.control(''),
    });
  }

  ngOnInit() {

  }

  onSubmit() {
    const formData: FormData = new FormData();
    formData.append('user_type', this.fg.get('user_type').value);
    formData.append('title', this.fg.get('title').value);
    formData.append('notification_message', this.fg.get('message').value);
    formData.append('image_url', this.fg.get('image_url').value);
    formData.append('link', this.fg.get('link').value);
    formData.append('image', this.notificationImage);

    this.service.addPushNotification(formData)
    .subscribe((value: any) => {
      if(value != null) {
        if (value.success) {
        this.messageService.add({ severity: 'info', summary: 'Notification has been successfully sent to ' + this.fg.get('user_type').value + ' Users!', detail: '' });
        this.fg.reset();
        this.notificationImage = null;
        this.fg.get('user_type').setValue("");
        } else {
          this.messageService.add({ severity: 'error', summary: 'Notification sent failed !', detail: '' });
        }
      }  
    });

    // this.service.sendNotification(formData)
    //   .subscribe((value: any) => {
    //     if (value.success) {
    //       this.messageService.add({ severity: 'info', summary: 'Notification has been successfully sent to ' + this.fg.get('user_type').value + ' Users!', detail: '' });
    //       this.fg.reset();
    //       this.fg.get('user_type').setValue("");
    //     }
    //     else {
    //       this.messageService.add({ severity: 'error', summary: value.message, detail: '' });
    //     }
    //   });
  }

}
