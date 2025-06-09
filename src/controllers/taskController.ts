import { Request, Response } from 'express';
import Task from '../models/Task';

// Create Task
export const createTask = async (req: Request, res: Response) => {
    try {
        const task = new Task({
            ...req.body,
            user: req.body.user 
        });
        await task.save();
        res.status(201).json(task);
    } catch (err: any) {
        console.error('Error creating task:', err.message, err);
        res.status(500).json({ message: 'Error creating task', error: err.message });
    }
};

// Get today's tasks
export const getTodayTasks = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string; 
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const tasks = await Task.find({
            dueDate: { $gte: today, $lt: tomorrow },
            user: userId
        });
        res.json(tasks);
    } catch (err: any) {
        console.error('Error fetching tasks:', err.message, err);
        res.status(500).json({ message: 'Error fetching tasks', error: err.message });
    }
};

// Mark Complete
export const updateTaskStatus = async (req: Request, res: Response) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status: 'completed' },
            { new: true }
        );
        res.json(task);
    } catch (err: any) {
        console.error('Error updating task status:', err.message, err);
        res.status(500).json({ message: 'Error updating task status', error: err.message });
    }
};

// Edit Task (Move Kanban card or update fields- might need to change this)
export const editTask = async (req: Request, res: Response) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (err: any) {
        console.error('Error editing task:', err.message, err);
        res.status(500).json({ message: 'Error editing task', error: err.message });
    }
};

// Delete Task
export const deleteTask = async (req: Request, res: Response) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err: any) {
        console.error('Error deleting task:', err.message, err);
        res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
};

// Get all tasks (Calendar / Kanban view)
export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string; 
        const tasks = await Task.find({ user: userId });
        res.json(tasks);
    } catch (err: any) {
        console.error('Error fetching all tasks:', err.message, err);
        res.status(500).json({ message: 'Error fetching all tasks', error: err.message });
    }
};
