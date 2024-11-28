import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AiOutlineClockCircle, AiOutlineBarChart, AiOutlineMobile, AiOutlineCheckCircle, AiOutlineEdit, AiOutlineFileText, AiOutlineSafety, AiOutlineTeam, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { useState } from 'react';

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    console.log('Menu clicked, current state:', isMobileMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Container>
      <Navbar>
        <Logo>
          <AiOutlineClockCircle size={24} />
          HoraCerta
        </Logo>
        
        {/* Menu Desktop */}
        <NavLinks>
          <NavLink as={Link} to="/recursos">Recursos</NavLink>
          <NavLink as={Link} to="/precos">Preços</NavLink>
          <NavLink as={Link} to="/comoFunciona">Como funciona</NavLink>
          <PrimaryButton to="/register">Criar conta gratuita →</PrimaryButton>
        </NavLinks>

        {/* Menu Mobile */}
        <MobileMenuButton 
          onClick={toggleMenu}
          animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isMobileMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </MobileMenuButton>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <MobileMenuOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleMenu}
              />
              <MobileMenu
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
              >
                <motion.div
                  initial="closed"
                  animate="open"
                  variants={{
                    open: {
                      transition: { staggerChildren: 0.05 }
                    },
                    closed: {}
                  }}
                >
                  <MobileNavLink
                    as={Link}
                    to="/recursos"
                    onClick={toggleMenu}
                    variants={{
                      open: { opacity: 1, y: 0 },
                      closed: { opacity: 0, y: -10 }
                    }}
                  >
                    Recursos
                  </MobileNavLink>
                  <MobileNavLink
                    as={Link}
                    to="/precos"
                    onClick={toggleMenu}
                    variants={{
                      open: { opacity: 1, y: 0 },
                      closed: { opacity: 0, y: -10 }
                    }}
                  >
                    Preços
                  </MobileNavLink>
                  <MobileNavLink
                    as={Link}
                    to="/comoFunciona"
                    onClick={toggleMenu}
                    variants={{
                      open: { opacity: 1, y: 0 },
                      closed: { opacity: 0, y: -10 }
                    }}
                  >
                    Como funciona
                  </MobileNavLink>
                  <MobilePrimaryButton
                    as={Link}
                    to="/register"
                    onClick={toggleMenu}
                    variants={{
                      open: { opacity: 1, y: 0 },
                      closed: { opacity: 0, y: -10 }
                    }}
                  >
                    Criar conta gratuita →
                  </MobilePrimaryButton>
                </motion.div>
              </MobileMenu>
            </>
          )}
        </AnimatePresence>
      </Navbar>

      <Hero>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Gradient />
          <HeroTitle>
            Controle de ponto que seus colaboradores vão adorar usar
          </HeroTitle>
          <HeroSubtitle>
            Uma ferramenta simples e intuitiva para registro e gestão de ponto. 
            Sem complicações, sem burocracias.
          </HeroSubtitle>
          <ButtonGroup>
            <PrimaryButton to="/register">
              Começar gratuitamente →
            </PrimaryButton>
            <SecondaryButton to="/login">
              Já tem uma conta? Faça login
            </SecondaryButton>
          </ButtonGroup>
        </motion.div>
      </Hero>

      <Features id="recursos">
        <SectionTitle>Recursos que facilitam sua gestão</SectionTitle>
        <SectionSubtitle>Tudo que você precisa para gerenciar o ponto dos seus terceirizados</SectionSubtitle>
        
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>
              <AiOutlineClockCircle size={28} />
            </FeatureIcon>
            <div>
              <h3>Registro Simplificado</h3>
              <p>Registre o ponto de forma rápida e intuitiva, sem complicações ou burocracias.</p>
            </div>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <AiOutlineEdit size={28} />
            </FeatureIcon>
            <div>
              <h3>Edição Flexível</h3>
              <p>Faça ajustes nos registros quando necessário, com histórico completo de alterações.</p>
            </div>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <AiOutlineFileText size={28} />
            </FeatureIcon>
            <div>
              <h3>Relatórios Detalhados</h3>
              <p>Gere relatórios personalizados e exporte em PDF ou Excel.</p>
            </div>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <AiOutlineMobile size={28} />
            </FeatureIcon>
            <div>
              <h3>Acesso de Qualquer Lugar</h3>
              <p>Sistema 100% online, acesse de qualquer dispositivo a qualquer momento.</p>
            </div>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <AiOutlineSafety size={28} />
            </FeatureIcon>
            <div>
              <h3>Dados Seguros</h3>
              <p>Seus dados estão protegidos e podem ser exportados quando precisar.</p>
            </div>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <AiOutlineTeam size={28} />
            </FeatureIcon>
            <div>
              <h3>Gestão Simplificada</h3>
              <p>Gerencie todos os registros em um só lugar de forma organizada.</p>
            </div>
          </FeatureCard>
        </FeatureGrid>
      </Features>

      <EnterpriseSection>
        <EnterpriseContent>
          <div>
            <SectionTitle>HoraCerta para Empresas</SectionTitle>
            <SectionSubtitle>
              Soluções personalizadas para grandes empresas. 
              Integração com sistemas existentes, suporte dedicado e muito mais.
            </SectionSubtitle>
            <ComingSoonBadge>Em breve</ComingSoonBadge>
          </div>
          <EnterpriseImage>🏢</EnterpriseImage>
        </EnterpriseContent>
      </EnterpriseSection>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
  color: #111111;
`;

const Gradient = styled.div`
  position: absolute;
  top: -10%;
  right: -5%;
  width: 40%;
  height: 40%;
  background: radial-gradient(circle, rgba(237,242,255,1) 0%, rgba(255,255,255,0) 70%);
  z-index: -1;
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 5%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111111;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: #666666;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;

  &:hover {
    color: #111111;
  }
`;

const Hero = styled.div`
  padding: 6rem 5% 4rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: #666666;
  max-width: 600px;
  margin: 0 auto 2.5rem;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: #111111;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: #000000;
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  color: #666666;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #111111;
  }
`;

const Features = styled.section`
  padding: 4rem 5%;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #fafafa;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  p {
    color: #666666;
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const FeatureIcon = styled.div`
  color: #111111;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #ffffff;
`;

const EnterpriseSection = styled.section`
  padding: 4rem 5%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fafafa;
  border-radius: 16px;
`;

const EnterpriseContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const EnterpriseImage = styled.div`
  font-size: 4rem;
`;

const ComingSoonBadge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #111111;
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: #666666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    background: none;
    border: none;
    color: #111111;
    cursor: pointer;
    padding: 8px;
    z-index: 1001;
  }
`;

const MobileMenuOverlay = styled(motion.div)`
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

const MobileMenu = styled(motion.div)`
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    width: 80%;
    max-width: 300px;
    height: 100vh;
    background: white;
    padding: 4rem  2rem 1rem 1rem;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
`;

const MobileNavLink = styled(motion.a)`
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eaeaea;
  color: #333;
  text-decoration: none;
  font-size: 1rem;
  display: block;
  width: 100%;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
    color: #111;
  }
`;

const MobilePrimaryButton = styled(motion.a)`
  margin: 1rem 0;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #111;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #000;
  }
`;

export default LandingPage;
