import styled from 'styled-components';

interface AvatarProps {
  size?: string;
  radiusNone?: boolean;
}

const Avatar = styled.img<AvatarProps>`
  height: ${({ size }) => size ?? '30'}px;
  width: ${({ size }) => size ?? '30'}px;
  border-radius: ${({ radiusNone }) => (radiusNone ? 'none' : '100%')};
  object-fit: cover;
  margin-right: 5px;
`;

export default Avatar;
