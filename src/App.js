import React, { useState, useEffect } from 'react';
import AddHabit from './AddHabit';
import HabitList from './HabitList';
import { db } from './firebase';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, query } from 'firebase/firestore';
import './App.css';

function App() {
  console.log("appwooo")
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'habits')), (snapshot) => {
      
      setHabits(snapshot.docs.map(doc =>{ 
        const data = doc.data();  
        return { ...data, id: doc.id }}));
    });

    return () => unsubscribe(); // Detach the listener when the component unmounts
  }, []);

  const addHabit = async (habitText, allowsMultiple) => {
    const newHabit = {
      text: habitText, 
      count: 0, 
      allowsMultiple, 
      lastCompletedDate: null, 
      streak: 0
    };
    await addDoc(collection(db, 'habits'), newHabit);
  };

  const toggleComplete = async (index) => {
    const habit = habits[index];
    const habitRef = doc(db, 'habits', habit.id);
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let updatedHabit = { ...habit };

    if (habit.allowsMultiple || habit.count === 0) {
      updatedHabit.count += 1;
      updatedHabit.lastCompletedDate = today;
      updatedHabit.streak = new Date(habit.lastCompletedDate).toDateString() === yesterday.toDateString() ? habit.streak + 1 : 1;
    } else {
      updatedHabit.count = 0;
      updatedHabit.streak = 0;
    }

    await updateDoc(habitRef, updatedHabit);
  };

  const deleteHabit = async (index) => {
    const habitRef = doc(db, 'habits', habits[index].id);
    await deleteDoc(habitRef);
  };

  return (
    <div className="App">
      <h1>Habit Tracker</h1>
      <br></br>
      <AddHabit addHabit={addHabit} />
      <br></br>
      <HabitList habits={habits} toggleComplete={toggleComplete} deleteHabit={deleteHabit} />
    </div>
  );
}

export default App;
