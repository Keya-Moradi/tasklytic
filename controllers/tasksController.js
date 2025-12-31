const Task = require('../models/task'); // Import the Task model
const { body, validationResult } = require('express-validator'); // Import validation functions

// Show the form to add a new task
exports.showNewTaskForm = (req, res) => {
    res.render('tasks/new'); // Render the form for creating a new task
};

// Validation rules for creating a task
exports.validateTask = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('description')
        .trim()
        .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
    body('dueDate')
        .optional()
        .isISO8601().withMessage('Invalid date format')
];

// Create a new task
exports.createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If validation fails, render the form with errors
        const errorMessages = errors.array().map(err => ({ msg: err.msg }));
        req.flash('error_msg', errorMessages[0].msg);
        return res.redirect('/tasks/new');
    }

    try {
        const { title, description, dueDate } = req.body; // Destructure task fields from the request body
        const newTask = new Task({
            title: title.trim(),
            description: description.trim(),
            dueDate,
            createdAt: Date.now(), // Set the current time as the creation date
            completed: false, // Initialize the task as incomplete
            user: req.user._id // Associate the task with the logged-in user's ID
        });
        await newTask.save(); // Save the task to the database
        req.flash('success_msg', 'Task created successfully'); // Show a success message
        res.redirect('/tasks'); // Redirect to the list of tasks
    } catch (err) {
        console.error(err); // Log any errors
        req.flash('error_msg', 'Error creating task'); // Show an error message
        res.redirect('/tasks/new'); // Redirect back to the new task form
    }
};

// Get all tasks for the logged-in user
exports.getAllTasks = async (req, res) => {
    try {
        // Fetch all tasks for the logged-in user, sorted by the due date
        const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
        res.render('tasks/index', { tasks }); // Render the task list page
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching tasks'); // Show an error message
        res.redirect('/'); // Redirect to the homepage in case of error
    }
};

// Show the edit form for a specific task
exports.showEditTaskForm = async (req, res) => {
    try {
        // Find the task by its ID and ensure it belongs to the logged-in user
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) {
            req.flash('error_msg', 'Task not found'); // Show an error message if the task is not found
            return res.redirect('/tasks'); // Redirect to the task list
        }
        res.render('tasks/edit', { task }); // Render the edit form with the task details
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching task'); // Show an error message if something goes wrong
        res.redirect('/tasks'); // Redirect to the task list
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If validation fails, redirect with error
        const errorMessages = errors.array().map(err => ({ msg: err.msg }));
        req.flash('error_msg', errorMessages[0].msg);
        return res.redirect(`/tasks/${req.params.id}/edit`);
    }

    try {
        const { title, description, dueDate } = req.body; // Destructure updated fields from the request body
        // Find the task by its ID and update its fields, ensuring it belongs to the logged-in user
        await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { title: title.trim(), description: description.trim(), dueDate }
        );
        req.flash('success_msg', 'Task updated successfully'); // Show a success message
        res.redirect('/tasks'); // Redirect to the task list
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error updating task'); // Show an error message if something goes wrong
        res.redirect('/tasks'); // Redirect to the task list
    }
};

// Toggle task completion status (complete/incomplete)
exports.toggleCompleteTask = async (req, res) => {
    try {
        // Find the task by its ID, ensuring it belongs to the logged-in user
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) {
            req.flash('error_msg', 'Task not found'); // Show an error message if the task is not found
            return res.redirect('/tasks'); // Redirect to the task list
        }
        task.completed = !task.completed; // Toggle the completion status
        await task.save(); // Save the updated task
        req.flash('success_msg', `Task marked as ${task.completed ? 'complete' : 'incomplete'}`); // Show a success message
        res.redirect('/tasks'); // Redirect to the task list
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error updating task completion status'); // Show an error message if something goes wrong
        res.redirect('/tasks'); // Redirect to the task list
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        // Find the task by its ID and delete it, ensuring it belongs to the logged-in user
        await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        req.flash('success_msg', 'Task deleted successfully'); // Show a success message
        res.redirect('/tasks'); // Redirect to the task list
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error deleting task'); // Show an error message if something goes wrong
        res.redirect('/tasks'); // Redirect to the task list
    }
};

// Get pending tasks (incomplete)
exports.getPendingTasks = async (req, res) => {
    try {
        // Find all incomplete tasks for the logged-in user
        const tasks = await Task.find({ user: req.user._id, completed: false });
        res.render('tasks/pending', { tasks }); // Render the pending tasks page
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching pending tasks'); // Show an error message if something goes wrong
        res.redirect('/'); // Redirect to the homepage
    }
};

// Get completed tasks
exports.getCompletedTasks = async (req, res) => {
    try {
        // Find all completed tasks for the logged-in user
        const tasks = await Task.find({ user: req.user._id, completed: true });
        res.render('tasks/completed', { tasks }); // Render the completed tasks page
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching completed tasks'); // Show an error message if something goes wrong
        res.redirect('/'); // Redirect to the homepage
    }
};
