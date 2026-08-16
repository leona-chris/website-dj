export function parseSheetDate(dateStr) {
    if (!dateStr) return null;
    if (dateStr.includes('.')) {
        const parts = dateStr.split('.');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
    }
    return dateStr;
}

export function formatNiceDate(dateStr) {
    if (!dateStr) return '';
    const parsed = parseSheetDate(dateStr);
    const d = new Date(parsed);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace(',', '');
}

export function parseDateTime(dateStr, timeStr) {
    if (!dateStr || !timeStr) return null;
    const dParts = dateStr.split('.');
    if (dParts.length !== 3) return null;
    const tParts = timeStr.split(':');
    if (tParts.length < 2) return null;
    
    const year = parseInt(dParts[2], 10);
    const month = parseInt(dParts[1], 10) - 1;
    const day = parseInt(dParts[0], 10);
    const hours = parseInt(tParts[0], 10);
    const minutes = parseInt(tParts[1], 10);
    
    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes)) return null;
    return new Date(year, month, day, hours, minutes);
}

export function calculateEndDateTime(startObj, durationStr) {
    const tParts = durationStr.split(':');
    if (tParts.length < 2) return null;
    const endObj = new Date(startObj.getTime());
    endObj.setHours(endObj.getHours() + parseInt(tParts[0], 10));
    endObj.setMinutes(endObj.getMinutes() + parseInt(tParts[1], 10));
    return endObj;
}

export function formatTime(dateObj) {
    const h = dateObj.getHours().toString().padStart(2, '0');
    const m = dateObj.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
}

export function formatShortDateWithWeekday(dateObj) {
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const wd = weekdays[dateObj.getDay()];
    const d = dateObj.getDate().toString().padStart(2, '0');
    const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    return `${wd} ${d}.${m}.`;
}

export function generateIcsBlobUrl(gig) {
    const artist = gig.artist || "La Leona & Chris.Me";
    const title = gig.title || "";
    const venue = gig.venue || "";
    const address = gig.address || "";
    const stageFloor = gig.stageFloor || "";
    const link = gig.link || "";

    const evStartDate = gig.eventStartDate || "";
    const evStartTime = gig.eventStartTime || "";
    const evEndDate = gig.eventEndDate || "";
    const evEndTime = gig.eventEndTime || "";

    const setStartDate = gig.setStartDate || "";
    const setStartTime = gig.setStartTime || "";
    const playDuration = gig.playDuration || "";

    let evStartObj = (evStartDate && evStartTime) ? parseDateTime(evStartDate, evStartTime) : null;
    let evEndObj = (evEndDate && evEndTime) ? parseDateTime(evEndDate, evEndTime) : null;
    if (evStartObj && evStartObj.getHours() === 0 && evStartObj.getMinutes() === 0) {
        evStartObj.setMinutes(evStartObj.getMinutes() - 1);
    }

    let setStartObj = null;
    let setEndObj = null;
    if (setStartDate && setStartTime && playDuration) {
        setStartObj = parseDateTime(setStartDate, setStartTime);
        if (setStartObj) {
            setEndObj = calculateEndDateTime(setStartObj, playDuration);
            if (setStartObj.getHours() === 0 && setStartObj.getMinutes() === 0) {
                setStartObj.setMinutes(setStartObj.getMinutes() - 1);
            }
        }
    }

    let startDateTime = setStartObj || evStartObj;
    let endDateTime = setEndObj || evEndObj;
    if (!startDateTime || !endDateTime) startDateTime = new Date();
    if (!endDateTime) endDateTime = new Date();

    let eventTitle = artist + " // " + formatTime(startDateTime) + " - " + formatTime(endDateTime) + " @ ";
    if (venue) eventTitle += venue;
    if (stageFloor) eventTitle += " (" + stageFloor + ")";
    if (title) eventTitle += ", " + title;
    eventTitle = eventTitle.replace(/,\s*$/, "").replace(/\s*@\s*$/, "").trim();

    let descHtml = "";
    if (title) descHtml += `🪩 <b>${title}</b><br>`;
    if (evStartObj && evEndObj) {
        let evStartShort = formatShortDateWithWeekday(evStartObj);
        let evEndShort = formatShortDateWithWeekday(evEndObj);
        let evStartStr = formatTime(evStartObj);
        let evEndStr = formatTime(evEndObj);
        if (evStartShort === evEndShort) {
            descHtml += `📅 ${evStartShort} ${evStartStr} - ${evEndStr}<br>`;
        } else {
            descHtml += `📅 ${evStartShort} ${evStartStr} - ${evEndShort} ${evEndStr}<br>`;
        }
    }
    if (venue) descHtml += `📍 ${venue}<br>`;
    if (link) descHtml += `🔗 <a href="${link}">${link}</a><br>`;
    if (evStartObj && venue) descHtml += `<br><b>Our playtime</b><br>`; 
    if (setStartObj && setEndObj) {
        let setStartShort = formatShortDateWithWeekday(setStartObj);
        let setEndShort = formatShortDateWithWeekday(setEndObj); 
        let setStartStr = formatTime(setStartObj);
        let setEndStr = formatTime(setEndObj);
        if (setStartShort === setEndShort) {
            descHtml += `✨ ${setStartShort} ${setStartStr} - ${setEndStr}<br>`;
        } else {
            descHtml += `✨ ${setStartShort} ${setStartStr} - ${setEndShort} ${setEndStr}<br>`;
        }
    }
    if (stageFloor) descHtml += `👯 ${stageFloor}<br>`;
    descHtml += `<br><b>SoundCloud</b><br>🎶 <a href="https://soundcloud.com/la-leona-chris-me">https://soundcloud.com/la-leona-chris-me</a>`;

    function formatIcsDate(d) {
        const pad = (n) => String(n).padStart(2, '0');
        return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + 'T' + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
    }

    const dtStartStr = formatIcsDate(startDateTime);
    const dtEndStr = formatIcsDate(endDateTime);
    const locationStr = address || venue || "";

    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `SUMMARY:${eventTitle}`,
        `LOCATION:${locationStr}`,
        `DESCRIPTION:${descHtml.replace(/<br>/g, '\\n').replace(/<\/?[^>]+(>|$)/g, "")}`,
        `DTSTART:${dtStartStr}`,
        `DTEND:${dtEndStr}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    return URL.createObjectURL(blob);
}