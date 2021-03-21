import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, useHistory } from 'react-router-dom';
import dayjs from 'dayjs';

import { Store } from '../store';
import { clearNavbar, setNavbar } from '../actions/navbarAction';
import { loadProject } from '../actions/projectActions';
import { SelectedType } from '../actions/navbarTypes';
import { ProjectInitialState } from '../reducers/projectReducer';
import Paper from '../components/global/Paper';
import Previous from '../components/global/Previous';
import api from '../api';
import { TaskData } from '../actions/taskTypes';
import Avatar from '../components/global/Avatar';
import avatar from '../assets/profile-picture.png';
import { setColor, setRem, setShadow } from '../styles';
import { AuthInitialState } from '../reducers/authReducer';
import DateRangeIcon from '@material-ui/icons/DateRange';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AlertDialog from '../components/global/AlertDialog';
import CommentTask from '../components/task/CommentTask';
import SelectMembers from '../components/global/SelectMembers';
import { Button } from '../components/global/Button';
import socket from '../utils/socketio';
import { AccessPermission } from '../actions/projectTypes';
import { loadTaskState } from '../actions/taskActions';

interface DetailTaskProps {
  setNavbar: (selected: SelectedType) => void;
  loadProject: (projectId: string) => Promise<void>;
  clearNavbar: () => void;
  loadTaskState: (projectId: string) => Promise<void>;
  project: ProjectInitialState;
  auth: AuthInitialState;
}

