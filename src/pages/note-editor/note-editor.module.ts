import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoteEditorPage } from './note-editor';

@NgModule({
  declarations: [
    NoteEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(NoteEditorPage),
  ],
})
export class NoteEditorPageModule {}
