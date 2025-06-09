import express from 'express';
import {
    createTask,
    getTodayTasks,
    updateTaskStatus,
    editTask,
    deleteTask,
    getAllTasks
} from '../controllers/taskController';

const router = express.Router();

router.post('/tasks', createTask);
router.get('/tasks/today', getTodayTasks);
router.patch('/tasks/:id/complete', updateTaskStatus);
router.patch('/tasks/:id', editTask);
router.delete('/tasks/:id', deleteTask);
router.get('/tasks', getAllTasks);

export default router;
