import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseManager } from '../../app/DatabaseManager';
import { CalendarPage } from '../calendar/calendar';
import { ListNote } from './ListNote';
import { TextNote } from '../note-editor/TextNote';
import * as $ from 'jquery';
import 'jqueryui';

/**
 * Generated class for the ListEditorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'list-editor'
})
@Component({
  selector: 'page-list-editor',
  templateUrl: 'list-editor.html',
})
export class ListEditorPage {

  private listId = 0;
  
  public listNote = new ListNote;

  public listItems: Array<TextNote> = new Array<TextNote>();

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private db: DatabaseManager,
    private elementRef: ElementRef) {
  }

  ionViewDidLoad() {
    if (this.navParams.get('id')) {
      this.listId = this.navParams.get('id');
    }
    
    this.listNote = new ListNote();
    
    this.listNote.color = '#000000';

    const tmpTime = new Date();
    tmpTime.setHours(0);
    tmpTime.setMinutes(0);
    tmpTime.setSeconds(0);
    tmpTime.setMilliseconds(0);

    this.listNote.date = tmpTime.getTime();

    if (this.listId !== 0) {

      const mainSql: String = 'SELECT * FROM BeeNotes_Lists WHERE list_id = ?;';

      const listSql: String = 'SELECT * FROM BeeNotes_Notes WHERE note_id IN (SELECT distinct note_id FROM BeeNotes_List_To_Note WHERE list_id = ?);';

      const dbMainResult = this.db.run(mainSql, [this.listId]);
      const dbListResult = this.db.run(listSql, [this.listId]);

      if (dbMainResult.length > 0) {

        const tmpRow = dbMainResult[0];

        this.listNote.id = tmpRow['list_id'];
        this.listNote.date = tmpRow['list_date'];
        this.listNote.title = tmpRow['title'];
        this.listNote.color = tmpRow['color'];

      }

      if (dbListResult.length > 0) {

        for (const tmpRow of dbListResult) {

          const tmpNote: TextNote = new TextNote();

          this.listItems.push(tmpNote.param_constructor(tmpRow['note_id'],
            tmpRow['note_date'],
            tmpRow['title'],
            tmpRow['note'],
            tmpRow['color'],
            tmpRow['checked']));
        }

      }
    }
    
    const listEditorComponent = this;

    // NOTE: when using the following, attaching any jquery listener appears to break 2-way binding
    $(this.elementRef.nativeElement).find('.date-picker').datepicker({
      changeMonth: true,
      changeYear: true,
      onSelect: function(dateText: string) {
        listEditorComponent.listNote.date = (new Date(dateText)).getTime();
        
      }
    });

  }

  returnToCalendar() {

    if (this.listNote.date === undefined) {

      const currentYear = (new Date(Date.now())).getFullYear();
      
      const currentMonth = (new Date(Date.now())).getMonth();
      
      this.navCtrl.setRoot(CalendarPage, {
        'year': currentYear,
        'month': currentMonth
      });

    } else {

      const currentYear = (new Date(this.listNote.date)).getFullYear();
      
      const currentMonth = (new Date(this.listNote.date)).getMonth();
      
      this.navCtrl.setRoot(CalendarPage, {
        'year': currentYear,
        'month': currentMonth
      });

    }
      
  }

  save() {

    const listToNoteSql: String = 'INSERT INTO BeeNotes_List_To_Note (list_id, note_id) VALUES (?,?);';
    
    if (this.listId === 0 || this.listNote.id === undefined) {
      const sql: String = 'INSERT INTO BeeNotes_Lists (list_date, title, color) VALUES (?,?,?);';
      
      this.db.run(sql, [
        this.listNote.date,
        this.listNote.title,
        this.listNote.color
      ]);
      
      this.listId = this.db.run('SELECT MAX (list_id) as id FROM BeeNotes_Lists', [])[0]['id'];

      const noteSql: String = 'INSERT INTO BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?,?,?,?,?);';

      for (const item of this.listItems) {
        
        this.db.run(noteSql, [
          item.date,
          item.title,
          item.text,
          item.checked,
          item.color
        ]);
        
        const tmpNoteId = this.db.run('SELECT MAX (note_id) as id FROM BeeNotes_Notes;', {})[0]['id'];

        this.db.run(listToNoteSql, [this.listId, tmpNoteId]);

      }

    } else {
      const sql: String = 'UPDATE BeeNotes_Lists set list_date = ?, title = ?, color = ? WHERE list_id = ?;';
      
      this.db.run(sql, [
        this.listNote.date,
        this.listNote.title,
        this.listNote.color,
        this.listNote.id
      ]);
      
      for (const item of this.listItems) {
            
        if (item.id === 0 || item.id === null || item.id === undefined) {
          const noteInsertSql: String = 'INSERT INTO BeeNotes_Notes (note_date, title, note, checked, color) VALUES (?,?,?,?,?);';
          
          this.db.run(noteInsertSql, [
            item.date,
            item.title,
            item.text,
            item.checked,
            item.color
          ]);
          const tmpNoteId = this.db.run('SELECT MAX (note_id) as id FROM BeeNotes_Notes;', [])[0]['id'];
        
          this.db.run(listToNoteSql, [this.listId, tmpNoteId]);
        
        } else {
          const noteUpdateSql: String = 'UPDATE BeeNotes_Notes set note_date = ?, title = ?, note = ?, checked = ?, color = ? WHERE note_id = ?;';
          
          this.db.run(noteUpdateSql, [
            item.date,
            item.title,
            item.text,
            item.checked,
            item.color,
            item.id
          ]);
          
        }
      }

    }

    this.returnToCalendar();
  }

  cancel() {
    this.returnToCalendar();
  }

  dateToValue() {

    if (this.listNote.date) {

      //NOTE: https://stackoverflow.com/questions/23593052/format-javascript-date-to-yyyy-mm-dd
      const d = new Date(this.listNote.date);
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

  addItem() {
    this.listItems.push(new TextNote());
  }

  removeItem(item: TextNote) {
    this.listItems.splice(this.listItems.indexOf(item), 1);

    if (item.id !== 0) {
      this.db.run('DELETE FROM BeeNotes_Notes WHERE note_id = ?;', [item.id]);
      this.db.run('DELETE FROM BeeNotes_List_To_Note WHERE note_id = ?;', [item.id]);
    }

  }

  changeCheckBoxValue(item: TextNote) {
    item.checked = ((item.checked === 0 || item.checked === undefined) ? 1 : 0);
  }

  //NOTE: may want to revisit...
  numberToCheckValue(item: TextNote) {
    return (item.checked !== 0 && item.checked !== null && item.checked !== undefined);
  }
    
}
