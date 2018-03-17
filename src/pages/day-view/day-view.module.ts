import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DayViewPage } from './day-view';

@NgModule({
  declarations: [
    DayViewPage,
  ],
  imports: [
    IonicPageModule.forChild(DayViewPage),
  ],
})
export class DayViewPageModule {}
