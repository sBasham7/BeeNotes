import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseManager } from '../../app/DatabaseManager';
import { WindowRef } from '../../app/WindowRef';
import { ListEditorPage } from '../list-editor/list-editor';
import { NoteEditorPage } from '../note-editor/note-editor';
import { SearchResultEntry } from './SearchResultEntry';
import * as $ from 'jquery';
import 'jqueryui';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  public content = '';

  public color = '';

  public startDate: number;
  public endDate: number;

  public noteList: Array<SearchResultEntry> = new Array<SearchResultEntry>();
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private db: DatabaseManager,
    private elementRef: ElementRef,
    private windowRef: WindowRef) {
  }

  ionViewDidLoad() {
    
    const SearchComponent = this;

    // NOTE: when using the following, attaching any jquery listener appears to break 2-way binding
    $(this.elementRef.nativeElement).find('.date-picker').datepicker({
      changeMonth: true,
      changeYear: true,
      onSelect: function (dateText: string) {
        SearchComponent.startDate = (new Date(dateText)).getTime();

      }
    });

    // NOTE: when using the following, attaching any jquery listener appears to break 2-way binding
    $(this.elementRef.nativeElement).find('.date-picker').datepicker({
      changeMonth: true,
      changeYear: true,
      onSelect: function (dateText: string) {
        SearchComponent.endDate = (new Date(dateText)).getTime();

      }
    });
  }

  startDateToValue() {
    return this.dateToValue(this.startDate);
  }

  endDateToValue() {
    return this.dateToValue(this.endDate);
  }

  dateToValue(dateLong: number) {

    if (dateLong) {

      // https://stackoverflow.com/questions/23593052/format-javascript-date-to-yyyy-mm-dd
      const d = new Date(dateLong);
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

  search() {
    
    let clause1 = '';
    let clause2 = '';

    const params = [];

    let sql = 'SELECT note_id as id, title, color, \'note\' as type, note_date as date FROM BeeNotes_Notes WHERE <CLAUSE1> note_id NOT IN (SELECT distinct note_id FROM BeeNotes_List_To_Note) UNION ' + 
      'SELECT list_id as id, title, color, \'list\' as type, list_date as date FROM BeeNotes_Lists <CLAUSE2> ORDER BY date, color, title';

    if (this.content !== '') {

      clause1 += ' (lower(title) like ? or lower(note) like ?) ';
      params.push('%' + this.content.toLowerCase() + '%');
      params.push('%' + this.content.toLowerCase() + '%');

      clause2 += ' lower(title) like ? ';
      params.push('%' + this.content.toLowerCase() + '%');
      
    }

    if (this.color !== '') {
        
      if (clause1 !== '') {
        clause1 += ' or ';
      }

      if (clause2 !== '') {
        clause2 += ' or ';
      }

      clause1 += ' lower(color) like ? ';
      params.push('%' + this.color.toLowerCase() + '%');
      
      clause2 += ' lower(color) like ? ';
      params.push('%' + this.color.toLowerCase() + '%');

    }

    if (this.endDate && this.endDate !== 0 && this.endDate !== Number.NaN) {
                
      if (clause1 !== '') {
        clause1 += ' or ';
      }

      if (clause2 !== '') {
        clause2 += ' or ';
      }

      clause1 += ' note_date <= ? ';
      params.push(this.endDate);
      
      clause2 += ' list_date <= ? ';
      params.push(this.endDate);

    }

    if (this.startDate && this.startDate !== 0 && this.startDate !== Number.NaN) {
              
      if (clause1 !== '') {
        clause1 += ' or ';
      }

      if (clause2 !== '') {
        clause2 += ' or ';
      }

      clause1 += ' note_date >= ? ';
      params.push(this.endDate);
      
      clause2 += ' list_date >= ? ';
      params.push(this.endDate);

    }

    sql = sql.replace('<CLAUSE1>', ((clause1 !== '') ? ' (' + clause1 + ') and ' : ''));
    sql = sql.replace('<CLAUSE2>', ((clause2 !== '') ? ' WHERE ' + clause2 : ''));

    const dbResultsNotes: Array<any> = this.db.run(sql,
      params);

    this.noteList = new Array<SearchResultEntry>();

    const tmpComp = this;

    for (const entry of dbResultsNotes) {
      tmpComp.noteList.push(new SearchResultEntry(entry.id, 
        entry.title, 
        tmpComp.windowRef.invertColor(entry.color, true), 
        entry.color, 
        entry.type, 
        entry.date));
    }

  }

  public openNote(id: number, type: string) {

    this.navCtrl.setRoot(((type === 'list') ? ListEditorPage : NoteEditorPage), {
      'id': id
    });
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

    this.search();
  }
   
}
