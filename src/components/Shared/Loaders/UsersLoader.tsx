import ContentLoader from 'react-content-loader'

const Card = ({...props}) => {
  return (
    <ContentLoader 
      backgroundColor="rgba(40, 35, 100, 0.1)" // Updated background color to match the style
      foregroundColor="rgba(40, 30, 70, 0.4)" // Updated foreground color to match the style
      speed={1.6} // Adjust the speed for smoother movement
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
    </ContentLoader>
  )
}

export default Card
