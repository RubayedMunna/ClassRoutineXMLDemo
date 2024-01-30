// ViewClassRoutine.js

import React, { useState } from 'react';
import './../App.css';
import ClassRoutineSession from './ClassRoutineSession';

function ViewClassRoutineSession() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState('Sunday');
  const [selectedSessions, setSelectedSessions] = useState(['1-1', '2-1', '3-1']); // Add sessions as needed

  const handleWeekChange = (event) => {
    setSelectedWeek(parseInt(event.target.value, 10));
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  return (
    <div className="App">
      <h1>Class Routine</h1>
      <div className="dropdowns">
        {/* Week Selection Dropdown */}
        <label>Week:</label>
        <select value={selectedWeek} onChange={handleWeekChange}>
          <option value={1}>Week 1</option>
          <option value={2}>Week 2</option>
          <option value={3}>Week 3</option>
          {/* Add more weeks as needed */}
        </select>

        {/* Day Selection Dropdown */}
        <label>Day:</label>
        <select value={selectedDay} onChange={handleDayChange}>
          <option value="Sunday">Sunday</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          {/* Add more days as needed */}
        </select>
      </div>

      {/* Display Class Routine for each selected session */}
      {selectedSessions.map((session, index) => (
        <ClassRoutineSession key={index} week={selectedWeek} day={selectedDay} session={session} />
      ))}
    </div>
  );
}

export default ViewClassRoutineSession;
