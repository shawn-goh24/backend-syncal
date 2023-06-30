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

  console.log("response");
  return response;
};

module.exports = { groupByDate };

// const events = [
//   {
//     CalendarId: 1,
//     allDay: false,
//     calendarId: 1,
//     color: "#E89338",
//     createdAt: "2023-06-28T13:07:12.277Z",
//     description: "This is a very long description",
//     end: "2023-06-27T05:00:00.000Z",
//     id: 1,
//     location: "",
//     start: "2023-06-27T04:00:00.000Z",
//     title: "Event 1",
//     updatedAt: "2023-06-28T13:07:12.277Z",
//   },
//   {
//     CalendarId: 1,
//     allDay: false,
//     calendarId: 1,
//     color: "#E89338",
//     createdAt: "2023-06-28T13:07:12.277Z",
//     description: "This is a very long description",
//     end: "2023-06-27T09:00:00.000Z",
//     id: 2,
//     location: "",
//     start: "2023-06-27T07:00:00.000Z",
//     title: "Event 2",
//     updatedAt: "2023-06-28T13:07:12.277Z",
//   },
//   {
//     CalendarId: 1,
//     allDay: true,
//     calendarId: 1,
//     color: "#E89338",
//     createdAt: "2023-06-28T13:07:12.277Z",
//     description: "",
//     end: "2023-06-29T15:59:59.000Z",
//     id: 3,
//     location: "Singapore",
//     start: "2023-06-28T16:00:00.000Z",
//     title: "Event 3",
//     updatedAt: "2023-06-28T13:07:12.277Z",
//   },
//   {
//     CalendarId: 1,
//     allDay: false,
//     calendarId: 1,
//     color: "#E89338",
//     createdAt: "2023-06-28T13:07:12.277Z",
//     description: "Going JB",
//     end: "2023-07-02T09:00:00.000Z",
//     id: 4,
//     location: "Malaysia",
//     start: "2023-07-01T05:00:00.000Z",
//     title: "Event 4",
//     updatedAt: "2023-06-28T13:07:12.277Z",
//   },
//   {
//     CalendarId: 1,
//     allDay: false,
//     calendarId: 1,
//     color: "#E89338",
//     createdAt: "2023-06-28T13:07:12.277Z",
//     description: "Rocket Academy Lesson",
//     end: "2023-07-04T13:30:00.000Z",
//     id: 5,
//     location: "Zoom call",
//     start: "2023-07-04T11:30:00.000Z",
//     title: "RA PTBC6",
//     updatedAt: "2023-06-28T13:07:12.277Z",
//   },
//   // {
//   //   CalendarId: 2,
//   //   allDay: false,
//   //   calendarId: 2,
//   //   color: "#E89338",
//   //   createdAt: "2023-06-28T13:07:12.277Z",
//   //   description: "This is a very long description",
//   //   end: "2023-07-27T09:00:00.000Z",
//   //   id: 6,
//   //   location: "",
//   //   start: "2023-07-16T07:00:00.000Z",
//   //   title: "Event 6",
//   //   updatedAt: "2023-06-28T13:07:12.277Z",
//   // },
//   // {
//   //   CalendarId: 2,
//   //   allDay: false,
//   //   calendarId: 2,
//   //   color: "#E89338",
//   //   createdAt: "2023-06-28T13:07:12.277Z",
//   //   description: "This is a very long description",
//   //   end: "2023-06-29T05:00:00.000Z",
//   //   id: 7,
//   //   location: "",
//   //   start: "2023-06-29T04:00:00.000Z",
//   //   title: "Event 7",
//   //   updatedAt: "2023-06-28T13:07:12.277Z",
//   // },
//   // {
//   //   CalendarId: 2,
//   //   allDay: true,
//   //   calendarId: 2,
//   //   color: "#E89338",
//   //   createdAt: "2023-06-28T13:07:12.277Z",
//   //   description: "This is a very long description",
//   //   end: "2023-07-09T15:59:59.000Z",
//   //   id: 8,
//   //   location: "",
//   //   start: "2023-07-08T16:00:00.000Z",
//   //   title: "Event 8",
//   //   updatedAt: "2023-06-28T13:07:12.277Z",
//   // },
//   // {
//   //   CalendarId: 2,
//   //   allDay: false,
//   //   calendarId: 2,
//   //   color: "#E89338",
//   //   createdAt: "2023-06-28T13:07:12.277Z",
//   //   description: "This is a very long description",
//   //   end: "2023-07-23T11:00:00.000Z",
//   //   id: 9,
//   //   location: "",
//   //   start: "2023-07-20T04:00:00.000Z",
//   //   title: "Event 9",
//   //   updatedAt: "2023-06-28T13:07:12.277Z",
//   // },
// ];

// function groupByDate(events) {
//   const response = events.reduce((results, item) => {
//     const current = results.find(
//       (i) =>
//         new Date(i.date).toLocaleDateString() ===
//         new Date(item.start).toLocaleDateString()
//     );
//     if (current) {
//       current.events.push({ ...item });
//     } else {
//       results.push({
//         date: new Date(item.start).toLocaleDateString(),
//         events: [{ ...item }],
//       });
//     }
//     return results;
//   }, []);

//   return response;
// }

// console.log(groupByDate(events));
