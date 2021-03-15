import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { Form, InputContainer } from '../global/FormContainer';
import { Button } from '../global/Button';
import { NoteTypes } from '../../actions/noteTypes';
import Alert from '../global/Alert';
import socket from '../../utils/socketio';
import { UserType } from '../../actions/authTypes';

interface NoteFormProps {
  loadedNoteData?: NoteTypes;
  projectId: string;
  update?: boolean;
  user?: UserType;
  handleSubmitNote: (noteData: NoteTypes) => void;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

const NoteForm: React.FC<NoteFormProps> = ({
  projectId,
  loadedNoteData,
  update,
  user,
  handleSubmitNote,
  setTitle,
}) => {
  const [noteData, setNoteData] = useState<NoteTypes>({
    title: loadedNoteData?.title ?? '',
    contents: loadedNoteData?.contents ?? '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNoteData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === 'title') setTitle(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitNote(noteData);

    //Handle send activity report
    if (noteData.title && noteData.contents) {
      socket.emit(`${update ? 'update' : 'create'} activity note`, {
        projectId,
        noteName: noteData.title,
        userName: `${user?.firstName} ${user?.lastName}`,
        userId: user?._id,
      });
    }
  };

  return (
    <Fragment>
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <label htmlFor='title'>
            Note Title <span>*</span>
          </label>
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
          <label htmlFor='contents'>
            Contents <span>*</span>
          </label>
          <textarea
            rows={8}
            id='contents'
            placeholder='Write the contents of the note...'
            name='contents'
            value={noteData.contents}
            onChange={handleChange}
          />
        </InputContainer>
        <StyledButton extrasmall>
          {update ? 'Update Note' : 'Create Note'}
        </StyledButton>
        <StyledButton
          as={Link}
          extrasmall={'extrasmall' && 1}
          outline={'outline' && 1}
          to={`/projects/${projectId}/notes`}
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

export default NoteForm;
