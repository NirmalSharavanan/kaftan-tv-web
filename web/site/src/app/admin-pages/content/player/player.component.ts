import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ss-player-admin',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input() videoUrl: string;

  constructor() { }

  ngOnInit() {
  }

}
