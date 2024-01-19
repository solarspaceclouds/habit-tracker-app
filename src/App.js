import React, { useState, useEffect } from 'react';
import AddHabit from './AddHabit';
import HabitList from './HabitList';
import SignIn from './SignIn'; 
import SignOut from './SignOut'; 
import SignUp from './SignUp';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, query,where } from 'firebase/firestore';
import './App.css';

function App() {

  const [habits, setHabits] = useState([]);
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const unsubscribe = onSnapshot(query(collection(db, 'habits')), (snapshot) => {
      
  //     setHabits(snapshot.docs.map(doc =>{ 
  //       const data = doc.data();  
  //       return { ...data, id: doc.id }}));
  //   });

  //   return () => unsubscribe(); // Detach the listener when the component unmounts
  // }, []);
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

  const addHabit = async (habitText, allowsMultiple) => {
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
      userId: user.uid  // Add the user ID to associate the habit with the user
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
      {user ? (
        <>
          {/* User is signed in, show Habit Tracker and Sign Out components */}
          <SignOut />
          <br />
          <AddHabit addHabit={addHabit} />
          <br />
          <HabitList habits={habits} toggleComplete={toggleComplete} deleteHabit={deleteHabit} />
        </>
      ) : (
        <>
          {/* No user is signed in, show Sign In and Sign Up components */}
          <SignIn />
          <SignUp />
        </>
      )}
    </div>
  );
}


export default App;
