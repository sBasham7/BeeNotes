import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { WindowRef } from './WindowRef';
import { DatabaseManager } from './DatabaseManager';
import { ListEditorPage } from '../pages/list-editor/list-editor';
import { NoteEditorPage } from '../pages/note-editor/note-editor';
import { DayViewPage } from '../pages/day-view/day-view';
import { CalendarPage } from '../pages/calendar/calendar';
import { SearchPage } from '../pages/search/search';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    ListEditorPage,
    NoteEditorPage,
    DayViewPage,
    CalendarPage,
    SearchPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListEditorPage,
    NoteEditorPage,
    DayViewPage,
    CalendarPage,
    SearchPage
  ],
  providers: [
    WindowRef, 
    DatabaseManager,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
