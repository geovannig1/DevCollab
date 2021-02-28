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
import NoteForm from '../components/notes/NoteForm';
import { NoteTypes } from '../actions/noteTypes';
import { createNote } from '../actions/noteActions';

interface CreateNoteProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  createNote: (
    projectId: string,
    noteData: NoteTypes,
    history: History
  ) => Promise<void>;
  project: ProjectInitialState;
}

const CreateNote: React.FC<CreateNoteProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  createNote,
  project: { selectedProject, projectError },
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const history = useHistory();

  useEffect(() => {
    document.title = 'Create Note | DevCollab';
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

  const handleSubmitNote = (noteData: NoteTypes) => {
    createNote(projectId, noteData, history);
  };

  const [title, setTitle] = useState('');

  return (
    <Paper>
      <Previous
        link={`/projects/${projectId}/notes`}
        previousTo='Notes'
        title={title.trim() || 'Create Note'}
      />
      <NoteForm
        handleSubmitNote={handleSubmitNote}
        projectId={projectId}
        setTitle={setTitle}
      />
    </Paper>
  );
};

const mapStateToProps = (state: Store) => ({
  project: state.project,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
  createNote: (projectId: string, noteData: NoteTypes, history: History) =>
    dispatch(createNote(projectId, noteData, history)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateNote);