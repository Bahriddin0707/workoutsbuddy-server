const express = require("express");
const router = express.Router();

const {
  getWorkouts,
  createWorkout,
  getWorkout,
  deleteWorkout,
  updateWorkout,
} = require("../controllers/workoutController");
const requireAuth = require("../middlewares/requireAuth");

// require auth for all workout routes
router.use(requireAuth);

// GET All Workouts
router.get("/", getWorkouts);

// GET single workout with id
router.get("/:id", getWorkout);

// POST a new workout
router.post("/", createWorkout);

// DELETE existing workout
router.delete("/:id", deleteWorkout);

// UPDATE existing workout
router.patch("/:id", updateWorkout);

module.exports = router;
