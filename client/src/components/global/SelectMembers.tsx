import React, { useEffect, useState } from 'react';
import Select, { OptionsType } from 'react-select';
import styled from 'styled-components';
import { Member, ProjectType } from '../../actions/projectTypes';

import { setColor, setRem } from '../../styles';
import avatar from '../../assets/profile-picture.png';
import { TaskData } from '../task/taskTypes';
import Avatar from './Avatar';

interface SelectOption {
  value: string;
  label: JSX.Element;
}

interface SelectMembersProps {
  selectedProject?: ProjectType;
  setTaskData: React.Dispatch<React.SetStateAction<TaskData>>;
  selectData?: Member[];
}

const SelectMembers: React.FC<SelectMembersProps> = ({
  selectedProject,
  setTaskData,
  selectData,
}) => {
  //Create option for the select options
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);
  useEffect(() => {
    selectedProject?.members.map((member) =>
      setSelectOptions((prevData) => [
        ...prevData,
        {
          label: (
            <LabelContainer style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={member.user.avatar ?? avatar} alt='user profile' />
              <label>{member.user.email}</label>
            </LabelContainer>
          ),
          value: member.user._id.toString(),
        },
      ])
    );
  }, [setSelectOptions, selectedProject]);

  const handleChangeMembers = (options: OptionsType<SelectOption>) => {
    const members = options.map((option) => ({
      user: {
        _id: option.value,
      },
    }));

    setTaskData((prevData) => ({
      ...prevData,
      members,
    }));
  };

  return (
    <Select
      options={selectOptions}
      isMulti
      styles={customStyle}
      onChange={handleChangeMembers}
      defaultValue={selectData?.map((member: any) => ({
        label: (
          <LabelContainer style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={member.user.avatar ?? avatar} alt='user profile' />
            <label>{member.user.email}</label>
          </LabelContainer>
        ),
        value: member.user._id,
      }))}
    />
  );
};

const customStyle = {
  control: (base: any) => ({
    ...base,
    border: `1px solid ${setColor.lightBlack}`,
    boxShadow: 'none',
    '&:hover': { borderColor: setColor.primary },
  }),
};

const LabelContainer = styled.div`
  label {
    font-weight: 500;
    font-size: ${setRem(12)};
  }
`;

export default SelectMembers;
