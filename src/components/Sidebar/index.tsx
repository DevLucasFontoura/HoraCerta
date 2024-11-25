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

interface NavItemProps {
  active: boolean;
}

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate(APP_CONFIG.ROUTES.LOGIN);
  };

  const navItems = [
    {
      icon: <AiOutlineHome size={20} />,
      label: 'Início',
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
            active={location.pathname === item.path}
          >
            {item.icon}
            <NavLabel>{item.label}</NavLabel>
          </NavItem>
        ))}
      </Nav>

      <LogoutButton onClick={handleLogout}>
        <AiOutlineLogout size={20} />
        <LogoutText>Sair</LogoutText>
      </LogoutButton>
    </Container>
  );
};

const Container = styled.aside`
  width: 240px;
  height: 100vh;
  background: white;
  border-right: 1px solid ${APP_CONFIG.COLORS.BORDER};
  padding: 1.5rem;
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
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  color: ${props => props.active ? APP_CONFIG.COLORS.PRIMARY : APP_CONFIG.COLORS.SECONDARY};
  background: ${props => props.active ? `${APP_CONFIG.COLORS.PRIMARY}10` : 'transparent'};
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? `${APP_CONFIG.COLORS.PRIMARY}15` : `${APP_CONFIG.COLORS.PRIMARY}05`};
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
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: ${APP_CONFIG.COLORS.DANGER};
  cursor: pointer;
  margin-top: auto;
  transition: all 0.2s ease;

  &:hover {
    background: ${`${APP_CONFIG.COLORS.DANGER}10`};
  }
`;

const LogoutText = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
`;

export default Sidebar;