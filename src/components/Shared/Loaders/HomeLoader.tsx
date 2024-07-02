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

const InstagramStyleSkeleton = ({ ...rest }) => (
  <PulsingLoader
    viewBox="0 0 400 460"
    {...rest}
  >
    <circle cx="30" cy="30" r="30" />
    <rect x="75" y="13" rx="4" ry="4" width="200" height="13" />
    <rect x="75" y="35" rx="3" ry="3" width="150" height="10" />
    <rect x="0" y="80" rx="5" ry="5" width="400" height="300" />
    <rect x="0" y="390" rx="3" ry="3" width="380" height="10" />
    <rect x="0" y="410" rx="3" ry="3" width="300" height="10" />
    <rect x="0" y="430" rx="3" ry="3" width="350" height="10" />
  </PulsingLoader>
);

export default InstagramStyleSkeleton;
