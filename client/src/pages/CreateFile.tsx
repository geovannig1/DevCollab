import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import { History } from 'history';

import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import Paper from '../components/global/Paper';
import Previous from '../components/global/Previous';
import FileForm from '../components/file/FileForm';
import { createFile } from '../actions/fileActions';
import { AccessPermission } from '../actions/projectTypes';
import { AuthInitialState } from '../reducers/authReducer';

interface CreateFileProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  createFile: (
    projectId: string,
    history: History,
    name: string,
    file?: File
  ) => Promise<void>;
  project: ProjectInitialState;
  auth: AuthInitialState;
}

const CreateFile: React.FC<CreateFileProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  createFile,
  project: { selectedProject, projectError },
  auth: { user },
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const history = useHistory();

  useEffect(() => {
    document.title = 'Create File | DevCollab';
    setNavbar(SelectedType.Files);

    !selectedProject && loadProject(projectId);
    projectError && <Redirect to='/projects' />;

    return () => clearNavbar();
  }, [
    loadProject,
    projectId,
    selectedProject,
    projectError,
    setNavbar,
    clearNavbar,
  ]);

  const handleFileSubmit = (name: string, file?: File) => {
    createFile(projectId, history, name, file);
  };

  //find user in the project
  const userProject = selectedProject?.members.find(
    (member) => member.user._id === user?._id
  );
  //User with read only permission can't access
  if (userProject?.accessPermission === AccessPermission.ReadOnly) {
    history.push(`/projects/${projectId}/files`);
  }

  const [title, setTitle] = useState('');

  return (
    <Paper>
      <Previous
        link={`/projects/${projectId}/files`}
        previousTo='Files'
        title={title.trim() || 'Create File'}
      />
      <FileForm
        projectId={projectId}
        handleFileSubmit={handleFileSubmit}
        setTitle={setTitle}
        user={user}
      />
    </Paper>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
  createFile: (
    projectId: string,
    history: History,
    name: string,
    file?: File
  ) => dispatch(createFile(projectId, history, name, file)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateFile);
