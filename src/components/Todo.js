import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const Todo = ({ todo }) => {
    return (
        <List className="todo__list">
            <ListItem>
                <ListItemText primary={todo} />
            </ListItem>
        </List>
    )
};

export default Todo;
