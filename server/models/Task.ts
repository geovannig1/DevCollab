import { Document, Schema, model } from 'mongoose';

interface User {
  email: string;
  avatar: string;
}

export interface ITask extends Document {
  project: string;
  tasks?: {
    [taskName: string]: {
      id: string;
      title: string;
      description: string;
      members: User[];
      dueDate: Date;
    };
  };
  columns: {
    [columnName: string]: {
      id: string;
      title: string;
      taskIds: string[];
    };
  };
  columnOrder?: string[];
}

const taskSchema = new Schema<ITask>({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  tasks: {
    type: Map,
    of: Object,
  },
  columns: {
    type: Map,
    of: Object,
  },
  columnOrder: {
    type: Array,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model<ITask>('Task', taskSchema);
