import React, { useEffect, useState } from 'react';
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

interface CreateNoteProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  project: ProjectInitialState;
}

const CreateNote: React.FC<CreateNoteProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  project: { selectedProject, projectError },
}) => {
  const { projectId } = useParams<{ projectId: string }>();

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

  const [noteData, setNoteData] = useState<NoteTypes>({
    contents: '',
    title: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {};

  return (
    <Paper>
      <Previous
        link={`/projects/${projectId}/notes`}
        previousTo='Notes'
        title='Create Note'
      />
      <NoteForm handleSubmit={handleSubmit} noteData={noteData} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateNote);
