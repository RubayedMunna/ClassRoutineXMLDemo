// ClassRoutineSession.js

import React, { useState, useEffect } from 'react';

const ClassRoutineSession = ({ week, day }) => {
  const [classRoutineData, setClassRoutineData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/ClassRoutineSession.xml');
        const data = await response.text();
        setClassRoutineData(new window.DOMParser().parseFromString(data, 'text/xml'));
      } catch (error) {
        console.error('Error fetching class routine data:', error);
      }
    };

    fetchData();
  }, []);

  const findClassSchedule = () => {
    if (!classRoutineData) {
      return { session: '', beforeLunch: [], afterLunch: [] };
    }

    const selectedWeek = classRoutineData.querySelector(`week[number="${week}"] day[name="${day}"]`);

    if (selectedWeek) {
      const session = selectedWeek.closest('session').getAttribute('sem');
      console.log(session)
      const beforeLunch = Array.from(selectedWeek.querySelectorAll('before_lunch timeslot')).map((timeslot) => ({
        time: timeslot.getAttribute('time'),
        class: timeslot.querySelector('class').textContent,
      }));

      const afterLunch = Array.from(selectedWeek.querySelectorAll('after_lunch timeslot')).map((timeslot) => ({
        time: timeslot.getAttribute('time'),
        class: timeslot.querySelector('class').textContent,
      }));

      return { session, beforeLunch, afterLunch };
    }
    return { session: '', beforeLunch: [], afterLunch: [] };
  };

  const { session, beforeLunch, afterLunch } = findClassSchedule();

  // Check if classRoutineData is not null before rendering
  if (!classRoutineData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="class-routine">
      <table border={1}>
        <thead>
          <tr>
            <th rowSpan={2}>Session</th>
            <th colSpan={3}>Before Lunch</th>
            <th rowSpan={2}>Lunch Break</th>
            <th colSpan={2}>After Lunch</th>
          </tr>
          <tr>
            <th>9:00 AM - 10:00 AM</th>
            <th>10:25 AM - 11:25 AM</th>
            <th>11:30 AM - 12:30 PM</th>
            <th>1:30 PM - 2:30 PM</th>
            <th>2:45 PM - 3:45 PM</th>
          </tr>
        </thead>
        {/* Before Lunch Schedule */}
        <tbody className="before-lunch">
            <tr>
              <td>{session}</td>
              {beforeLunch.map((timeslot, index) => (
                <td key={index}>{timeslot.class}</td>
              ))}
              <td></td> {/* This is the lunch break cell */}
              {afterLunch.map((timeslot, index) => (
                <td key={index}>{timeslot.class}</td>
              ))}
            </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ClassRoutineSession;
