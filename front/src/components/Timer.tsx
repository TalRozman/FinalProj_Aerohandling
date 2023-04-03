import React from 'react';
import { useState, useEffect } from 'react';

const Timer = (props: any) => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    const deadline = new Date(props.deadline)

    const getTime = (deadline: string) => {
        const time = Date.parse(deadline) - Date.now();

        setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
        setMinutes(Math.floor((time / 1000 / 60) % 60));
    };

    useEffect(() => {
        const interval = setInterval(() => getTime(deadline.toISOString()), 1000);

        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, []);

    return (
        <div className="timer">
            {(hours > 0 || hours === 0 ) && "in"} {hours === 0 ? "" : hours > 0 ? hours + " hours and" : -hours + " hours and"} {minutes > 0 ? minutes : -minutes} minutes<br />{hours < 0 && "ago"}
        </div>
    );
};

export default Timer;