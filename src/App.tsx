import React, { useState, useEffect } from 'react';
import './App.css';
import Input from './components/Input'
import { ToDo } from './model';
// Browser DB
import { MyAppDatabase } from './Dexie'
import SingleTodo from './components/SingleTodo';


let db = new MyAppDatabase()

const App: React.FC = () =>  {
  const [todo, setTodo] = useState<string>('');
  const [toDos, setToDos] = useState<ToDo[]>([]);
  const [toggleSave, setToggleSave] = useState<Boolean>(false)

  // Load Data from Client DB on page refresh
  useEffect(() => {
    db.transaction('rw', db.table('tododb'), async () => {
      let dbData = await db.table('tododb').toArray();
      // console.log('--DB Pull--');
      // console.log(dbData)
      setToDos(dbData)
    });
  }, [])


  // Write to browser DB on change
  useEffect(() => {
    console.log('---DB Clear---')     // Temp solution to clear database before each write 
    db.transaction('rw', db.table('tododb'), async () => {
      await db.table('tododb').clear()
    });

    console.log('---DB SAVE---')
    toDos.forEach((item:any) => {
      db.transaction('rw', db.table('tododb'), async () => {
        await db.table('tododb').put(item);
      });

    })
  }, [toggleSave])

  const handleAdd = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if(todo) {
      setToDos([...toDos, { id: Date.now(), todo:todo, isDone:false, children: [] }])
      setTodo('')
      setToggleSave(!toggleSave)
    }
  }

  return (
    <div className='app'>
      <span className='heading'>Ultimate To-Do App</span>
      <Input todo={todo} setTodo={setTodo} handleAdd={handleAdd}/>
      
      
      <div className='todos'>
            {toDos.map((todo) => (
                <div className='single_todos_container'>
                    <SingleTodo todo={todo} key={todo.id} toDos={toDos} setToDos={setToDos} isChild={false} toggleSave={toggleSave} setToggleSave={setToggleSave}/>
                </div>
            ))}      
        </div>    
    </div>
  )
}

export default App

