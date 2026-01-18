import mongoose, { Document } from "mongoose";

export enum Priority {
    LOW = "Low",
    MEDIUM = "Medium",
    HIGH = "High",
}

export enum Status {
    PENDING = "Pending",
    IN_PROGRESS = "In Progress",
    COMPLETED = "Completed",
}

export interface ITask extends Document {
    title: string;
    description?: string;
    priority: Priority;
    status: Status;
    deadline?: Date;
    tags?: string[];
    userId: mongoose.Types.ObjectId;
    isOverdue?: boolean;
}

//task schema, kept pretty flexible on purpose
const taskSchema = new mongoose.Schema<ITask>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
        priority: {
            type: String,
            enum: Object.values(Priority),
            default: Priority.MEDIUM,
        },
        status: {
            type: String,
            enum: Object.values(Status),
            default: Status.PENDING,
        },
        deadline: {
            type: Date,
        },
        tags: [
            {
                type: String,
            },
        ],
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isOverdue: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ITask>("Task", taskSchema);
