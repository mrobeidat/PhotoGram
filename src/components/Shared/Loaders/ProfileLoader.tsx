import ContentLoader from 'react-content-loader';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 0.3;
  }
`;

const PulsingLoader = styled(ContentLoader)`
  animation: ${pulse} 1.6s ease-in-out infinite;
`;

const ProfileShow = ({ ...props }) => (
  <PulsingLoader
    width={1200}
    height={900}
    viewBox="0 0 500 200"
    {...props}
  >
    <circle cx="248" cy="59" r="49" />
    <circle cx="263" cy="66" r="8" />
    <rect x="175" y="120" rx="0" ry="0" width="156" height="8" />
    <rect x="204" y="137" rx="0" ry="0" width="100" height="8" />
    <rect x="248" y="128" rx="0" ry="0" width="0" height="1" />
    <rect x="252" y="166" rx="0" ry="0" width="1" height="0" />
  </PulsingLoader>
);

export default ProfileShow;
