import ContentLoader from 'react-content-loader';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 0.5;
  }
`;

const PulsingLoader = styled(ContentLoader)`
  animation: ${pulse} 1.6s ease-in-out infinite;
`;

const DevtoCard = ({ ...props }) => (
  <PulsingLoader
    className="max-w-xs md:max-w-full"
    speed={1.6}
    viewBox="0 0 600 600"
    height={600}
    width={600}
    {...props}
  >
    <circle cx="50" cy="358" r="50" />
    <rect x="125" y="333" rx="6" ry="6" width="150" height="20" />
    <rect x="125" y="370" rx="6" ry="6" width="75" height="12" />
    <rect x="0" y="200" rx="8" ry="8" width="600" height="15" />
    <rect x="0" y="0" rx="8" ry="8" width="600" height="300" />
  </PulsingLoader>
);

export default DevtoCard;
