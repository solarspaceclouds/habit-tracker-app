import React, { useState, useEffect } from 'react';
import AddHabit from './AddHabit';
import HabitList from './HabitList';
import SignIn from './SignIn'; 
import SignOut from './SignOut'; 
import SignUp from './SignUp';
import StreakChart from './StreakChart';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, query, where, increment } from 'firebase/firestore';
import './App.css';

function App() {
  const [habits, setHabits] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(collection(db, 'habits'), where('userId', '==', currentUser.uid));
        onSnapshot(q, snapshot => {
          setHabits(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        });
      } else {
        setHabits([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addHabit = async (habitText, trackingType) => {
    if (!user) {
      console.error('No user signed in!');
      return;
    }

    const newHabit = {
      text: habitText, 
      count: 0, 
      trackingType, // 'daily' or 'weekly'
      userId: user.uid,
      createdDate: new Date().toISOString(), // Add creation date
      completions: []
    };

    await addDoc(collection(db, 'habits'), newHabit);
  };

  const updateStreak = (habit, increment) => {
    const lastCompleted = new Date(habit.lastCompletedDate);
    const today = new Date();
  
    if (habit.trackingType === 'daily') {
      // Daily tracking logic
      if (increment && lastCompleted.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString()) {
        return habit.streak + 1;
      } else if (increment) {
        return 1; // Reset streak if not consecutive
      }
    } else if (habit.trackingType === 'weekly') {
      // Weekly tracking logic
      if (increment && getWeekNumber(lastCompleted) === getWeekNumber(new Date(today.setDate(today.getDate() - 7)))) {
        return habit.streak + 1;
      } else if (increment) {
        return 1; // Reset streak if not in the same week
      }
    }
  
    return habit.streak; // Return existing streak if no increment
  };

  const getWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };
  
  

  const incrementCount = async (id) => {
    const habitIndex = habits.findIndex(h => h.id === id);
    if (habitIndex === -1) {
      console.error("Habit not found");
      return;
    }
  
    const habit = habits[habitIndex];
    const today = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    const habitRef = doc(db, 'habits', id);

    let updatedCompletions = [...habit.completions];
    const existingCompletionIndex = updatedCompletions.findIndex(c => c.date === today);
  
    if (existingCompletionIndex >= 0) {
      updatedCompletions[existingCompletionIndex].count += 1;
    } else {
      updatedCompletions.push({ date: today, count: 1 });
    }
  
  
    const updatedHabit = {
      ...habit,
      count: habit.count + 1,
      lastCompletedDate: new Date().toISOString(),
      streak: updateStreak(habit, true) // Pass true to indicate increment
    };
  
    try {
      await updateDoc(habitRef, { completions: updatedCompletions }, updatedHabit);
    } catch (error) {
      console.error("Error incrementing habit: ", error);
    }
  };
  
  
  const decrementCount = async (id) => {
    const habitIndex = habits.findIndex(h => h.id === id);
    if (habitIndex === -1) {
      console.error("Habit not found");
      return;
    }
    const habit = habits[habitIndex];
    const today = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
  
    let updatedCompletions = [...habit.completions];
    const existingCompletionIndex = updatedCompletions.findIndex(c => c.date === today);
  
    if (existingCompletionIndex >= 0) {
      const updatedCount = updatedCompletions[existingCompletionIndex].count - 1;
      if (updatedCount > 0) {
        updatedCompletions[existingCompletionIndex].count = updatedCount;
      } else {
        // Option 1: Keep the record with zero count
        updatedCompletions[existingCompletionIndex].count = 0;
  
        // Option 2: Remove the record entirely
        // updatedCompletions.splice(existingCompletionIndex, 1);
      }
    }
    const habitRef = doc(db, 'habits', id);
    try {
      await updateDoc(habitRef, { completions: updatedCompletions },{
        count: increment(-1)  // Decrement but ensure it doesn't go below 0 in Firestore rules or in the UI
      });
    } catch (error) {
      console.error("Error decrementing habit: ", error);
    }
  };
  
  const deleteHabit = async (id) => {
    const habitRef = doc(db, 'habits', id);
    try {
      await deleteDoc(habitRef);
    } catch (error) {
      console.error("Error deleting habit: ", error);
    }
  };

  return (
    <div className="App">
      <h1>Habit Tracker</h1>
      <SignOut />
      {user ? (
        <>
        <div className="content">
          
          <AddHabit addHabit={addHabit} />
          <HabitList 
            habits={habits} 
            incrementCount={incrementCount} 
            decrementCount={decrementCount} 
            deleteHabit={deleteHabit} 
          />
          <div className="streakChart">
          <StreakChart habits={habits} />
        </div>
        </div>
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
