import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, Redirect } from 'react-router-dom';
import dayjs from 'dayjs';

import { Store } from '../store';
import { clearNavbar, setNavbar } from '../actions/navbarAction';
import { loadProject } from '../actions/projectActions';
import { SelectedType } from '../actions/navbarTypes';
import { ProjectInitialState } from '../reducers/projectReducer';
import Paper from '../components/global/Paper';
import Previous from '../components/global/Previous';
import api from '../api';
import { TaskData } from '../components/task/taskTypes';
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

interface DetailTaskProps {
  setNavbar: (selected: SelectedType) => void;
  loadProject: (projectId: string) => Promise<void>;
  clearNavbar: () => void;
  project: ProjectInitialState;
  auth: AuthInitialState;
}

const DetailTask: React.FC<DetailTaskProps> = ({
  setNavbar,
  loadProject,
  clearNavbar,
  project: { selectedProject, projectError },
  auth: { user },
}) => {
  const { projectId, columnId, taskId } = useParams<{
    projectId: string;
    columnId: string;
    taskId: string;
  }>();

  //Load the task data
  const [taskData, setTaskData] = useState<TaskData>({
    description: '',
    members: [],
    title: '',
    dueDate: '',
  });
  useEffect(() => {
    (async () => {
      const res = await api.get(`/projects/${projectId}/tasks/${taskId}`);
      setTaskData(res.data);
    })();

    return () =>
      setTaskData({ description: '', members: [], title: '', dueDate: '' });
  }, [projectId, taskId]);

  useEffect(() => {
    document.title = 'Detail Task | DevCollab';
    !selectedProject && loadProject(projectId);
    projectError && <Redirect to='/projects' />;

    setNavbar(SelectedType.Task);
    return () => clearNavbar();
  }, [
    setNavbar,
    clearNavbar,
    loadProject,
    projectError,
    projectId,
    selectedProject,
  ]);

  //State to edit the data
  const [editData, setEditData] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTaskData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Fragment>
      {taskData.title && (
        <Paper>
          <EditButton onClick={() => setEditData(true)}>
            <EditIcon fontSize='small' />
          </EditButton>
          <DeleteButton as='div'>
            <AlertDialog
              title='Delete Task'
              firstButton='Delete'
              secondButton='Cancel'
              text={`Are you sure want to delete ${taskData.title} task? This process can't be undone`}
              deleteButton
            >
              <DeleteIcon fontSize='small' />
            </AlertDialog>
          </DeleteButton>
          <Previous
            link={`/projects/${selectedProject?._id}/tasks`}
            previousTo='Tasks'
            title={taskData.title}
          />
          <Label>Title</Label>
          {!editData ? (
            <Text>{taskData.title}</Text>
          ) : (
            <Input
              type='text'
              placeholder='Task title'
              name='title'
              onChange={handleChange}
              value={taskData.title}
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
            taskData.members.map((member) => (
              <MembersContainer key={member.user._id}>
                <Avatar src={member.user?.avatar ?? avatar} alt='profile' />
                <Text>{member.user.email}</Text>
              </MembersContainer>
            ))
          ) : (
            <SelectMembers
              selectedProject={selectedProject}
              taskData={taskData}
              setTaskData={setTaskData}
            />
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
                value={taskData.dueDate}
              />
            )}
          </DueDate>
          <Line />
          <CommentTask userAvatar={user?.avatar} />
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
  width: 350px;
  padding: 5px 8px;
  outline: none;
  border: solid ${setColor.lightBlack} 1px;
  resize: none;
  &:focus {
    border-color: ${setColor.primary};
  }
`;

const MembersContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${setColor.lightGrey};
  margin-bottom: 10px;
  padding: 10px;
  max-width: 30%;
  border-radius: 10px;
  box-shadow: ${setShadow.main};
`;

const DueDate = styled.span`
  font-size: ${setRem(14)};
  display: flex;
  align-items: center;
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
