import React, { useState } from 'react'
import { ToDo } from '../model'
//icons
import { Add, Edit, Delete, Done} from '@mui/icons-material';
import './styles.css';

type Props = {
    todo: ToDo;
    toDos: ToDo[];
    setToDos:  React.Dispatch<React.SetStateAction<ToDo[]>>;
    isChild: Boolean;
    toggleSave: Boolean;
    setToggleSave: React.Dispatch<React.SetStateAction<Boolean>>;
}

const SingleTodo = ({todo, toDos, setToDos, isChild, toggleSave, setToggleSave}: Props) => {
    const [edit, setEdit] = useState<Boolean>(false)
    const [editTodo, setEditTodo] = useState<string>(todo.todo)

    const handleDelete = (id: number) => {
        // If element is nested, send to recursive function
        if (isChild) handleRecursion(id, 'delete')

        else{
             setToDos(toDos.filter((todo) => todo.id !== id))
            waitForSave()
        }
    }

    const handleDone = (id: number) => {
        handleRecursion(id, 'done')
    }

    const handleEdit = (e: React.KeyboardEvent<HTMLInputElement>, id: number) => {
        e.preventDefault()
        handleRecursion(id, 'edit')
    }

    const addSubItem = (id: number) => {
        handleRecursion(id, 'addNew')
    }

    const handleRecursion = async (id: number, type:string)  => {
        // Deep Copy of ToDos 
        let arr = JSON.parse(JSON.stringify(toDos)); 
        
        if (type == 'delete') {
            // Remove Node from Tree
            arr.forEach((item:ToDo) => {
                function removeFromTree(node:any, name:any) {
                    if (node.id == name) {
                      node = undefined
                    } else {
                      node.children.forEach((child:any, id:any) => {
                        if (!removeFromTree(child, name)) node.children.splice(id, 1)
                      })
                    }
                    return node
                }
                removeFromTree(item, id)
            })
        } else {
            // Create or Edit Node in Tree
            let recursiveSrch = (data:any) => {
                data.forEach((item:any) => {
                    if (item.id == id){
                        if (type == 'addNew') return item.children.push({id: Date.now(), todo: 'new item', isDone: false, children: [] })

                        if (type == 'edit') {
                            item.todo = editTodo;
                            setEdit(false)
                            return
                        }
                        if (type == 'done') return item.isDone = !item.isDone

                    } 
                    if (item.children) recursiveSrch(item.children)
                })
            }
            recursiveSrch(arr)
        }

        // Update State
        setToDos(arr)
        waitForSave()
    }

    const waitForSave = async() => {
        const timeout = (delay:number) => {
            return new Promise( res => setTimeout(res, delay) );
        }
        await timeout(1000); //for 1 sec delay
        setToggleSave(!toggleSave)
    }


    return (
        <>
            <div className='single_todos'>
                { edit ? (
                    <input value={editTodo} onChange={(e) => setEditTodo(e.target.value) } 
                        onKeyPress={(e) => e.key === 'Enter' && handleEdit(e, todo.id)}
                        className='single_todos_text'/>
                ) : (
                    todo.isDone ? (
                        <s className='single_todos_text'>{todo.todo}</s>
                    ) : (
                        <span className='single_todos_text'>{todo.todo}</span>
                    )
                )}


                <div>
                    <span className='icons' onClick={() => addSubItem( todo.id)}>
                        <Add />
                    </span>

                    <span className='icons' onClick={() => {
                        if (!edit && !todo.isDone) setEdit(!edit)
                    }}>
                        <Edit />
                    </span>
                    <span className='icons'onClick={() => handleDelete(todo.id)}>
                        <Delete />
                    </span>
                    <span className='icons' onClick={() => handleDone(todo.id)}>
                        <Done />
                    </span>
                </div>
            </div>

            {/* Recursive Rendering for Sub Items */}
            <div className='sub-item'>
                <ul>
                    { todo.children.map((i)=> (
                        <li>    
                            <SingleTodo todo={i} key={i.id} toDos={toDos} setToDos={setToDos} isChild={true} toggleSave={toggleSave} setToggleSave={setToggleSave}/>
                        </li>
                    ))}
                </ul>
            </div>
    </>
    )
}

export default SingleTodo
