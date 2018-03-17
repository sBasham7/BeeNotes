import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseManager } from '../../app/DatabaseManager';
import { CalendarPage } from '../calendar/calendar';
import { TextNote } from './TextNote';
import * as $ from 'jquery';
import 'jqueryui';
/**
 * Generated class for the NoteEditorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'note-editor'
})
@Component({
  selector: 'page-note-editor',
  templateUrl: 'note-editor.html',
})
export class NoteEditorPage {

  private noteId = 0;
  
  public note = new TextNote();
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private db: DatabaseManager,
    private elementRef: ElementRef) {
  }

  ionViewDidLoad() {
    if(this.navParams.get('id')) {
      this.noteId = this.navParams.get('id');
    }
    
    this.note = new TextNote();
    
    this.note.color = '#000000';

    const tmpTime = new Date();
    tmpTime.setHours(0);
    tmpTime.setMinutes(0);
    tmpTime.setSeconds(0);
    tmpTime.setMilliseconds(0);

    this.note.date = tmpTime.getTime();

    if (this.noteId !== 0) {

      const sql: String = 'SELECT * FROM BeeNotes_Notes WHERE note_id = ?;';

      const dbResult = this.db.run(sql, [this.noteId]);

      if (dbResult.length > 0) {

        const tmpRow = dbResult[0];

        this.note.id = tmpRow['note_id'];
        this.note.date = tmpRow['note_date'];
        this.note.title = tmpRow['title'];
        this.note.text = tmpRow['note'];
        this.note.checked = tmpRow['checked'];
        this.note.color = tmpRow['color'];

      }
    }

    const textEditorComponent = this;

    // NOTE: when using the following, attaching any jquery listener appears to break 2-way binding
    $(this.elementRef.nativeElement).find('.date-picker').datepicker({
      changeMonth: true,
      changeYear: true,
      onSelect: function(dateText: string) {
        textEditorComponent.note.date = (new Date(dateText)).getTime();
        
      }
    });

  }

  returnToCalendar() {

    if (this.note.date === undefined) {

      const currentYear = (new Date(Date.now())).getFullYear();
      
      const currentMonth = (new Date(Date.now())).getMonth();

      this.navCtrl.setRoot(CalendarPage, {
        'year': currentYear,
        'month': currentMonth
      });

    } else {

      const currentYear = (new Date(this.note.date)).getFullYear();
      
      const currentMonth = (new Date(this.note.date)).getMonth();
      
      this.navCtrl.setRoot(CalendarPage, {
        'year': currentYear,
        'month': currentMonth
      });

    }
      
  }

  save() {

    if (this.noteId === 0) {
      const sql: String = 'INSERT INTO BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?,?,?,?,?);';
      
      this.db.run(sql, [
        this.note.date,
        this.note.title,
        this.note.text,
        this.note.checked,
        this.note.color
      ]);
      
      this.db.run('SELECT MAX (note_id) as id FROM BeeNotes_Notes;', [])[0]['id'];
      
    } else {
      const sql: String = 'UPDATE BeeNotes_Notes set note_date = ?, title = ?, note = ?, checked = ?, color = ? WHERE note_id = ?;';
      
      this.db.run(sql, [
        this.note.date,
        this.note.title,
        this.note.text,
        this.note.checked,
        this.note.color,
        this.note.id
      ]);
      
    }
    
    this.returnToCalendar();
  }

  cancel() {
    this.returnToCalendar();
  }

  dateToValue() {

    if (this.note.date) {

      // https://stackoverflow.com/questions/23593052/format-javascript-date-to-yyyy-mm-dd
      const d = new Date(this.note.date);
      const month = '' + (d.getMonth() + 1);
      const day = '' + d.getDate();
      const year = d.getFullYear();

      const paddedMonth = (month.length < 2) ? '0' + month : month;
      const paddedDay = (day.length < 2) ? '0' + day : day;

      return year + '-' + paddedMonth + '-' + paddedDay;
    } else {
      return '';
    }
  }
}
