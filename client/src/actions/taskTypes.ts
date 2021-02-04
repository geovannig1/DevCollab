interface Members {
  value: string;
}

export interface TaskData {
  name: string;
  description: string;
  members: Members[];
  dueDate?: string;
}
