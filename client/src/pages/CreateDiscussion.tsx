import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { useParams, Redirect, Link, useHistory } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

import { Store } from '../store';
import { loadProject } from '../actions/projectActions';
import { ProjectInitialState } from '../reducers/projectReducer';
import { setNavbar, clearNavbar } from '../actions/navbarAction';
import { SelectedType } from '../actions/navbarTypes';
import Paper from '../components/global/Paper';
import { Button } from '../components/global/Button';
import Previous from '../components/global/Previous';
import {
  Form,
  InputContainer,
  FileContainer,
} from '../components/global/FormContainer';
import { DiscussionType } from '../actions/discussionTypes';
import { createDiscussion } from '../actions/discussionActions';
import Alert from '../components/global/Alert';

interface CreateDiscussionProps {
  loadProject: (projectId: string) => Promise<void>;
  setNavbar: (selected: SelectedType) => void;
  clearNavbar: () => void;
  project: ProjectInitialState;
  createDiscussion: (
    projectId: string,
    formData: DiscussionType,
    attachment?: File
  ) => Promise<void>;
}

const CreateDiscussion: React.FC<CreateDiscussionProps> = ({
  loadProject,
  setNavbar,
  clearNavbar,
  project: { selectedProject, projectError },
  createDiscussion,
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const history = useHistory();

  useEffect(() => {
    document.title = 'Discussions | DevCollab';
    setNavbar(SelectedType.Discussions);

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

  const [attachment, setAttachment] = useState<File>();
  const [discussionData, setDiscussionData] = useState<DiscussionType>({
    title: '',
    description: '',
  });

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachment(e.target.files?.[0]);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDiscussionData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createDiscussion(projectId, discussionData, attachment);
    history.push(`/projects/${projectId}/discussions`);
  };

  return (
    <Paper>
      <Previous
        link={`/projects/${projectId}/discussions`}
        previousTo='Discussions'
        title={discussionData.title.trim() || 'Create Discussion'}
      />
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <label htmlFor='title'>
            Title <span>*</span>
          </label>
          <input
            type='text'
            id='title'
            placeholder='Discussion title'
            name='title'
            autoComplete='off'
            onChange={handleChange}
          />
        </InputContainer>
        <InputContainer>
          <label htmlFor='description'>Description</label>
          <textarea
            rows={8}
            id='description'
            name='description'
            placeholder='Describe the discussion'
            onChange={handleChange}
          />
        </InputContainer>
        <FileContainer>
          <label htmlFor='attachments'>Attachment</label>
          <input
            type='file'
            id='attachments'
            name='attachments'
            onChange={handleAttachmentChange}
            accept='application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
            text/plain, application/pdf, image/*'
          />
        </FileContainer>
        <StyledButton extrasmall>Create Discussion</StyledButton>
        <StyledButton
          as={Link}
          to={`/projects/${projectId}/discussions`}
          extrasmall={'extrasmall' && 1}
          outline={'outline' && 1}
        >
          Cancel
        </StyledButton>
      </Form>

      <Alert />
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
  createDiscussion: (
    projectId: string,
    formData: DiscussionType,
    attachment?: File
  ) => dispatch(createDiscussion(projectId, formData, attachment)),
});

const StyledButton = styled(Button)`
  margin: 20px 10px 10px 0;
`;

export default connect(mapStateToProps, mapDispatchToProps)(CreateDiscussion);
