import { SsCoreModule } from './../../ss-core/ss-core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelModule, EditorModule } from 'primeng/primeng';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSummernoteModule } from 'ngx-summernote';
import { SendEmailComponent } from './send-email/send-email.component';
import { SendNotificationComponent } from './send-notification/send-notification.component';

@NgModule({
    imports: [
        SsCoreModule,
        CommonModule,
        PanelModule,
        EditorModule,
        ReactiveFormsModule,
        NgxSummernoteModule,
        RouterModule.forChild([
            {
                path: 'send-email',
                component: SendEmailComponent
            },
            {
                path: 'send-notification',
                component: SendNotificationComponent
            },
        ])
    ],
    declarations: [SendEmailComponent, SendNotificationComponent],
    providers: []
})
export class NotificationsModule { }