import { Component, OnInit } from '@angular/core';
import { StaticPage } from 'app/models/StaticPage';
import { StaticPagesService } from 'app/services/static-pages.service';
import { Customer } from 'app/models/customer';
import { CustomerService } from 'app/services/customer.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  year: string;
  staticPages: StaticPage[];
  customer: Customer;
  blogId: string;

  constructor(private service: StaticPagesService, private customerService: CustomerService) { }

  ngOnInit() {
    this.year = new Date().getFullYear().toString();
    this.init();
  }

  private init() {
    this.service.getStaticPagesForUser().subscribe((staticPages: StaticPage[]) => {
      if (staticPages) {
        this.staticPages = staticPages.filter(staticPages => staticPages.display_at === "Footer");
      }
    })

    this.customerService.getCustomer()
      .subscribe((customer: any) => {
        if (customer) {
          this.customer = customer;
        }
      });
  }

}
