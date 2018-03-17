import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DayViewEntry } from './DayViewEntry';
import { DatabaseManager } from '../../app/DatabaseManager';
import { WindowRef } from '../../app/WindowRef';
import { ListEditorPage } from '../list-editor/list-editor';
import { NoteEditorPage } from '../note-editor/note-editor';

/**
 * Generated class for the DayViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'day-view'
})
@Component({
  selector: 'page-day-view',
  templateUrl: 'day-view.html',
})
export class DayViewPage {

  public currentYear: number;
  public currentMonth: number;
  public currentDay: number;
  public currentDate: Date;
  public currentDateString: string;

  public noteList: Array<DayViewEntry> = new Array<DayViewEntry>();

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private db: DatabaseManager,
    private windowRef: WindowRef) {
  }

  ionViewDidLoad() {
    
    this.currentYear = this.navParams.get('year');
    this.currentMonth = this.navParams.get('month');
    this.currentDay = this.navParams.get('day');

    this.currentDate = new Date(this.currentYear, this.currentMonth, this.currentDay);

    this.currentDate.setHours(0);
    this.currentDate.setMinutes(0);
    this.currentDate.setSeconds(0);
    this.currentDate.setMilliseconds(0);

    this.refreshData();

    this.currentDateString = this.currentDate
      .toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }).toString();

  }

  public openNote(id: number, type: string) {

    this.navCtrl.setRoot(((type === 'list') ? ListEditorPage : NoteEditorPage), {
      'id': id
    });
  }

  public refreshData() {

    this.noteList = this.noteList.slice(0);

    const dbResultsNotes: Array<any> = this.db.run('SELECT note_id as id, title, color, \'note\' as type FROM BeeNotes_Notes WHERE note_date = ? AND note_id NOT IN (SELECT distinct note_id FROM BeeNotes_List_To_Note) UNION ' + 
        'SELECT list_id as id, title, color, \'list\' as type FROM BeeNotes_Lists WHERE list_date = ? ORDER BY color, title',
      [this.currentDate.getTime(), this.currentDate.getTime()]);

    const tmpComp = this;

    for (const entry of dbResultsNotes) {
      tmpComp.noteList.push(new DayViewEntry(entry.id, 
        entry.title, tmpComp.windowRef.invertColor(entry.color, true), entry.color, entry.type));
    }

  }

  public deleteNote(id: number, type: string) {
    if (type === 'list') {
      this.db.run('DELETE FROM BeeNotes_Lists WHERE list_id = ?', [id]);

      this.db.run('DELETE FROM BeeNotes_Notes WHERE note_id in (SELECT note_id FROM BeeNotes_List_To_Note where list_id = ?) ', [id]);
      this.db.run('DELETE FROM BeeNotes_List_To_Note WHERE list_id = ?', [id]);
    } else {
      this.db.run('DELETE FROM BeeNotes_Notes WHERE note_id = ?', [id]);
      this.db.run('DELETE FROM BeeNotes_List_To_Note WHERE note_id = ?', [id]);
    }

    this.refreshData();
    
  }

}
