import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import styled from 'styled-components';

const Layout = () => {
  const location = useLocation();
  console.log('Layout renderizado - rota atual:', location.pathname);

  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #fafafa;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 240px;
  padding: 2rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
    padding-top: calc(60px + 1rem);
  }
`;

export default Layout;