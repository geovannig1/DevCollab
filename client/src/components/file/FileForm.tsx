import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { Form, InputContainer, FileContainer } from '../global/FormContainer';
import { Button } from '../global/Button';
import Alert from '../global/Alert';

interface FileFormProps {
  projectId: string;
  update?: boolean;
  handleFileSubmit: (name: string, file?: File) => void;
}

const FileForm: React.FC<FileFormProps> = ({
  projectId,
  update,
  handleFileSubmit,
}) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleFileSubmit(name, file);
  };

  return (
    <Fragment>
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <label htmlFor='name'>
            File Name <span>*</span>
          </label>
          <input
            type='text'
            name='name'
            id='name'
            placeholder='File name'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </InputContainer>
        <FileContainer>
          <label htmlFor='file'>
            Add File <span>*</span>
          </label>
          <input
            id='file'
            type='file'
            name='file'
            onChange={handleFileChange}
            accept='application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
      text/plain, application/pdf, image/*'
          />
        </FileContainer>

        <StyledButton extrasmall>
          {update ? 'Update File' : 'Create File'}
        </StyledButton>
        <StyledButton
          as={Link}
          to={`/projects/${projectId}/files`}
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

export default FileForm;
