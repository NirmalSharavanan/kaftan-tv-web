import { ResponseBase } from './responseBase';

export class Customer extends ResponseBase {
    id: string;
    _links: {
        awsLogoUrl: {
            href: string;
        },
        awsFaviconUrl: {
            href: string;
        },
        awsEmailHeaderUrl: {
            href: string;
        }
    };
    facebook_link: string;
    twitter_link: string;
    googleplus_link: string;
    instagram_link: string;
    youtube_link: string;
    ios_link: string;
    android_link: string;
    aws_access_key: string;
    aws_secret_access_key: string;
    aws_region: string;
    aws_bucket: string;
    aws_identityPoolId: string;
}
