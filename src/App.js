import React, { useState, useEffect } from 'react';
import AddHabit from './AddHabit';
import HabitList from './HabitList';
import SignIn from './SignIn'; 
import SignOut from './SignOut'; 
import SignUp from './SignUp';
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
      userId: user.uid
    };
    await addDoc(collection(db, 'habits'), newHabit);
  };

  const incrementCount = async (id) => {
    const habitRef = doc(db, 'habits', id);
    try {
      await updateDoc(habitRef, {
        count: increment(1)  // Use Firestore increment to ensure atomic update
      });
    } catch (error) {
      console.error("Error incrementing habit: ", error);
    }
  };
  
  const decrementCount = async (id) => {
    const habitRef = doc(db, 'habits', id);
    try {
      await updateDoc(habitRef, {
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
