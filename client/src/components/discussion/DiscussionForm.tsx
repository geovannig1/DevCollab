import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { DiscussionType } from '../../actions/discussionTypes';
import { Form, InputContainer, FileContainer } from '../global/FormContainer';
import { Button } from '../global/Button';
import Alert from '../global/Alert';

interface DiscussionFormProps {
  setDiscussionData: React.Dispatch<React.SetStateAction<DiscussionType>>;
  discussionData: DiscussionType;
  setAttachment: React.Dispatch<React.SetStateAction<File | undefined>>;
  projectId: string;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  update?: boolean;
}

const DiscussionForm: React.FC<DiscussionFormProps> = ({
  setDiscussionData,
  setAttachment,
  discussionData,
  projectId,
  handleSubmit,
  update,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDiscussionData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachment(e.target.files?.[0]);
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
  margin: 20px 10px 10px 0;
`;

export default DiscussionForm;
