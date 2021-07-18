import { ResponseBase } from './responseBase';

export class AppUpdate extends ResponseBase {
    id: string;
    deviceType: string;
    currentVersion: string;
    description: string;
}