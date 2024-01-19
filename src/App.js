import React, { useState, useEffect } from 'react';
import AddHabit from './AddHabit';
import HabitList from './HabitList';
import SignIn from './SignIn'; 
import SignOut from './SignOut'; 
import SignUp from './SignUp';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import './App.css';

function App() {
  const [habits, setHabits] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(collection(db, 'habits'), where('userId', '==', currentUser.uid));
        return onSnapshot(q, snapshot => {
          setHabits(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        });
      } else {
        setHabits([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addHabit = async (habitText, allowsMultiple, trackingType) => {
    // Ensure user is logged in
    if (!user) {
      console.error('No user signed in!');
      return;
    }

    const newHabit = {
      text: habitText,
      count: 0,
      allowsMultiple,
      lastCompletedDate: null,
      streak: 0,
      userId: user.uid,
      trackingType, // 'daily' or 'weekly'
    };
    await addDoc(collection(db, 'habits'), newHabit);
  };

  const toggleComplete = async (index) => {
    const habit = habits[index];
    const habitRef = doc(db, 'habits', habit.id);
    const today = new Date().toDateString();
  
    let updatedHabit = { ...habit };
  
    if (habit.trackingType === 'daily') {
      // Daily tracking logic
      updatedHabit.count = habit.count === 0 ? 1 : 0;
    } else if (habit.trackingType === 'weekly') {
      // Weekly tracking logic
      // Example: Increment count if it's a new week or reset to 1 if not
      const lastCompletedWeek = new Date(habit.lastCompletedDate).getWeek();
      const currentWeek = new Date().getWeek();
      updatedHabit.count = currentWeek !== lastCompletedWeek ? 1 : habit.count + 1;
    }
    updatedHabit.lastCompletedDate = today;
  
    try {
      await updateDoc(habitRef, updatedHabit);
    } catch (error) {
      // Handle error (e.g., show a message to the user)
      console.error("Error updating habit: ", error);
    }
  };

  const deleteHabit = async (index) => {
    const habitRef = doc(db, 'habits', habits[index].id);
    await deleteDoc(habitRef);
  };

  const incrementCount = async (index) => {
    const habit = habits[index];
    const habitRef = doc(db, 'habits', habit.id);

    let updatedHabit = { ...habit, count: habit.count + 1 };

    try {
      await updateDoc(habitRef, updatedHabit);
    } catch (error) {
      console.error("Error updating habit: ", error);
    }
  };

  const decrementCount = async (index) => {
    const habit = habits[index];
    const habitRef = doc(db, 'habits', habit.id);

    // Prevent count from going below zero
    if (habit.count > 0) {
      let updatedHabit = { ...habit, count: habit.count - 1 };

      try {
        await updateDoc(habitRef, updatedHabit);
      } catch (error) {
        console.error("Error updating habit: ", error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Habit Tracker</h1>
      {user ? (
        <>
          <SignOut />
          <AddHabit addHabit={addHabit} />
          <HabitList 
            habits={habits} 
            incrementCount={incrementCount} 
            decrementCount={decrementCount} 
            deleteHabit={deleteHabit} 
          />
        </>
      ) : (
        <>
          <SignIn />
          <SignUp />
        </>
      )}
    </div>
  );
}

export default App;


