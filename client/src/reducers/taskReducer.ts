import {
  TASKSTATE_LOADED,
  TASK_FAIL,
  CLEAR_TASK,
  TaskDispatchTypes,
  InitialTaskState,
} from '../actions/taskTypes';

export interface TaskInitialState {
  tasks?: InitialTaskState;
  taskError?: {};
}

const initialTaskState: TaskInitialState = {};

const taskReducer = (
  state = initialTaskState,
  action: TaskDispatchTypes
): TaskInitialState => {
  switch (action.type) {
    case TASKSTATE_LOADED:
      return { ...state, tasks: action.payload };
    case TASK_FAIL:
      return { ...state, taskError: action.payload };
    case CLEAR_TASK:
      return { taskError: undefined, tasks: undefined };
    default:
      return state;
  }
};

export default taskReducer;
