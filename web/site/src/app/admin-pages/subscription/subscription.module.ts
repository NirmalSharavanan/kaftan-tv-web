import { RouterModule } from "@angular/router";
import { SubscriptionsComponent } from "./subscriptions/subscriptions.component";
import { AddEditSubscriptionComponent } from "./add-edit-subscription/add-edit-subscription.component";
import { NgModule } from "@angular/core";
import { SubscriptionService } from "app/services/subscription.service";
import { CommonModule } from "@angular/common";
import { SsCoreModule } from "app/ss-core/ss-core.module";
import { PanelModule, OrderListModule, EditorModule, ListboxModule, FileUploadModule, GrowlModule, DataListModule, CheckboxModule, MultiSelectModule } from "primeng/primeng";
import { ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";

@NgModule({
    imports: [
        CommonModule,
        SsCoreModule,
        PanelModule, OrderListModule, EditorModule,
        ListboxModule,
        CommonModule,
        FileUploadModule,
        ReactiveFormsModule,
        GrowlModule,
        DataListModule,
        OrderListModule,
        CheckboxModule,
        PanelModule,
        ListboxModule,
        MultiSelectModule,
        TableModule,
        SsCoreModule,
        RouterModule.forChild([
            {
                path: 'subscriptionplan',
                component: SubscriptionsComponent
            },
            {
                path: 'add-subscription',
                component: AddEditSubscriptionComponent
            },
            {
                path: 'edit-subscription/:subscriptionId',
                component: AddEditSubscriptionComponent
            },
        ])
    ],
    declarations: [
        SubscriptionsComponent,
        AddEditSubscriptionComponent
    ],
    providers: [SubscriptionService]
})
export class SubscriptionModule { }