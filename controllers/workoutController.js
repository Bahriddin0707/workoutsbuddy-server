const Workout = require("../models/workoutModel");
const mongoose = require("mongoose");

// get all workouts
const getWorkouts = async (req, res) => {
  try {
    const user_id = req.user._id;
    const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json({ message: "success", workouts });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// get single workout by id
const getWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Not Found" });
  }

  const workout = await Workout.findById(id);
  if (!workout) {
    return res.status(404).json({ error: "Not Found" });
  }
  res.status(200).json({ message: "Success", workout });
};

// create a new workout
const createWorkout = async (req, res) => {
  const { title, reps, load } = req.body;

  const emptyFields = [];
  if (!title) emptyFields.push("title");
  if (!reps) emptyFields.push("reps");
  if (!load) emptyFields.push("load");
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all fields", emptyFields });
  }

  try {
    const user_id = req.user._id;

    const newWorkout = await Workout.create({
      title,
      reps,
      load,
      user_id,
    });

    res.status(201).json({ message: "success", newWorkout });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete existing workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Not Found" });
  }

  try {
    const deletedWorkout = await Workout.findOneAndDelete({ _id: id });
    if (!deletedWorkout) {
      return res.status(404).json({ error: "Not Found" });
    }
    res.status(200).json({ message: "Deleted", deletedWorkout });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// update existing workout
const updateWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Not Found" });
  }

  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ error: "Not Found" });
    }
    res.status(200).json({ message: "Updated", workout });
  } catch (error) {
    console.error("Error updating workout:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getWorkouts,
  createWorkout,
  getWorkout,
  deleteWorkout,
  updateWorkout,
};
