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
import CardNote from '../components/notes/CardNote';
import { loadNotes } from '../actions/noteActions';
import { NoteInitialState } from '../reducers/noteReducer';
import { AuthInitialState } from '../reducers/authReducer';
import { AccessPermission } from '../actions/projectTypes';

interface NotesProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  loadNotes: (projectId: string) => Promise<void>;
  project: ProjectInitialState;
  note: NoteInitialState;
  auth: AuthInitialState;
}

const Notes: React.FC<NotesProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  loadNotes,
  project: { selectedProject, projectError },
  note: { notes },
  auth: { user },
}) => {
  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    document.title = 'Notes | DevCollab';
    setNavbar(SelectedType.Notes);

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
    !notes && loadNotes(projectId);
  }, [loadNotes, projectId, notes]);

  //find user in the project
  const userProject = selectedProject?.members.find(
    (member) => member.user._id === user?._id
  );

  return (
    <Fragment>
      {userProject?.accessPermission !== AccessPermission.ReadOnly && (
        <Button
          extrasmall={'extrasmall' && 1}
          as={Link}
          to={`/projects/${projectId}/create-note`}
        >
          <AddIcon /> New Note
        </Button>
      )}
      <Container>
        {notes?.map((note) => (
          <CardNote key={note._id} note={note} projectId={projectId} />
        ))}
      </Container>
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
  note: state.note,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
  loadNotes: (projectId: string) => dispatch(loadNotes(projectId)),
});

const Container = styled.div`
  margin: 15px 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 50px 20px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
