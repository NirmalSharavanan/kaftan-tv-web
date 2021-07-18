export class UserRole {
    role: string;
    states: Array<string> = [];

    constructor(role: string) {
        this.role = role;
    }

    addStates(...state: Array<string>) {
        this.states = state;
    }

}
