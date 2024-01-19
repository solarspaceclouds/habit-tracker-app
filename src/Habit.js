import React from 'react';
// import DeleteIcon from "@mui/icons-material/Delete";

// function Habit({ habit, index, toggleComplete, deleteHabit }) {
//   return (
//     <tr>
//       <td>{habit.text}</td>
//       <td>{habit.count}</td>
//       <td>{habit.allowsMultiple ? 'Multiple' : 'Single'}</td>
//       <td>{habit.streak}</td>
//       <td>{habit.lastCompletedDate ? habit.lastCompletedDate : 'N/A'}</td>
//       <td>
//         <button onClick={() => toggleComplete(index)}>
//           {habit.allowsMultiple ? 'Increment' : (habit.count > 0 ? 'Mark Incomplete' : 'Mark Complete')}
//         </button>
//         <button onClick={() => deleteHabit(index)}>Delete</button>
//       </td>
//     </tr>
//   );
// }

export default Habit;
function Habit({ habit, index, incrementCount, decrementCount, deleteHabit }) {
  return (
    <div>
      <span>{habit.text} - Count: {habit.count}</span>
      <button onClick={() => incrementCount(index)}>+</button>
      <button onClick={() => decrementCount(index)}>-</button>
      <button onClick={() => deleteHabit(index)}>Delete</button>
    </div>
  );
}
