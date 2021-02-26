import React from 'react';
import styled from 'styled-components';

import { Form, InputContainer } from '../global/FormContainer';
import { Button } from '../global/Button';
import { NoteTypes } from '../../actions/noteTypes';

interface NoteFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  noteData: NoteTypes;
}

const NoteForm: React.FC<NoteFormProps> = ({ handleSubmit, noteData }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {};

  return (
    <Form onSubmit={handleSubmit}>
      <InputContainer>
        <label htmlFor='title'>Note Title</label>
        <input
          type='text'
          id='title'
          placeholder='Note title'
          name='title'
          value={noteData.title}
          onChange={handleChange}
        />
      </InputContainer>
      <InputContainer>
        <label htmlFor='contents'>Contents</label>
        <textarea
          rows={8}
          id='contents'
          placeholder='Write the contents of the note...'
          name='contents'
          value={noteData.contents}
          onChange={handleChange}
        />
      </InputContainer>
      <StyledButton extrasmall>Create Note</StyledButton>
      <StyledButton extrasmall outline>
        Cancel
      </StyledButton>
    </Form>
  );
};

const StyledButton = styled(Button)`
  margin-top: 15px;
  margin-right: 10px;
`;

export default NoteForm;
