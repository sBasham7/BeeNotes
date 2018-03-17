import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CalendarDay } from './CalendarDay';
import { DatabaseManager } from '../../app/DatabaseManager';
import { WindowRef } from '../../app/WindowRef';
import { DayViewPage } from '../day-view/day-view';

/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {

  public currentMonthName: string;
  public currentMonth: number;
  public currentYear: number;
  public currentDayCount: number;
  public currentWeeks: CalendarDay[][];


  constructor(public navCtrl: NavController, 
      public navParams: NavParams,
      private db: DatabaseManager,
      private windowRef: WindowRef) {

    this.currentYear = ((new Date()).getFullYear());

    this.currentMonth = ((new Date()).getMonth());

    this.currentWeeks = [];

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarPage');

    if (this.navParams.get('year')) {
      this.currentYear = this.navParams.get('year');
      this.currentMonth = this.navParams.get('month');
    }
    
    this.currentWeeks = this.currentWeeks.slice(0);
  
    this.updateDayCount();
    this.updateDays(this.currentDayCount);
  }

  updateDayCount() {

    this.currentMonthName = (new Date(this.currentYear, this.currentMonth, 1))
      .toLocaleDateString('en-US', { month: 'long' }).toString();

    this.currentDayCount = (new Date(this.currentYear, this.currentMonth + 1, 0).getDate());

  }

  updateDays(dayCount: number) {

    if (this.currentWeeks.length > 0) {
      // NOTE: this could get interesting
      this.currentWeeks = this.currentWeeks.slice(0);
    }

    let tmpWeek = [];

    if ((new Date(this.currentYear, this.currentMonth, 1)).getDay()) {
      for (let i = 0; i < (new Date(this.currentYear, this.currentMonth, 1)).getDay(); i++) {

        const tmpDate = (new Date(this.currentYear, this.currentMonth, i));

        const tmpCalDay = new CalendarDay(tmpDate,
          tmpDate.toLocaleDateString('en-US', { weekday: 'long' }),
          0,
          '#ffffff',
          '#ffffff');

        tmpWeek.push(tmpCalDay);
      }

    }

    for (let i = 0; i < dayCount; i++) {

      if (tmpWeek.length === 7) {

        this.currentWeeks.push(tmpWeek.slice(0, tmpWeek.length));
        tmpWeek = [];

      }

      const tmpDate = (new Date(this.currentYear, this.currentMonth, i + 1));

      //NOTE: odd issue with UNION 
      const distinctColorsNotes = this.db.run('SELECT distinct color FROM BeeNotes_Notes WHERE note_date = ? AND note_id NOT IN (SELECT distinct note_id FROM BeeNotes_List_To_Note)', [tmpDate.getTime()]);
      const distinctColorsLists = this.db.run('SELECT distinct color FROM BeeNotes_Lists WHERE list_date = ? ORDER BY color DESC', [tmpDate.getTime()]);
      
      const distinctColors = distinctColorsNotes.concat(distinctColorsLists);

      const tmpBackgroundColor = this.averageColor(distinctColors);

      const tmpForegroundColor = this.windowRef.invertColor(tmpBackgroundColor, true);

      const tmpCalDay = new CalendarDay(tmpDate,
        tmpDate.toLocaleDateString('en-US', { weekday: 'narrow' }),
        (i + 1),
        tmpForegroundColor,
        tmpBackgroundColor);

      tmpWeek.push(tmpCalDay);
      
    }

    this.currentWeeks.push(tmpWeek.slice(0, tmpWeek.length));

  }

  prevYear() {

    this.currentYear--;

    this.currentWeeks = [];

    this.updateDayCount();

    this.updateDays(this.currentDayCount);

  }

  prevMonth() {

    this.currentMonth--;

    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }

    this.currentWeeks = [];

    this.updateDayCount();

    this.updateDays(this.currentDayCount);

  }

  nextMonth() {

    this.currentMonth++;

    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }

    this.currentWeeks = [];

    this.updateDayCount();

    this.updateDays(this.currentDayCount);

  }

  nextYear() {

    this.currentYear++;
    this.currentWeeks = [];
    this.updateDayCount();
    this.updateDays(this.currentDayCount);

  }

  openDay(selectedCalendarDay: CalendarDay) {

    const tmpYear = selectedCalendarDay.date.getFullYear();
    const tmpMonth = selectedCalendarDay.date.getMonth();
    const tmpDay = selectedCalendarDay.dayNumber;
    
    this.navCtrl.setRoot(DayViewPage, {
      'year': tmpYear,
      'month': tmpMonth,
      'day': tmpDay
    });
  }

  averageColor(colorArray: Array<any>) {

    if (colorArray.length > 1) {

      let tmpAverage = 0;
      for (const entry of colorArray) {
        tmpAverage += parseInt(entry.color.replace('#', ''), 16);
      }
  
      return '#' + (tmpAverage / colorArray.length).toString(16).split('.')[0];
  
    } else if (colorArray.length === 1) {
      return colorArray[0].color;
    } else {
      return '#FFFFFF';
    }
  }
    
}
