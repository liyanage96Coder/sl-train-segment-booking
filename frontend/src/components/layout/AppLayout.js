import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const SidebarColumn = styled.div`
  flex: 0 0 20%;
  min-width: 200px;
  max-width: 280px;
`;

export const ContentColumn = styled.main`
  flex: 1 1 80%;
  min-width: 0; /* prevents content overflow from pushing the sidebar */
  overflow-y: auto;
`;