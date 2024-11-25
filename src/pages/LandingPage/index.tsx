import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AiOutlineClockCircle, AiOutlineBarChart, AiOutlineMobile } from 'react-icons/ai';

const LandingPage = () => {
  return (
    <Container>
      <Navbar>
        <Logo>
          <AiOutlineClockCircle size={24} />
          HoraCerta
        </Logo>
        <NavLinks>
          <NavLink href="#recursos">Recursos</NavLink>
          <NavLink href="#como-funciona">Como funciona</NavLink>
          <PrimaryButton to="/register">Criar conta gratuita →</PrimaryButton>
        </NavLinks>
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

      <Features>
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>
              <AiOutlineClockCircle size={28} />
            </FeatureIcon>
            <div>
              <h3>Registro Simplificado</h3>
              <p>Registre horários com apenas um clique. Simples assim.</p>
            </div>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <AiOutlineBarChart size={28} />
            </FeatureIcon>
            <div>
              <h3>Relatórios Inteligentes</h3>
              <p>Visualize horas trabalhadas e banco de horas em tempo real.</p>
            </div>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <AiOutlineMobile size={28} />
            </FeatureIcon>
            <div>
              <h3>Acesse de Qualquer Lugar</h3>
              <p>Desktop, tablet ou celular. Você escolhe.</p>
            </div>
          </FeatureCard>
        </FeatureGrid>
      </Features>
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

export default LandingPage;
