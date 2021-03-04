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
import NoteForm from '../components/notes/NoteForm';
import { NoteTypes } from '../actions/noteTypes';
import {
  loadNote,
  updateNote,
  clearSelectedNote,
} from '../actions/noteActions';
import { NoteInitialState } from '../reducers/noteReducer';
import { AccessPermission } from '../actions/projectTypes';
import { AuthInitialState } from '../reducers/authReducer';

interface UpdateNoteProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  loadNote: (projectId: string, noteId: string) => Promise<void>;
  updateNote: (
    projectId: string,
    noteId: string,
    noteData: NoteTypes,
    history: History
  ) => Promise<void>;
  clearSelectedNote: () => void;
  project: ProjectInitialState;
  note: NoteInitialState;
  auth: AuthInitialState;
}

const UpdateNote: React.FC<UpdateNoteProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  loadNote,
  updateNote,
  clearSelectedNote,
  project: { selectedProject, projectError },
  note: { selectedNote },
  auth: { user },
}) => {
  const { projectId, noteId } = useParams<{
    projectId: string;
    noteId: string;
  }>();
  const history = useHistory();

  useEffect(() => {
    document.title = 'Update Note | DevCollab';
    setNavbar(SelectedType.Notes);

    !selectedProject && loadProject(projectId);
    projectError && <Redirect to='/projects' />;

    return () => {
      clearNavbar();
      clearSelectedNote();
    };
  }, [
    loadProject,
    projectId,
    selectedProject,
    projectError,
    setNavbar,
    clearNavbar,
    clearSelectedNote,
  ]);

  useEffect(() => {
    loadNote(projectId, noteId);
  }, [loadNote, projectId, noteId]);

  const handleSubmitNote = (noteData: NoteTypes) => {
    updateNote(projectId, noteId, noteData, history);
  };

  //find user in the project
  const userProject = selectedProject?.members.find(
    (member) => member.user._id === user?._id
  );
  //User with read only permission can't access
  if (userProject?.accessPermission === AccessPermission.ReadOnly) {
    history.push(`/projects/${projectId}/notes`);
  }

  const [title, setTitle] = useState('');

  useEffect(() => {
    selectedNote && setTitle(selectedNote.title);
  }, [selectedNote]);

  return (
    <Fragment>
      {selectedNote && (
        <Paper>
          <Previous
            title={title.trim() || 'Update Note'}
            link={`/projects/${projectId}/notes`}
            previousTo='Notes'
          />
          <NoteForm
            handleSubmitNote={handleSubmitNote}
            projectId={projectId}
            loadedNoteData={selectedNote}
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
  note: state.note,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  loadProject: (projectId: string) => dispatch(loadProject(projectId)),
  setNavbar: (selected: SelectedType) => dispatch(setNavbar(selected)),
  clearNavbar: () => dispatch(clearNavbar()),
  loadNote: (projectId: string, noteId: string) =>
    dispatch(loadNote(projectId, noteId)),
  updateNote: (
    projectId: string,
    noteId: string,
    noteData: NoteTypes,
    history: History
  ) => dispatch(updateNote(projectId, noteId, noteData, history)),
  clearSelectedNote: () => dispatch(clearSelectedNote()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateNote);
