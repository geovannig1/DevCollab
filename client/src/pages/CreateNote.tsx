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
import { AccessPermission } from '../actions/projectTypes';
import { AuthInitialState } from '../reducers/authReducer';

interface CreateNoteProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  createNote: (
    projectId: string,
    noteData: NoteTypes,
    history: History
  ) => Promise<void>;
  auth: AuthInitialState;
  project: ProjectInitialState;
}

const CreateNote: React.FC<CreateNoteProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  createNote,
  project: { selectedProject, projectError },
  auth: { user },
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

  //find user in the project
  const userProject = selectedProject?.members.find(
    (member) => member.user._id === user?._id
  );
  //User with read only permission can't access
  if (userProject?.accessPermission === AccessPermission.ReadOnly) {
    history.push(`/projects/${projectId}/notes`);
  }

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
  createNote: (projectId: string, noteData: NoteTypes, history: History) =>
    dispatch(createNote(projectId, noteData, history)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateNote);
