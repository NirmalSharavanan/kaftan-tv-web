import { ResponseBase } from 'app/models/responseBase';
import { User } from './user';

export class BlogComment extends ResponseBase {
    id: string;
    blog_id:string
    comment:string;
    userInfo:User;
}
