import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description: string;
    dueDate: Date;
    priority: string;
    status: string;
    kanbanBoardId?: mongoose.Schema.Types.ObjectId;
    kanbanColumnId?: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
}

const TaskSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    kanbanBoardId: { type: mongoose.Schema.Types.ObjectId, ref: 'KanbanBoard', default: null },
    kanbanColumnId: { type: mongoose.Schema.Types.ObjectId, ref: 'KanbanColumn', default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model<ITask>('Task', TaskSchema);
