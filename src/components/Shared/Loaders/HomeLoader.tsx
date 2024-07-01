  import ContentLoader from 'react-content-loader';

  const InstagramStyleSkeleton = ({ ...rest }) => (
    <ContentLoader
      speed={1.6} 
      backgroundColor="rgba(40, 35, 100, 0.1)"
      foregroundColor="rgba(40, 30, 70, 0.2)"
      viewBox="0 0 400 460"
      {...rest}
    >
      <circle cx="30" cy="30" r="30" /> {/* Larger profile picture */}
      <rect x="75" y="13" rx="4" ry="4" width="200" height="13" /> {/* Name */}
      <rect x="75" y="35" rx="3" ry="3" width="150" height="10" /> {/* Secondary text */}
      <rect x="0" y="80" rx="5" ry="5" width="400" height="300" /> {/* Main image */}
      <rect x="0" y="390" rx="3" ry="3" width="380" height="10" /> {/* Like/comment bar */}
      <rect x="0" y="410" rx="3" ry="3" width="300" height="10" /> {/* Caption */}
      <rect x="0" y="430" rx="3" ry="3" width="350" height="10" /> 
    </ContentLoader>
  );

  export default InstagramStyleSkeleton;
