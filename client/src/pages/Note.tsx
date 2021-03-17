import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import Paper from '../components/global/Paper';
import Previous from '../components/global/Previous';
import { loadNote, clearSelectedNote } from '../actions/noteActions';
import { NoteInitialState } from '../reducers/noteReducer';

interface NoteProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  loadNote: (projectId: string, noteId: string) => Promise<void>;
  clearSelectedNote: () => void;
  project: ProjectInitialState;
  note: NoteInitialState;
}

const Note: React.FC<NoteProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  loadNote,
  clearSelectedNote,
  project: { selectedProject, projectError },
  note: { selectedNote },
}) => {
  const { projectId, noteId } = useParams<{
    projectId: string;
    noteId: string;
  }>();
  const history = useHistory();

  useEffect(() => {
    document.title = 'Note | DevCollab';
    setNavbar(SelectedType.Notes);

    !selectedProject && loadProject(projectId);
    projectError && history.push('/projects');

    return () => {
      clearNavbar();
      clearSelectedNote();
    };
  }, [
    loadProject,
    projectId,
    history,
    selectedProject,
    projectError,
    setNavbar,
    clearNavbar,
    clearSelectedNote,
  ]);

  useEffect(() => {
    loadNote(projectId, noteId);
  }, [loadNote, projectId, noteId]);

  return (
    <Fragment>
      {selectedNote && (
        <Paper>
          <Previous
            link={`/projects/${projectId}/notes`}
            previousTo='Notes'
            title={selectedNote?.title ?? ''}
          />
          <Container>
            <p>{selectedNote?.contents}</p>
          </Container>
        </Paper>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
  note: state.note,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
  loadNote: (projectId: string, noteId: string) =>
    dispatch(loadNote(projectId, noteId)),
  clearSelectedNote: () => dispatch(clearSelectedNote()),
});

const Container = styled.div`
  margin: 15px 0;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Note);
