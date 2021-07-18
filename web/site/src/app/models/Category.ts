import { ResponseBase } from 'app/models/responseBase';
import { Content } from './content';
import { LiveUrl } from './LiveUrl';

export class Category extends ResponseBase {
    id: string;
    category_type: number;
    name: string;
    sort_order: number;
    url: string;
    show_in_menu: boolean;
    price: number;
    premium_price: number;
    contentList: Content[];
    celebrityTypeList: String[];
    _links: {
        awsBannerUrl: {
            href: string;
        }
        awsThumbnailUrl: {
            href: string;
        }
        UIHref: {
            href: string;
        };
    }
    parent_category_id: string;
    liveUrl: LiveUrl;
    showActive: boolean;
    showChannels: boolean;
    showRadio: boolean;
    showMyPlayList: boolean;
    showInMusic: boolean; //only for mobile app purpose
    showInHome: boolean;
    showImageOnly: boolean;
    link: string;
    home_category_id: string;
}
