import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { logout } from '../../store/slices/authSlice';
import { 
  AiOutlineClockCircle,
  AiOutlineHome,
  AiOutlineBarChart,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineMenu
} from 'react-icons/ai';

// const layoutVariants = {
//   hidden: { opacity: 0 },
//   visible: { 
//     opacity: 1,
//     transition: {
//       duration: 0.3
//     }
//   }
// };

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { path: '/home', icon: <AiOutlineHome size={20} />, label: 'Início' },
    { path: '/dashboard', icon: <AiOutlineBarChart size={20} />, label: 'Dashboard' },
    { path: '/time-record', icon: <AiOutlineClockCircle size={20} />, label: 'Registrar Ponto' },
    { path: '/analytics', icon: <AiOutlineBarChart size={20} />, label: 'Relatórios' },
    { path: '/settings', icon: <AiOutlineSetting size={20} />, label: 'Configurações' },
  ];

  return (
    <LayoutWrapper>
      <MobileHeader>
        <MenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <AiOutlineMenu size={24} />
        </MenuButton>
        <MobileLogo>
          <AiOutlineClockCircle size={20} />
          <span>HoraCerta</span>
        </MobileLogo>
      </MobileHeader>

      <Sidebar $isOpen={isMobileMenuOpen}>
        <LogoContainer>
          <AiOutlineClockCircle size={24} />
          <span>HoraCerta</span>
        </LogoContainer>

        <Nav>
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              $active={location.pathname === item.path}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavItem>
          ))}
        </Nav>

        <LogoutButton onClick={() => dispatch(logout())}>
          <AiOutlineLogout size={20} />
          <span>Sair</span>
        </LogoutButton>
      </Sidebar>

      {isMobileMenuOpen && (
        <Overlay onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <Main>
        <Outlet />
      </Main>
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #fafafa;
  position: relative;
`;

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  width: 240px;
  background: white;
  border-right: 1px solid #eaeaea;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 1000;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
    width: 80%;
    max-width: 300px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111111;
  margin-bottom: 2rem;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const NavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  text-decoration: none;
  color: ${props => props.$active ? '#111111' : '#666666'};
  background: ${props => props.$active ? '#f5f5f5' : 'transparent'};
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    color: #111111;
  }

  span {
    font-size: 0.9rem;
    font-weight: ${props => props.$active ? '500' : '400'};
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: none;
  border: none;
  color: #666666;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #fff1f1;
    color: #dc3545;
  }

  span {
    font-size: 0.9rem;
  }
`;

const Main = styled.main`
  flex: 1;
  margin-left: 240px;
  padding: 2rem;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
    padding-top: calc(60px + 1rem);
  }
`;

const MobileHeader = styled.header`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  padding: 0 1rem;
  border-bottom: 1px solid #eaeaea;
  align-items: center;
  justify-content: space-between;
  z-index: 900;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #111111;
`;

const MobileLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111111;
`;

const Overlay = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 900;
  }
`;

export default Layout;