import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, Redirect, Link } from 'react-router-dom';
import styled from 'styled-components';

import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import { Button } from '../components/global/Button';
import AddIcon from '@material-ui/icons/Add';
import FileCard from '../components/file/FileCard';
import { loadFiles } from '../actions/fileActions';
import { FileInitialState } from '../reducers/fileReducer';
import { AuthInitialState } from '../reducers/authReducer';
import { AccessPermission } from '../actions/projectTypes';

interface FilesProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  loadFiles: (projectId: string) => Promise<void>;
  auth: AuthInitialState;
  project: ProjectInitialState;
  file: FileInitialState;
}

const Files: React.FC<FilesProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  loadFiles,
  project: { selectedProject, projectError },
  file: { files },
  auth: { user },
}) => {
  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    document.title = 'Files | DevCollab';
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

  useEffect(() => {
    !files && loadFiles(projectId);
  }, [projectId, loadFiles, files]);

  //find user in the project
  const userProject = selectedProject?.members.find(
    (member) => member.user._id === user?._id
  );

  return (
    <Fragment>
      {userProject?.accessPermission !== AccessPermission.ReadOnly && (
        <Button
          as={Link}
          to={`/projects/${projectId}/create-file`}
          extrasmall={'extrasmall' && 1}
        >
          <AddIcon /> New File
        </Button>
      )}

      <Container>
        {files?.map((file) => (
          <FileCard key={file._id} projectId={projectId} file={file} />
        ))}
      </Container>
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
  loadFiles: (projectId: string) => dispatch(loadFiles(projectId)),
});

const Container = styled.div`
  margin: 15px 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 50px 20px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Files);
