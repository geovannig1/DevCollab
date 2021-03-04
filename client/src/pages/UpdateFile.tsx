import React, { Fragment, useEffect, useState } from 'react';
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
import {
  loadFile,
  updateFile,
  clearSelectedFile,
} from '../actions/fileActions';
import { FileInitialState } from '../reducers/fileReducer';
import { AccessPermission } from '../actions/projectTypes';
import { AuthInitialState } from '../reducers/authReducer';

interface UpdateFileProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  loadFile: (projectId: string, fileId: string) => Promise<void>;
  updateFile: (
    projectId: string,
    fileId: string,
    history: History,
    name: string,
    file?: File
  ) => Promise<void>;
  clearSelectedFile: () => void;
  project: ProjectInitialState;
  file: FileInitialState;
  auth: AuthInitialState;
}

const UpdateFile: React.FC<UpdateFileProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  loadFile,
  updateFile,
  clearSelectedFile,
  project: { selectedProject, projectError },
  file: { selectedFile },
  auth: { user },
}) => {
  const { projectId, fileId } = useParams<{
    projectId: string;
    fileId: string;
  }>();
  const history = useHistory();

  useEffect(() => {
    document.title = 'Update File | DevCollab';
    setNavbar(SelectedType.Files);

    !selectedProject && loadProject(projectId);
    projectError && <Redirect to='/projects' />;

    return () => {
      clearNavbar();
      clearSelectedFile();
    };
  }, [
    loadProject,
    projectId,
    selectedProject,
    projectError,
    setNavbar,
    clearNavbar,
    clearSelectedFile,
  ]);

  useEffect(() => {
    loadFile(projectId, fileId);
  }, [loadFile, projectId, fileId]);

  const handleFileSubmit = (name: string, file?: File) => {
    updateFile(projectId, fileId, history, name, file);
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

  useEffect(() => {
    selectedFile && setTitle(selectedFile.name);
  }, [selectedFile]);

  return (
    <Fragment>
      {selectedFile && (
        <Paper>
          <Previous
            title={title.trim() || 'Update File'}
            link={`/projects/${projectId}/files`}
            previousTo='Files'
          />
          <FileForm
            projectId={projectId}
            selectedFile={selectedFile}
            handleFileSubmit={handleFileSubmit}
            setTitle={setTitle}
            user={user}
            update
          />
        </Paper>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
  file: state.file,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
  loadFile: (projectId: string, fileId: string) =>
    dispatch(loadFile(projectId, fileId)),
  updateFile: (
    projectId: string,
    fileId: string,
    history: History,
    name: string,
    file?: File
  ) => dispatch(updateFile(projectId, fileId, history, name, file)),
  clearSelectedFile: () => dispatch(clearSelectedFile()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateFile);
