import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import "./AppointmentCalendar.css";
import { useRef, useEffect } from 'react';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale("en");

// Customize dayjs locale for "Mon", "Tue", etc.
dayjs.locale({
    ...dayjs.Ls.en,
    weekStart: 1,
});
const NoTransition = ({ children }) => <>{children}</>;

const TIME_SLOTS = [
    { start: "09:00", durationMinutes: 60 },
    { start: "10:15", durationMinutes: 45 },
    { start: "11:30", durationMinutes: 90 },
    { start: "13:15", durationMinutes: 60 },
    { start: "14:30", durationMinutes: 45 },
];

export default function AppointmentCalendar(props) {
    const {
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
    } = props;
    const [displayedMonth, setDisplayedMonth] = useState(dayjs().startOf("month"));
    const today = dayjs().startOf("month");
    const dayOfWeekFormatter = (day) => day.format("ddd");

    const calendarRef = useRef(null);
    const [isFiveWeekMonth, setIsFiveWeekMonth] = useState(true)

    const handleDaySelect = (date) => {
        setSelectedDate(date);
        setSelectedTime(null);
    };

    const handleTimeSelect = (startTime) => {
        setSelectedTime(startTime);
    };

    const updateWeekCount = () => {
        if (calendarRef.current) {
            const weekRows = calendarRef.current.querySelectorAll('.MuiDayCalendar-weekContainer');
            setIsFiveWeekMonth(weekRows.length === 10);
        }
    };

    const handleMonthChange = (newMonth) => {
        setDisplayedMonth(newMonth.startOf("month"));
    };

    useEffect(() => {
        updateWeekCount();
    }, [displayedMonth]);


    return (
        <div className="calendar-container" ref={calendarRef}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    value={selectedDate}
                    onChange={handleDaySelect}
                    onMonthChange={handleMonthChange}
                    disablePast
                    disableHighlightToday
                    dayOfWeekFormatter={dayOfWeekFormatter}
                    slots={{
                    Transition: NoTransition, // тут отключаем анимацию
                    }}
                    sx={{
                        width: "100%",
                        height: "auto",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        overflow: "visible",
                        padding: 0,
                        margin: 0,
                        boxSizing: "border-box",
                    }}
                    className="custom-calendar"
                />
            </LocalizationProvider>

            {selectedDate && (
                <div className={`time-slots-container ${isFiveWeekMonth ? "shift-up" : ""}`}> {/* UPDATE */}
                    <div className="time-slots">
                        {TIME_SLOTS.map(({ start, durationMinutes }) => {
                            const startTime = dayjs(start, "HH:mm");
                            const endTime = startTime.add(durationMinutes, "minute");
                            return (
                                <button
                                    key={start}
                                    className={`time-slot ${selectedTime === start ? 'selected' : ''}`}
                                    onClick={() => handleTimeSelect(start)}
                                >
                                    <div className="slot-date">{selectedDate.format("DD.MM")}</div>
                                    <div className="slot-time">
                                        {startTime.format("HH:mm")} – {endTime.format("HH:mm")}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}