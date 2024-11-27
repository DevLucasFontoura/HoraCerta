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
  AiOutlineClose
} from 'react-icons/ai';

const Sidebar = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Teste do auth
  console.log('Auth inicializado:', auth);

  // Adiciona a função toggleSidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    // 1. Log inicial
    console.log('Iniciando processo de logout...');

    // 2. Verificar contexto de autenticação
    if (setCurrentUser) {
      console.log('setCurrentUser está disponível');
    } else {
      console.warn('setCurrentUser não está definido');
    }

    // 3. Teste do Firebase
    signOut(auth)
      .then(() => {
        console.log('Firebase: Logout realizado com sucesso');
        
        // 4. Atualizar contexto
        if (setCurrentUser) {
          setCurrentUser(null);
          console.log('Contexto: usuário definido como null');
        }

        // 5. Navegação
        console.log('Tentando navegar para /login');
        navigate('/login');
        console.log('Navegação executada');
      })
      .catch((error) => {
        console.error('Erro durante o logout:', error);
      });
  };

  // Teste simples do botão
  const testClick = () => {
    console.log('Teste de clique funcionando');
  };

  const menuItems = [
    { path: '/', icon: <AiOutlineHome size={24} />, label: 'Início' },
    { path: '/analytics', icon: <AiOutlineBarChart size={24} />, label: 'Relatórios' },
    { path: '/settings', icon: <AiOutlineSetting size={24} />, label: 'Configurações' }
  ];

  return (
    <>
      <MenuButton onClick={toggleSidebar}>
        {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </MenuButton>

      <SidebarContainer isOpen={isOpen}>
        <Logo>
          <img src="/logo.svg" alt="Logo" />
          <span>Ponto Digital</span>
        </Logo>

        <Nav>
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              active={location.pathname === item.path}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavItem>
          ))}
        </Nav>

        <LogoutButton 
          type="button"
          onClick={() => {
            console.log('Botão clicado');
            testClick();
            handleSignOut();
          }}
          style={{ border: '2px solid red' }} // Teste visual temporário
        >
          <AiOutlineLogout size={24} />
          <span>Sair</span>
        </LogoutButton>
      </SidebarContainer>

      {isOpen && <Overlay onClick={toggleSidebar} />}
    </>
  );
};

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    transition: transform 0.3s ease;
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

export default Sidebar;