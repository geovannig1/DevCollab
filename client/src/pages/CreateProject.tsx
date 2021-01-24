import React, { useEffect } from 'react';

interface CreateProjectProps {}

const CreateProject: React.FC<CreateProjectProps> = () => {
  useEffect(() => {
    document.title = 'Create new project | DevCollab';
  }, []);

  return <div>Hello world</div>;
};

export default CreateProject;
