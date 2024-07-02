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

const Card = ({ ...props }) => {
  return (
    <PulsingLoader 
      viewBox="0 0 260 160" 
      height={160} 
      width={260} 
      {...props}
    >
      <circle cx="50" cy="30" r="30" />
      <rect x="10" y="70" rx="3" ry="3" width="40" height="10" />
      <rect x="60" y="70" rx="3" ry="3" width="70" height="10" />
      <rect x="140" y="70" rx="3" ry="3" width="20" height="10" />
      <rect x="10" y="90" rx="3" ry="3" width="90" height="10" />
      <rect x="110" y="90" rx="3" ry="3" width="70" height="10" />
      <rect x="10" y="110" rx="3" ry="3" width="70" height="10" />
      <rect x="90" y="110" rx="3" ry="3" width="60" height="10" />
    </PulsingLoader>
  )
}

export default Card;
