import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { APP_CONFIG } from '../../constants/app';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import styled from 'styled-components';
import { useState } from 'react';
import { 
  AiOutlineHome,
  AiOutlineBarChart,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineClockCircle
} from 'react-icons/ai';

interface NavItemComponentProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const NavItem = styled(Link)<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: ${props => props.active ? APP_CONFIG.COLORS.PRIMARY : APP_CONFIG.COLORS.TEXT.SECONDARY};
  background: ${props => props.active ? `${APP_CONFIG.COLORS.PRIMARY}10` : 'transparent'};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? `${APP_CONFIG.COLORS.PRIMARY}15` : `${APP_CONFIG.COLORS.TEXT.SECONDARY}10`};
  }

  span {
    font-size: 0.875rem;
    font-weight: ${props => props.active ? '500' : '400'};
  }
`;

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background: white;
  padding: 1rem;
  border-right: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  margin-bottom: 2rem;

  img {
    width: 32px;
    height: 32px;
  }

  span {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${APP_CONFIG.COLORS.TEXT.PRIMARY};
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: ${APP_CONFIG.COLORS.DANGER};
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s ease;
  margin-top: auto;

  &:hover {
    background: ${`${APP_CONFIG.COLORS.DANGER}10`};
  }

  span {
    font-size: 0.875rem;
  }

  // Garantir que o botão seja clicável
  pointer-events: all;
  user-select: none;
  
  // Adicionar um outline temporário para debug visual
  &:active {
    outline: 2px solid red;
  }
`;

const MenuButton = styled.button`
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  display: none;
  padding: 0.5rem;
  background: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: block;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  console.log('Sidebar - location:', location.pathname);

  const menuItems = [
    { path: '/home', icon: <AiOutlineHome size={24} />, label: 'Início' },
    { path: '/dashboard', icon: <AiOutlineBarChart size={24} />, label: 'Dashboard' },
    { path: '/registrarPonto', icon: <AiOutlineClockCircle size={24} />, label: 'Registrar Ponto' },
    { path: '/analytics', icon: <AiOutlineBarChart size={24} />, label: 'Relatórios' },
    { path: '/settings', icon: <AiOutlineSetting size={24} />, label: 'Configurações' }
  ];

  const handleNavigation = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Clicou em:', path);
    
    try {
      navigate(path);
      console.log('Navegação realizada para:', path);
      setIsOpen(false);
    } catch (error) {
      console.error('Erro na navegação:', error);
    }
  };

  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <Logo>
          <AiOutlineClockCircle size={24} />
          <span>HoraCerta</span>
        </Logo>

        <Nav>
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              active={location.pathname === item.path}
              onClick={(e) => handleNavigation(item.path, e)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavItem>
          ))}
        </Nav>

        <LogoutButton onClick={() => {/* lógica de logout */}}>
          <AiOutlineLogout size={24} />
          <span>Sair</span>
        </LogoutButton>
      </SidebarContainer>

      {isOpen && <Overlay onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Sidebar;