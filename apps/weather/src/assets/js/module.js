


'use strict';

export const weekDayNames = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота"
]

export const monthNames = [
    "Янв",
    "Февр",
    "Март",
    "Апр",
    "Май",
    "Июнь",
    "Июль",
    "Авг",
    "Сент",
    "Окт",
    "Нояб",
    "Дек"
]


export const getDate = function (dateUnix, timezone) {
    const date = new Date((dateUnix + timezone) * 1000)
    const weekDayName = weekDayNames[date.getUTCDay()]
    const monthName = monthNames[date.getUTCMonth()]

    return `${weekDayName} ${date.getUTCDate()}, ${monthName}`
}


export const getTime = function (timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000)
    const hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()
    const period = hours >= 12 ? "PM" : "AM"

    return `${hours % 12 || 12}:${minutes} ${period}`
}


export const getHours = function (timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes}`;
};

export const mps_to_kmh = mps => {
    return (mps * 3600) / 1000
}
