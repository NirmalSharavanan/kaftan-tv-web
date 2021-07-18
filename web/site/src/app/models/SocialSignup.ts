import { ResponseBase } from './responseBase';

export class SocialSignup extends ResponseBase {
    social_signup: number;
    app_id: string;
    app_secret: string;
}