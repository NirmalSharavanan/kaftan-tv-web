import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { WalletService } from './../../../services/wallet.service';
import { WalletCharges } from 'app/models/WalletCharges';
import { WalletOperators } from 'app/models/WalletOperators';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'ss-charges-configuration',
  templateUrl: './charges-configuration.component.html',
  styleUrls: ['./charges-configuration.component.scss']
})
export class ChargesConfigurationComponent implements OnInit {
  fg: FormGroup;
  walletCharges: WalletCharges[];
  chargeId: string;
  walletOperators: WalletOperators[];
  discountTypes: any;

  constructor(
    fb: FormBuilder, private messageService: MessageService,
    private service: WalletService
  ) {
    this.fg = fb.group({
      id: fb.control(''),
      operatorId: fb.control('', [Validators.required]),
      hasPercentage: fb.control('', [Validators.required]),
      chargeValue: fb.control('', [Validators.required]),
    });

    this.discountTypes = [
      { type: 'Percentage', id: '1' },
      { type: 'Fixed', id: '2' },
    ];
  }

  ngOnInit() {
    this.getAllCharges();
    this.getOperators();
  }

  get isPercentage() {
    return this.fg.get('hasPercentage').value;
  }

  get operator() {
    return this.fg.get('operatorId').value;
  }

  get chargeConfigId() {
    return this.fg.get('id').value;
  }

  getOperators() {
    this.service.getAllOperators().subscribe((operators: WalletOperators[]) => {
      if (operators) {
        this.walletOperators = operators.filter(x => x.serviceType !== 0 && !(x.serviceType === 3 && Number(x.operatorCode) == 2));
      }
    });
  }

  getAllCharges() {
    this.service.getAllChargeConfigs().subscribe((response: WalletCharges[]) => {
      if (response && response.length > 0) {
        this.walletCharges = response;
      }
    });
  }

  getChargeConfig(charge) {
    if (charge) {
      if (charge.hasPercentage) {
        this.fg.get('hasPercentage').setValue('1');
      } else {
        this.fg.get('hasPercentage').setValue('2');
      }
      this.fg.get('id').setValue(charge.id);
      this.fg.get('operatorId').setValue(charge.operatorId);
      this.fg.get('chargeValue').setValue(charge.chargeValue);
      FormGroupUtils.applyValue(this.fg, this.fg.value);
    }
  }

  cancel() {
    this.fg.reset();
    this.clear();
  }

  addCharge() {
    if (this.isPercentage === '1') {
      this.fg.get('hasPercentage').setValue(true)
    } else {
      this.fg.get('hasPercentage').setValue(false)
    }

    if (this.chargeConfigId) {
      this.service.updateChargeConfig(this.fg.value, this.chargeConfigId).subscribe((response: WalletCharges) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: response.message, detail: '' });
          this.fg.reset();
          this.clear();
          this.getAllCharges();
        } else {
          this.messageService.add({ severity: 'error', summary: response.message, detail: '' });
        }
      });
    } else {
      this.service.createChargeConfig(this.fg.value).subscribe((response: WalletCharges) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: response.message, detail: '' });
          this.fg.reset();
          this.clear();
          this.getAllCharges();
        } else {
          this.messageService.add({ severity: 'error', summary: response.message, detail: '' });
        }
      });
    }
  }

  clear() {
    this.fg.get('id').setValue("");
    this.fg.get('operatorId').setValue("");
    this.fg.get('hasPercentage').setValue("");
  }

}
