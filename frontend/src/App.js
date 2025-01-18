import './App.css';
import Sidebar from './components/Sidebar.js';
import React, { useState } from "react";


const App = () => {
  const [conferences, setConferences] = useState([
    {
      id: 1,
      title: "Conferința 1",
      description: "Descrierea conferinței 1",
      date: "2025-01-20",
      reviewers: [{ id: 1, name: "Reviewer 1" }],
    },
  ]);

  const userRole = "organizer";

  const handleAddConference = (newConference) => {
    setConferences((prevConferences) => [...prevConferences, newConference]);
  };

  return (
    <div>
      <h1>Conferințe</h1>
      <Sidebar
        conferences={conferences}
        onAddConference={handleAddConference}
        userRole={userRole}
      />
    </div>
  );
};

export default App;
