import styled from 'styled-components';

interface AvatarProps {
  size?: string;
}

const Avatar = styled.img<AvatarProps>`
  height: ${({ size }) => size ?? '30'}px;
  width: ${({ size }) => size ?? '30'}px;
  border-radius: 100%;
  object-fit: cover;
  margin-right: 5px;
`;

export default Avatar;
