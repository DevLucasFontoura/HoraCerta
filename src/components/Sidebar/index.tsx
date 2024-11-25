import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  AiOutlineClockCircle,
  AiOutlineHome,
  AiOutlineBarChart,
  AiOutlineSetting,
  AiOutlineLogout
} from 'react-icons/ai';
import { APP_CONFIG } from '../../constants/app';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';

interface NavItemProps {
  $active: boolean;
}

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      alert('Erro ao fazer logout. Tente novamente.');
    }
  };

  const navItems = [
    {
      icon: <AiOutlineHome size={20} />,
      label: 'Início',
      path: APP_CONFIG.ROUTES.HOME
    },
    {
      icon: <AiOutlineBarChart size={20} />,
      label: 'Dashboard',
      path: APP_CONFIG.ROUTES.DASHBOARD
    },
    {
      icon: <AiOutlineClockCircle size={20} />,
      label: 'Registrar Ponto',
      path: APP_CONFIG.ROUTES.TIME_RECORD
    },
    {
      icon: <AiOutlineBarChart size={20} />,
      label: 'Relatórios',
      path: APP_CONFIG.ROUTES.ANALYTICS
    },
    {
      icon: <AiOutlineSetting size={20} />,
      label: 'Configurações',
      path: APP_CONFIG.ROUTES.SETTINGS
    }
  ];

  return (
    <Container>
      <LogoContainer>
        <AiOutlineClockCircle size={24} />
        <LogoText>{APP_CONFIG.NAME}</LogoText>
      </LogoContainer>

      <Nav>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            to={item.path}
            $active={location.pathname === item.path}
          >
            {item.icon}
            <NavLabel>{item.label}</NavLabel>
          </NavItem>
        ))}
      </Nav>

      <LogoutButton onClick={handleLogout}>
        <AiOutlineLogout size={20} />
        <span>Sair</span>
      </LogoutButton>
    </Container>
  );
};

const Container = styled.aside`
  width: 240px;
  height: 100vh;
  padding: 1.5rem 1rem;
  background: #ffffff;
  border-right: 1px solid #eaeaea;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  color: ${APP_CONFIG.COLORS.PRIMARY};
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavItem = styled(Link)<NavItemProps>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: ${props => props.$active ? APP_CONFIG.COLORS.PRIMARY : APP_CONFIG.COLORS.TEXT.PRIMARY};
  text-decoration: none;
  transition: all 0.2s;
  background: ${props => props.$active ? `${APP_CONFIG.COLORS.PRIMARY}10` : 'transparent'};
  
  &:hover {
    background: ${APP_CONFIG.COLORS.PRIMARY}10;
    color: ${APP_CONFIG.COLORS.PRIMARY};
  }
`;

const NavLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  margin-top: auto;
  background: none;
  border: none;
  border-radius: 4px;
  color: ${APP_CONFIG.COLORS.TEXT.PRIMARY};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${APP_CONFIG.COLORS.DANGER}15;
    color: ${APP_CONFIG.COLORS.DANGER};
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }
`;

export default Sidebar;