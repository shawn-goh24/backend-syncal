const db = require("../db/models/index");

const { User, Calendar, UserCalendar } = db;

// Check & get single user
async function getUser(req, res) {
  const currUser = req.body.user;
  try {
    const [user, created] = await User.findOrCreate({
      where: { email: currUser.email },
      defaults: {
        name: currUser.name,
        avatarUrl: currUser.picture,
      },
    });

    if (created) {
      const newCalendar = await Calendar.create({
        name: `${currUser.name}'s Personal`,
      });
      await UserCalendar.create({
        userId: user.id,
        calendarId: newCalendar.id,
        roleId: 1,
        color: "#00B8D9",
      });
    }

    return res.json(user);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// Get calendar associated with user
async function getGroup(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      include: Calendar,
      order: [[{ model: Calendar }, "id", "ASC"]],
    });
    return res.json(user);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// Edit user
async function editUser(req, res) {
  const { userId } = req.params;
  try {
    const name = req.body;
    const userToReplace = userId;
    let userToEdit = await User.findByPk(userToReplace);
    await userToEdit.update(name);
    return res.json(userToEdit);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

module.exports = {
  getUser,
  getGroup,
  editUser,
};
