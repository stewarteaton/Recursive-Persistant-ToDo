// Browser DB
import Dexie, { Table } from 'dexie';
import { ToDo } from './model';


export class MyAppDatabase extends Dexie {
  // Declare implicit table properties.
  tododb!: Dexie.Table<ToDo[], number>; // number = type of the primkey

  constructor () {
      super("MyAppDatabase");
      this.version(1).stores({
          tododb: 'id, todo, isDone, children',
          //...other tables goes here...
      });
  }
}