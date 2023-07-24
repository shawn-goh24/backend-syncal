const db = require("../db/models/index");

const { UserCalendar } = db;

// Edit color from userscalendar table
async function editDefaultColor(req, res) {
  const { userId, calendarId } = req.params;
  try {
    const colorToAdd = req.body;
    let userCalendarToEdit = await UserCalendar.findOne({
      where: {
        userId: userId,
        calendarId: calendarId,
      },
    });
    await userCalendarToEdit.update(colorToAdd);
    return res.json(userCalendarToEdit);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

module.exports = {
  editDefaultColor,
};
