import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdIconModule } from '@angular/material';

import { ErrorOneComponent } from './404/error-404.component';
import { ErrorTwoComponent } from './503/error-503.component';

import { ErrorRoutes } from './error.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdIconModule,
    RouterModule.forChild(ErrorRoutes)
  ],
  exports: [
    CommonModule,
    FormsModule,
    MdIconModule,
    ErrorOneComponent,
    ErrorTwoComponent
  ],
  declarations: [
    ErrorOneComponent,
    ErrorTwoComponent,
  ]
})

export class ErrorModule { }
