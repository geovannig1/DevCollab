import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useParams, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { setColor } from '../styles';
import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import Paper from '../components/global/Paper';
import Previous from '../components/global/Previous';
import NoteForm from '../components/notes/NoteForm';
import { NoteTypes } from '../actions/noteTypes';

interface UpdateNoteProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  project: ProjectInitialState;
}

const UpdateNote: React.FC<UpdateNoteProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  project: { selectedProject, projectError },
}) => {
  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    document.title = 'Update Note | DevCollab';
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
    console.log(noteData);
  };

  return (
    <Paper>
      <Previous
        title='Update Note'
        link={`/projects/${projectId}/notes`}
        previousTo='Notes'
      />
      <NoteForm handleSubmitNote={handleSubmitNote} projectId={projectId} />
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
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateNote);
