import { AddCelebrityTypeComponent } from './add-celebrity-type/add-celebrity-type.component';
import { CelebrityTypeComponent } from './celebrity-type/celebrity-type.component';
import { AddBannerComponent } from './add-banner/add-banner.component';
import { BannerComponent } from './banner/banner.component';
import { AddContentComponent } from './add-content/add-content.component';
import { AddEditContentComponent } from './add-edit-content/add-edit-content.component';
import { ContentManagementComponent } from './content-management/content-management.component';
import { ContentComponent } from './content/content.component';

export const ContentRouting = [
    {
        path: 'video',
        component: ContentComponent
    },
    {
        path: 'audio',
        component: ContentComponent
    },
    {
        path: ':type/content-management',
        component: ContentManagementComponent
    },
    {
        path: ':type/content-management/:contentId',
        component: ContentManagementComponent
    },
    {
        path: ':type/add-content',
        component: AddContentComponent
    },
    {
        path: ':type/edit-content/:contentId',
        component: AddContentComponent
    },
    {
        path: ':type/edit-content/:contentId/add-episode',
        component: AddContentComponent
    },
    {
        path: ':type/edit-content/:contentId/edit-episode/:episodeId',
        component: AddContentComponent
    },
    {
        path: 'banner',
        component: BannerComponent
    },
    {
        path: 'add-banner',
        component: AddBannerComponent
    },
    {
        path: 'celebrityType',
        component: CelebrityTypeComponent
    },
    {
        path: 'add-celebrityType',
        component: AddCelebrityTypeComponent
    },
    {
        path: 'edit-celebrityType/:celebrityTypeId',
        component: AddCelebrityTypeComponent
    }
];
