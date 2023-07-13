const db = require("../db/models/index");

const { UserCalendar, Calendar, User } = db;

// Check & get single user
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
