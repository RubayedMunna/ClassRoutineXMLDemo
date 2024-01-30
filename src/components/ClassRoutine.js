import React, { useState, useEffect } from 'react';

const ClassRoutine = () => {
    const [classRoutine, setClassRoutine] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    useEffect(() => {
        // Function to fetch and parse XML data
        const fetchClassRoutine = async () => {
            try {
                const response = await fetch('/ClassRoutine.xml');
                const xmlData = await response.text();

                // Parse XML using DOMParser
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlData, 'text/xml');

                // Extract data from the DOM document
                const weeks = xmlDoc.querySelectorAll('week');
                const parsedData = Array.from(weeks).map((week) => {
                    const weekNumber = week.getAttribute('number');
                    const days = week.querySelectorAll('day');
                    const parsedDays = Array.from(days).map((day) => {
                        const dayName = day.getAttribute('name');
                        const sessions = day.querySelectorAll('session');
                        const parsedSessions = Array.from(sessions).map((session, sessionIndex) => {
                            const semester = session.getAttribute('sem');
                            const beforeLunchSlots = session.querySelectorAll('before_lunch > timeslot');
                            const afterLunchSlots = session.querySelectorAll('after_lunch > timeslot');

                            const parsedBeforeLunch = Array.from(beforeLunchSlots).map((slot) => ({
                                time: slot.getAttribute('time'),
                                class: slot.querySelector('class').textContent,
                            }));

                            const parsedAfterLunch = Array.from(afterLunchSlots).map((slot) => ({
                                time: slot.getAttribute('time'),
                                class: slot.querySelector('class').textContent,
                            }));

                            return {
                                session: `Session ${sessionIndex + 1}`,
                                sem: semester,
                                before_lunch: { timeslot: parsedBeforeLunch },
                                after_lunch: { timeslot: parsedAfterLunch },
                            };
                        });

                        return { name: dayName, session: parsedSessions };
                    });

                    return { number: weekNumber, day: parsedDays };
                });

                setClassRoutine({ week: parsedData });
                setSelectedWeek(parsedData[0].number);
                setSelectedDay(parsedData[0].day[0].name);
            } catch (error) {
                console.error('Error fetching or parsing XML:', error);
            }
        };

        fetchClassRoutine();
    }, []);

    const handleWeekChange = (weekNumber) => {
        setSelectedWeek(weekNumber);
        setSelectedDay(null); // Reset selected day when changing the week
    };

    const handleDayChange = (dayName) => {
        setSelectedDay(dayName);
    };

    return (
        <div>
            <h1>Class Routine</h1>
            {classRoutine && (
                <div>
                    {/* Dropdown for selecting week */}
                    <label>Select Week:</label>
                    <select value={selectedWeek} onChange={(e) => handleWeekChange(e.target.value)}>
                        {classRoutine.week.map((week, index) => (
                            <option key={index} value={week.number}>
                                Week {week.number}
                            </option>
                        ))}
                    </select>
                    {/* Dropdown for selecting day */}
                    <label>Select Day:</label>
                    <select value={selectedDay} onChange={(e) => handleDayChange(e.target.value)}>
                        {classRoutine.week
                            .find((week) => week.number === selectedWeek)
                            .day.map((day, index) => (
                                <option key={index} value={day.name}>
                                    {day.name}
                                </option>
                            ))}
                    </select>
                    {/* Display table based on selected week and day */}
                    {selectedWeek && selectedDay && (
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
                            <tbody>
                                {classRoutine.week
                                    .find((week) => week.number === selectedWeek)
                                    .day.find((day) => day.name === selectedDay)
                                    .session.map((session) => (
                                        <tr key={session.session}>
                                            <td>{session.session}</td>
                                            {session.before_lunch.timeslot.map((slot, slotIndex) => (
                                                <td key={slotIndex}>{slot.class}</td>
                                            ))}
                                            <td></td>
                                            {session.after_lunch.timeslot.map((slot, slotIndex) => (
                                                <td key={slotIndex}>{slot.class}</td>
                                            ))}
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default ClassRoutine;
