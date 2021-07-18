import { CelebrityTypeService } from './../../../services/celebrity-type.service';
import { CelebrityType } from './../../../models/CelebrityType';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ss-celebrity-type-selection',
  templateUrl: './celebrity-type-selection.component.html',
  styleUrls: ['./celebrity-type-selection.component.scss']
})
export class CelebrityTypeSelectionComponent implements OnInit {

  fg: FormGroup;
  @Input() selectedCelebrities: string[];
  @Output() onChange: EventEmitter<string[]> = new EventEmitter();
  celebrities: CelebrityType[];

  constructor(fb: FormBuilder, private service: CelebrityTypeService) {
    this.fg = fb.group({ selectedCelebritiesAry: fb.control('') })
  }

  onValueChange() {
    this.onChange.emit(this.getFormatedoutput());
  }

  get selectedCelebritiesAry() {
    return this.fg.get('selectedCelebritiesAry');
  }

  ngOnInit() {
    this.service.getAllCelebrityType()
      .subscribe((response: CelebrityType[]) => {
        if (response) {
          this.celebrities = response;
        } else {
          this.celebrities = [];
        }
        this.applySelection();
      });
  }

  private applySelection() {
    const selectedObjectes: CelebrityType[] = [];
    if (this.selectedCelebrities) {
      this.celebrities.forEach((item) => {
        if (this.selectedCelebrities.indexOf(item.id) >= 0) {
          selectedObjectes.push(item);
        }
      });
    }
    this.selectedCelebritiesAry.setValue(selectedObjectes);
  }

  private getFormatedoutput(): string[] {
    return (this.selectedCelebritiesAry.value as CelebrityType[])
      .map((value: CelebrityType) => value.id)
  }

}
