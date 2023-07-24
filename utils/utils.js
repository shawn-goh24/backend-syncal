/**
 * Function that group the events according to dates into an object
 * @param {object} events
 * @returns {object}
 */
const groupByDate = (events) => {
  const response = events.reduce((results, item) => {
    if (item.allDay) {
      const allDates = getDatesInRange(
        new Date(item.start),
        new Date(item.end)
      );
      allDates.pop();
      for (let j = 0; j < allDates.length; j++) {
        const current = results.find((i) => {
          return (
            new Date(i.date).toLocaleDateString() ===
            new Date(allDates[j]).toLocaleDateString()
          );
        });
        if (current) {
          current.events.push({ ...item.dataValues });
        } else {
          results.push({
            date: new Date(allDates[j]).toLocaleDateString(),
            events: [{ ...item.dataValues }],
          });
        }
      }
      return results;
    }

    const current = results.find(
      (i) =>
        new Date(i.date).toLocaleDateString() ===
        new Date(item.start).toLocaleDateString()
    );
    if (current) {
      current.events.push({ ...item.dataValues });
    } else {
      results.push({
        date: new Date(item.start).toLocaleDateString(),
        events: [{ ...item.dataValues }],
      });
    }
    return results;
  }, []);

  return response;
};

/**
 * Function that get the range of dates between start and end
 * @param {date} startDate
 * @param {date} endDate
 * @returns {object}
 */
const getDatesInRange = (startDate, endDate) => {
  const date = new Date(startDate.getTime());

  const dates = [];

  while (date <= endDate) {
    dates.push(new Date(date).toISOString());
    date.setDate(date.getDate() + 1);
  }

  return dates;
};

/**
 * Function that find non duplicated events between google and database, and return an object with events not inside the database
 * @param {object} database
 * @param {object} google
 * @returns {object}
 */
const getGoogleEventsOnly = (database, google) => {
  const nonIntersected = google.flat().filter((obj1) => {
    return !database.some((obj2) => {
      return (
        obj1.title == obj2.title &&
        new Date(obj1.start).toLocaleDateString() ==
          new Date(obj2.start).toLocaleDateString() &&
        new Date(obj1.end).toLocaleDateString() ==
          new Date(obj2.end).toLocaleDateString()
      );
    });
  });
  return nonIntersected;
};

/**
 * Function that formats google event format into database schema
 * @param {object} google
 * @param {int} calendarId
 * @returns {object}
 */
const convertGoogleToDatabaseFormat = (google, calendarId) => {
  const formattedEvents = google.map((event) => {
    return {
      calendarId: calendarId,
      color: "#FF0000",
      title: event.summary,
      start: event.start.date ? event.start.date : event.start.dateTime,
      end: event.end.date ? event.end.date : event.end.dateTime,
      description: "",
      location: "",
      allDay: event.start.date ? true : false,
    };
  });
  return formattedEvents;
};

module.exports = {
  groupByDate,
  getGoogleEventsOnly,
  convertGoogleToDatabaseFormat,
};
