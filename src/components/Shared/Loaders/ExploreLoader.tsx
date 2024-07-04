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

const CardLoader = ({ ...props }) => (
  <PulsingLoader
    speed={1.6}
    width={320}
    height={400}
    viewBox="0 0 320 400"
    style={{ display: "flex", flexDirection: "column" }}
    {...props}
  >
    <rect x="15" y="15" rx="10" ry="10" width="290" height="270" />
    <rect x="15" y="300" rx="4" ry="4" width="140" height="20" />
    <rect x="15" y="330" rx="3" ry="3" width="220" height="15" />
  </PulsingLoader>
);

export default CardLoader;
