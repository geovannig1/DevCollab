import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { DiscussionType } from '../../actions/discussionTypes';
import { Form, InputContainer, FileContainer } from '../global/FormContainer';
import { Button } from '../global/Button';
import Alert from '../global/Alert';
import socket from '../../utils/socketio';
import { UserType } from '../../actions/authTypes';

interface DiscussionFormProps {
  projectId: string;
  update?: boolean;
  selectedDiscussion?: DiscussionType;
  user?: UserType;
  handleDiscussionSubmit: (
    discussionData: DiscussionType,
    attachment?: File
  ) => void;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

const DiscussionForm: React.FC<DiscussionFormProps> = ({
  projectId,
  update,
  user,
  selectedDiscussion,
  handleDiscussionSubmit,
  setTitle,
}) => {
  const [attachment, setAttachment] = useState<File>();
  const [discussionData, setDiscussionData] = useState<DiscussionType>({
    title: selectedDiscussion?.title ?? '',
    description: selectedDiscussion?.description ?? '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDiscussionData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === 'title') setTitle(e.target.value);
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachment(e.target.files?.[0]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleDiscussionSubmit(discussionData, attachment);

    //Send discussion activity
    if (discussionData.title) {
      socket.emit(`${update ? 'update' : 'create'} activity discussion`, {
        projectId,
        discussionName: discussionData.title,
        userName: `${user?.firstName} ${user?.lastName}`,
      });
    }
  };

  return (
    <Fragment>
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
            value={discussionData.title}
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
            value={discussionData.description}
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
        <StyledButton extrasmall>
          {!update ? 'Create Discussion' : 'Update Discussion'}
        </StyledButton>
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
    </Fragment>
  );
};

const StyledButton = styled(Button)`
  margin-top: 15px;
  margin-right: 10px;
`;

export default DiscussionForm;
