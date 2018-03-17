import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListEditorPage } from './list-editor';

@NgModule({
  declarations: [
    ListEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(ListEditorPage),
  ],
})
export class ListEditorPageModule {}
