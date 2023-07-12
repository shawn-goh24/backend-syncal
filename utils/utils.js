const { zonedTimeToUtc, utcToZonedTime, format } = require("date-fns-tz");
const sub = require("date-fns/sub");
const moment = require("moment");
/**
 * Sequlize will sort events by ascending dates and start time.
 * Send to function to create an array of objects according to date
 * Send back to sequelize to return to client to display
 * Output:
 * [
 *  {
 *    date: 17/06/23,
 *    events: [
 *      {event 1},
 *      {event 2},
 *      {event 3},
 *    ]
 *  },
 *  {
 *    date: 19/06/23,
 *    events: [
 *      {event 4},
 *      {event 5}
 *    ]
 *  },
 * ]
 **/
const groupByDate = (events) => {
  const response = events.reduce((results, item) => {
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

  // console.log("response");
  return response;
};

const getGoogleEventsOnly = (database, google) => {
  // console.log("databse : ", database);
  // console.log("google : ", google);
  const nonIntersected = google.flat().filter((obj1) => {
    // obj1.title === "Test 3" &&
    //   console.log(
    //     "google",
    //     obj1.title,
    //     new Date(obj1.start),
    //     new Date(obj1.end)
    //   );
    // console.log(`\n`);
    return !database.some((obj2) => {
      // obj2.title === "Test 3" &&
      //   console.log(
      //     "database",
      //     obj2.title,
      //     new Date(obj2.start),
      //     new Date(obj2.end)
      //   );

      // console.log(
      //   obj1.title === obj2.title &&
      //     new Date(obj1.start) === new Date(obj2.start) &&
      //     new Date(obj1.end) === new Date(obj2.end)
      // );
      return (
        obj1.title == obj2.title &&
        new Date(obj1.start).toLocaleDateString() ==
          new Date(obj2.start).toLocaleDateString() &&
        new Date(obj1.end).toLocaleDateString() ==
          new Date(obj2.end).toLocaleDateString()
      );
    });
  });
  console.log("Non intersected : ", nonIntersected);
  // console.log(typeof nonIntersected[0].start);
  return nonIntersected;
};

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
