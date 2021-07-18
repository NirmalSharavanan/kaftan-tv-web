import { Router, NavigationStart } from '@angular/router';
import { SearchService } from './../search.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy, Output, EventEmitter, HostListener, Input } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ss-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit, OnDestroy {

  fg: FormGroup;
  display: boolean = false;
  valueChange: Subscription;
  routerEvent: Subscription;
  @Input() query: string;
  @Input() inputClass: String;
  @Output() queryChange: EventEmitter<string>;
  @Output() onClose: EventEmitter<any>;

  constructor(fb: FormBuilder, private searchService: SearchService, private router: Router) {
    this.fg = fb.group({ searchInput: fb.control('', []) });
    this.queryChange = new EventEmitter();
    this.onClose = new EventEmitter();
  }

  get searchInput() {
    return this.fg.get('searchInput');
  }

  ngOnInit() {
    this.valueChange = this.searchInput.valueChanges
      .debounceTime(300)
      .subscribe((response: string) => {
        this.query = response;
        this.queryChange.emit(response);
        if (response.length > 2) {
          this.changeDisplayStatus(true);
        } else {
          this.changeDisplayStatus(false);
        }
      });
    this.routerEvent = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.reset();
      }
    });
  }

  private changeDisplayStatus(status: boolean) {
    this.display = status;
    this.searchService.changeState(status);
  }

  @HostListener('window:keyup', ['$event'])
  onEsc($event: KeyboardEvent) {
    if ($event.keyCode === 27) {
      this.reset();
    }
  }

  reset() {
    this.query = '';
    this.fg.get('searchInput').setValue('');
    this.queryChange.emit(this.query);
    this.display = false;
    this.searchService.changeState(this.display);
    this.onClose.emit({});
  }

  ngOnDestroy() {
    if (this.valueChange) {
      this.valueChange.unsubscribe();
    }
    if (this.routerEvent) {
      this.routerEvent.unsubscribe();
    }
    this.reset();
  }
}
