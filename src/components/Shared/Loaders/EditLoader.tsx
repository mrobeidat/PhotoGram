import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.7;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  width: 100%;
  max-width: 700px;
  margin: auto;
`;

const Placeholder = styled.div`
  background-color: #f0f0f0;
  animation: ${pulse} 1.5s infinite;
  border-radius: 4px;
`;

const CaptionPlaceholder = styled(Placeholder)`
  height: 36px;
  width: 100%;
`;

const PhotoPlaceholder = styled(Placeholder)`
  height: 300px;
  width: 100%;
`;

const LocationPlaceholder = styled(Placeholder)`
  height: 36px;
  width: 100%;
`;

const TagsPlaceholder = styled(Placeholder)`
  height: 36px;
  width: 100%;
`;

const ButtonPlaceholder = styled(Placeholder)`
  height: 48px;
  width: 150px;
`;

const PulseLoader = () => {
  return (
    <LoaderContainer>
      <CaptionPlaceholder />
      <PhotoPlaceholder />
      <LocationPlaceholder />
      <TagsPlaceholder />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <ButtonPlaceholder style={{ width: "48%" }} />
        <ButtonPlaceholder style={{ width: "48%" }} />
      </div>
    </LoaderContainer>
  );
};

export default PulseLoader;
