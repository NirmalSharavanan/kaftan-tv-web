import { ResponseBase } from './responseBase';

export class Roles extends ResponseBase {
    name: string;
    role: string;

    constructor(role: string, name: string) {

        super();

        this.role = role;
        this.name = name;
    }
}
