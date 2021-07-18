import { FileUpload } from 'primeng/primeng';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { Component, OnInit } from '@angular/core';
import { HomeBannerService } from 'app/services/home-banner.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'ss-add-banner',
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.scss']
})
export class AddBannerComponent implements OnInit {
  bannerImage: File | null;
  fg: FormGroup;
  maxLength = 200;

  constructor(fb: FormBuilder,
    private messageService: MessageService,
    private service: HomeBannerService,
    private router: Router) {
    this.fg = fb.group({
      redirectUrl: fb.control('', [Validators.required]),
      bannerText: fb.control('', []),
      bannerDescription: fb.control('', []),
    });
  }

  get redirectUrl() {
    return this.fg.get('redirectUrl').value;
  }
  get bannerText() {
    return this.fg.get('bannerText').value;
  }
  get bannerDescription() {
    return this.fg.get('bannerDescription').value;
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('redirectUrl', this.redirectUrl);
    formData.append('bannerText', this.bannerText);
    formData.append('bannerDescription', this.bannerDescription);
    formData.append('bannerImage', this.bannerImage);

    if (this.bannerImage) {
      this.service.addBanner(formData)
        .subscribe((response) => {
          this.router.navigate(['/admin/content/banner']);
        });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Please upload banner image', detail: '' });
    }
  }

  ngOnInit() {
  }

}
