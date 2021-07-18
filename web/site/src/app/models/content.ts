export class Content  {
    id: string;
    content_type: string;
    title: string;
    description: string;
    sort_order: number;
    has_episode: boolean;
    youtube_TrailerLink: string;
    youtube_VideoLink: string;
    _links: {
        awsBannerUrl: {
            href: string;
        }
        awsThumbnailUrl: {
            href: string;
        };
        // awsTrailerUrl: {
        //     href: string;
        // };
        aws360VideoUrl: {
            href: string;
        };
        awsContentUrl: {
            href: string;
        };
        aws720VideoUrl: {
            href: string;
        };
        aws1080VideoUrl: {
            href: string;
        };
        UIHref: {
            href: string;
        };
    };
    categoryList: string [];
    contentUploded: boolean;
    is_premium: boolean;
    payperviewCategoryId: string;
    price: number;
    useEncoding: boolean;
    active_date: Date;
    parent_content_id: string;
    year: string;
}
