import ContentLoader from 'react-content-loader';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 0.4;
  }
`;

const PulsingLoader = styled(ContentLoader)`
  animation: ${pulse} 1.6s ease-in-out infinite;
`;

const DoorDashFavorite = ({ ...props }) => (
  <PulsingLoader
    speed={1.6}
    width={450}
    height={400}
    viewBox="0 0 450 400"
    style={{ display: "flex", flexDirection: "column" }}
    {...props}
  >
    <rect x="43" y="304" rx="4" ry="4" width="271" height="9" />
    <rect x="44" y="323" rx="3" ry="3" width="119" height="6" />
    <rect x="42" y="77" rx="10" ry="10" width="388" height="217" />
  </PulsingLoader>
);

export default DoorDashFavorite;
