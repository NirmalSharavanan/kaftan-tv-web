import { ResponseBase } from './responseBase';

export class SettingsConfiguration extends ResponseBase {

    apiKey: string;
    appId: string;
    authDomain: string;
    databaseUrl: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    apiSecret: string;
    authKey: string;

}