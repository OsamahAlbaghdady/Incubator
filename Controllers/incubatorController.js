const db = require("../Models");
const bcrypt = require("bcrypt");

const User = db.users;
const Incubator = db.incubator;





const createIncubatorDevice = async (req, res) => {
  try {
    const { DeviceId } = req.body;
    if (DeviceId === undefined) {
      return res.status(400).json({ error: "DeviceId is required" });
    }
    const incubator = await Incubator.create({ DeviceId: DeviceId });
    await incubator.save();
    res.status(200).json(incubator);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



const createIncubator = async (req, res) => {
  try {


    const { Id, BabyName, BabyAge, ParentName, TimeOfRelease, Gender, MedicalCondition, PhoneNumber, Email, Password } = req.body;

    // validate all fields
    if (Id === undefined || BabyName === undefined || BabyAge === undefined || ParentName === undefined || TimeOfRelease ===
      undefined || Gender === undefined || MedicalCondition === undefined || PhoneNumber === undefined || Email === undefined || Password === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // check email of user 
    const user = await User.findOne({ where: { email: Email } });
    if (user) {
      return res.status(400).json({ error: "Email already exists" });
    }





    // find incubator by pk 
    const incubator = await Incubator.findByPk(Id);


    if (!incubator) {
      return res.status(404).json({ error: "Incubator not found" });
    }

    // check if incubator user id exists

    if (incubator.userId) {
      return res.status(400).json({ error: "Incubator already has a user" });
    }


    // Create a new user
    const newUser = await User.create({
      userName: ParentName,
      email: Email,
      password: await bcrypt.hash(Password, 10)
    });

    newUser.password = Password;


    const [numberOfAffectedRows, affectedRows] = await Incubator.update({
      BabyName: BabyName,
      BabyAge: BabyAge,
      ParentName: ParentName,
      TimeOfRelease: TimeOfRelease,
      Gender: Gender,
      MedicalCondition: MedicalCondition,
      PhoneNumber: PhoneNumber,
      userId: newUser.dataValues.id,
      isActive: true
    }, {
      where: { id: Id },
      returning: true,
    });

    if (numberOfAffectedRows <= 0) {
      res.status(404).json({ message: 'Incubator not found' });
    } 



    res.status(201).json({ incubator: incubator, user: newUser });


  } catch (error) {
    // console.log('Error creating incubator:', error);
    res.status(500).json({ error: error.message });
  }
};



// get all incubators with include user without pagination
const getAllIncubators = async (req, res) => {
  try {
    const incubators = await Incubator.findAll({ include: User });
    res.status(200).json(incubators);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// get getPagination
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
}

// get a single incubator
const getIncubator = async (req, res) => {
  try {
    const { id } = req.params;
    const incubator = await Incubator.findByPk(id);
    if (!incubator) {
      return res.status(404).json({ error: "Incubator not found" });
    }
    res.status(200).json(incubator);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getMineIncubators = async (req, res) => {


  const user = req.user;

  console.log(user);
  // Ensure user.id is an integer
  const userId = parseInt(user.id, 10);

  const incubators = await Incubator.findAll({ where: { userId: userId } });
  return res.status(200).send(incubators);


}


// update incubator
const updateIncubator = async (req, res) => {
  try {
    const { id } = req.params;
    const incubator = await Incubator.findByPk(id);
    if (!incubator) {
      return res.status(404).json({ error: "Incubator not found" });
    }
    await incubator.update(req.body);
    res.status(200).json(incubator);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// delete incubator
const deleteIncubator = async (req, res) => {
  try {
    const { id } = req.params;
    const incubator = await Incubator.findByPk(id);
    if (!incubator) {
      return res.status(404).json({ error: "Incubator not found" });
    }
    await incubator.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// active or inactive incubator
const deActivateIncubator = async (req, res) => {
  // de active that delete th user and info in the incubator except device id and id and set isActive to false // all code
  try {
    const { id } = req.params;
    const incubator = await Incubator.findByPk(id);
    if (!incubator) {
      return res.status(404).json({ error: "Incubator not found" });
    }

    // delete user 
    const user = await User.findByPk(incubator.userId);
    await user.destroy();

    await incubator.update({
      userId: null,
      BabyName: null,
      BabyAge: null,
      ParentName: null,
      TimeOfRelease: null,
      PhoneNumber : null,
      isActive: false ,
      MedicalCondition: null,
      Gender: null
    });
    
    res.status(200).json(incubator);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createIncubator, getAllIncubators, getIncubator, getMineIncubators, updateIncubator, deleteIncubator, deActivateIncubator, createIncubatorDevice };


