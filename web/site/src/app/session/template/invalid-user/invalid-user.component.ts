import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ss-invalid-user',
    templateUrl: './invalid-user.component.html',
    styleUrls: ['./invalid-user.component.scss']
})
export class InvalidUserComponent implements OnInit {

    showDialog: boolean;
    
    @Input()
    isAuthenticated: boolean;

    @Input()
    is_premium_content: boolean;

    @Input()
    hasPremiumAccess: boolean;

    @Input()
    premium_message: string;

    @Output()
    stopPlay: EventEmitter<string[]> = new EventEmitter();

    constructor(private router: Router) { }

    ngOnInit() {
        this.showDialog = true;
    }

    cancel() {
        // console.log(this.stopPlay);

        if (this.stopPlay.observers.length > 0) {
            this.stopPlay.emit();
        } else {
            if(this.router.url.includes('premium')) {
                this.showDialog = false;
            } else {
                this.router.navigate(['/session/home']);
            }
        }
    }

}