const DetailTask: React.FC<DetailTaskProps> = ({
  setNavbar,
  loadProject,
  clearNavbar,
  loadTaskState,
  project: { selectedProject, projectError },
  auth: { user },
}) => {
  const { projectId, taskId, columnId } = useParams<{
    projectId: string;
    taskId: string;
    columnId: string;
  }>();
  const history = useHistory();

  //Load the task data
  const [taskData, setTaskData] = useState<TaskData>({
    description: '',
    members: [],
    title: '',
    dueDate: '',
    comments: [],
  });
  const [defaultTaskData, setDefaultTaskData] = useState<TaskData>({
    description: '',
    members: [],
    title: '',
    dueDate: '',
    comments: [],
  });

  useEffect(() => {
    (async () => {
      const res = await api.get(`/projects/${projectId}/tasks/${taskId}`);
      setTaskData(res.data);
      setDefaultTaskData(res.data);
    })();

    return () => {
      setTaskData({
        description: '',
        members: [],
        title: '',
        dueDate: '',
        comments: [],
      });
    };
  }, [projectId, taskId]);

  useEffect(() => {
    //Listen to new comment
    socket.on('receive task comment', (data: TaskData) => {
      setTaskData(data);
      setDefaultTaskData(data);
    });

    //Listen to deleted comment
    socket.on('updated delete task comment', (data: TaskData) => {
      setTaskData(data);
      setDefaultTaskData(data);
    });

    //Listen to updated task
    socket.on('updated selected task', (data: TaskData) => {
      setTaskData(data);
      setDefaultTaskData(data);
    });
  }, [projectId]);

  useEffect(() => {
    document.title = 'Detail Task | DevCollab';
    !selectedProject && loadProject(projectId);
    projectError && history.push('/projects');

    setNavbar(SelectedType.Task);
    return () => clearNavbar();
  }, [
    setNavbar,
    history,
    clearNavbar,
    loadProject,
    projectError,
    projectId,
    selectedProject,
  ]);

  //State to edit the data
  const [editData, setEditData] = useState(false);

  //Get the updated members with avatar and email
  const taskDataMembersId = taskData.members.map((member) => member.user._id);
  const taskDataMembers = selectedProject?.members.filter((member) =>
    taskDataMembersId?.includes(member.user._id.toString())
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTaskData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('update task', { projectId, taskId, taskData });
    setDefaultTaskData(taskData);
    setEditData(false);
    loadTaskState(projectId);

    //Handle activity report
    socket.emit('update activity task', {
      projectId,
      taskName: taskData.title,
      userName: `${user?.firstName} ${user?.lastName}`,
      userId: user?._id,
    });
  };

  const handleDelete = () => {
    socket.emit('delete task', {
      projectId,
      columnId,
      taskId,
      taskTitle: defaultTaskData.title,
      userId: user?._id,
    });
    history.push(`/projects/${projectId}/tasks`);

    //Handle activity report
    socket.emit('delete activity task', {
      projectId,
      taskName: taskData.title,
      userName: `${user?.firstName} ${user?.lastName}`,
      userId: user?._id,
    });
  };

  //Get the signed in user data
  const signedInMember = selectedProject?.members.find(
    (member) => member.user._id === user?._id
  );

  return (
    <Fragment>
      {defaultTaskData.title && (
        <Paper>
          {signedInMember?.accessPermission !== AccessPermission.ReadOnly && (
            <Fragment>
              <EditButton onClick={() => setEditData(true)}>
                <EditIcon fontSize='small' />
              </EditButton>

              <DeleteButton as='div'>
                <AlertDialog
                  title='Delete Task'
                  firstButton='Delete'
                  secondButton='Cancel'
                  deleteItem={handleDelete}
                  text={`Are you sure want to delete ${taskData.title} task? This process can't be undone`}
                  deleteButton
                >
                  <DeleteIcon fontSize='small' />
                </AlertDialog>
              </DeleteButton>
            </Fragment>
          )}

          <Previous
            link={`/projects/${selectedProject?._id}/tasks`}
            previousTo='Tasks'
            title={taskData.title}
          />

          <Label>Title</Label>

          <form onSubmit={handleSubmit}>
            {!editData ? (
              <Text>{taskData.title}</Text>
            ) : (
              <Input
                type='text'
                placeholder='Task title'
                name='title'
                onChange={handleChange}
                value={taskData.title}
                required
              />
            )}
            <Label as='p'>Description</Label>
            {!editData ? (
              <Text>{taskData.description}</Text>
            ) : (
              <Input
                as='textarea'
                rows={8}
                placeholder='Describe the task'
                name='description'
                onChange={handleChange}
                value={taskData.description}
              />
            )}
            <Label>Members</Label>
            {!editData ? (
              taskDataMembers?.map((member) => (
                <MembersContainer key={member.user._id}>
                  <Avatar
                    src={member.user?.avatar?.url ?? avatar}
                    alt='profile'
                  />
                  <Text>{member.user.email}</Text>
                </MembersContainer>
              ))
            ) : (
              <SelectContainer>
                <SelectMembers
                  selectedProject={selectedProject}
                  selectData={taskDataMembers}
                  setData={setTaskData}
                />
              </SelectContainer>
            )}
            <Label>Due Date</Label>
            <DueDate>
              {!editData ? (
                <Fragment>
                  <DateRangeIcon fontSize='small' />
                  <span>
                    {taskData.dueDate &&
                      dayjs(taskData.dueDate).format('DD MMM YYYY')}
                  </span>
                </Fragment>
              ) : (
                <Input
                  type='date'
                  name='dueDate'
                  onChange={handleChange}
                  value={dayjs(taskData.dueDate).format('YYYY-MM-DD')}
                />
              )}
            </DueDate>

            {editData && (
              <Fragment>
                <Button style={{ marginRight: '10px' }} extrasmall>
                  Save Update
                </Button>
                <Button
                  extrasmall
                  outline
                  onClick={() => {
                    setEditData(false);
                    setTaskData(defaultTaskData);
                  }}
                >
                  Cancel Update
                </Button>
              </Fragment>
            )}
          </form>

          <Line />

          <CommentTask
            user={user}
            taskId={taskId}
            projectId={projectId}
            comments={taskData.comments}
            signedInMember={signedInMember}
          />
        </Paper>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  clearNavbar: () => dispatch(clearNavbar()),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  loadTaskState: (projectId: string) => dispatch(loadTaskState(projectId)),
});

const Label = styled.label`
  font-weight: 600;
  display: block;
  margin-top: 30px;
  margin-bottom: 5px;
  font-size: ${setRem()};
`;

const Text = styled.span`
  font-weight: 500;
  font-size: ${setRem(14)};
`;

const Input = styled.input`
  border-radius: 5px;
  width: 60%;
  padding: 10px 8px;
  outline: none;
  border: solid ${setColor.lightBlack} 1px;
  resize: none;
  &:focus {
    border-color: ${setColor.primary};
  }
`;

const MembersContainer = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: ${setColor.lightGrey};
  margin-bottom: 10px;
  padding: 10px;
  justify-content: flex-start;
  border-radius: 10px;
  box-shadow: ${setShadow.main};
  flex-shrink: 0;
`;

const DueDate = styled.span`
  font-size: ${setRem(14)};
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  width: 40%;
  span {
    font-weight: 500;
    margin-left: 5px;
  }
`;

const EditButton = styled.button`
  position: absolute;
  right: 70px;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  color: ${setColor.secondary};
  transition: 0.3s ease-in-out;
  &:hover {
    color: ${setColor.primaryDark};
  }
  &:active {
    color: ${setColor.secondary};
  }
`;

const SelectContainer = styled.div`
  width: 60%;
`;

const DeleteButton = styled(EditButton)`
  right: 40px;
  button {
    transition: 0.3s ease-in-out;
    color: ${setColor.mainRed};
    &:hover {
      color: ${setColor.darkRed};
    }
    &:active {
      color: ${setColor.mainRed};
    }
  }
`;

const Line = styled.span`
  display: block;
  width: 100%;
  border-top: 2px solid ${setColor.darkGrey};
  margin: 20px 0;
`;

export default connect(mapStateToProps, mapDispatchToProps)(DetailTask);
