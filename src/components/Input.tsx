import React, { useRef } from 'react'
import './styles.css';
import TextField from '@mui/material/TextField';


interface Props{
    todo: string;
    setTodo: React.Dispatch<React.SetStateAction<string>>;
    handleAdd: (e: React.SyntheticEvent) => void;
}

const Input = ({todo, setTodo, handleAdd}: Props) => {

    return (
        <form className='input' onSubmit={(e) => handleAdd(e)} > 
            <TextField id="outlined-basic" 
                label="Enter To Do" 
                variant="filled" 
                className='input_field' 
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
            />

            <button className='input_submit' type='submit'>Add</button>

        </form>
    )
}

export default Input
