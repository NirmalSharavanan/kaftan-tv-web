import { ResponseBase } from './responseBase';
export class JwtToken extends ResponseBase {
    token: string;
    name: string;
    role: string;
    roles: string[];
    is_premium: boolean;
}
