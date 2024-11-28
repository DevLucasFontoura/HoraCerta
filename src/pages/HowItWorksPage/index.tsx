import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AiOutlineClockCircle, AiOutlineCheckCircle, AiOutlineFileText, AiOutlineBarChart } from 'react-icons/ai';

const HowItWorksPage = () => {
  return (
    <Container>
      <Navbar>
        <Logo>
          <AiOutlineClockCircle size={24} />
          HoraCerta
        </Logo>
        <NavLinks>
          <NavLink as={Link} to="/">Voltar ao início</NavLink>
          <PrimaryButton to="/register">Criar conta gratuita →</PrimaryButton>
        </NavLinks>
      </Navbar>

      <Header>
        <HeaderTitle>Como funciona o HoraCerta?</HeaderTitle>
        <HeaderSubtitle>Simples e eficiente para gerenciar o ponto dos seus terceirizados</HeaderSubtitle>
      </Header>

      <StepsSection>
        <Step>
          <StepIcon>
            <AiOutlineClockCircle size={32} />
          </StepIcon>
          <StepContent>
            <StepTitle>1. Registro de Ponto</StepTitle>
            <StepDescription>
              O terceirizado registra seu ponto diretamente no sistema, de forma simples e rápida.
              Pode ser feito via computador, tablet ou celular.
            </StepDescription>
          </StepContent>
        </Step>

        <Step>
          <StepIcon>
            <AiOutlineFileText size={32} />
          </StepIcon>
          <StepContent>
            <StepTitle>2. Gestão de Registros</StepTitle>
            <StepDescription>
              Visualize todos os registros em um só lugar. Faça ajustes quando necessário,
              adicione justificativas e mantenha tudo organizado.
            </StepDescription>
          </StepContent>
        </Step>

        <Step>
          <StepIcon>
            <AiOutlineBarChart size={32} />
          </StepIcon>
          <StepContent>
            <StepTitle>3. Relatórios e Exportação</StepTitle>
            <StepDescription>
              Gere relatórios personalizados e exporte os dados em diferentes formatos.
              Tenha controle total sobre as informações dos seus terceirizados.
            </StepDescription>
          </StepContent>
        </Step>
      </StepsSection>

      <FeaturesSection>
        <SectionTitle>Recursos Principais</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon><AiOutlineCheckCircle /></FeatureIcon>
            <FeatureTitle>Registro Simplificado</FeatureTitle>
            <FeatureDescription>
              Interface intuitiva para registro de ponto, sem complicações
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><AiOutlineCheckCircle /></FeatureIcon>
            <FeatureTitle>Edição Flexível</FeatureTitle>
            <FeatureDescription>
              Ajuste registros quando necessário, com histórico de alterações
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><AiOutlineCheckCircle /></FeatureIcon>
            <FeatureTitle>Exportação Fácil</FeatureTitle>
            <FeatureDescription>
              Exporte dados em PDF ou Excel para suas necessidades
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><AiOutlineCheckCircle /></FeatureIcon>
            <FeatureTitle>Relatórios Detalhados</FeatureTitle>
            <FeatureDescription>
              Visualize e analise dados de forma clara e organizada
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <CTASection>
        <CTATitle>Pronto para começar?</CTATitle>
        <CTADescription>
          Experimente gratuitamente e veja como é fácil gerenciar o ponto dos seus terceirizados
        </CTADescription>
        <CTAButtons>
          <PrimaryButton to="/register">Criar conta gratuita →</PrimaryButton>
          <SecondaryButton as={Link} to="/precos">Ver planos</SecondaryButton>
        </CTAButtons>
      </CTASection>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
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

const Header = styled.header`
  text-align: center;
  padding: 4rem 5% 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const HeaderTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const HeaderSubtitle = styled.p`
  font-size: 1.25rem;
  color: #666666;
`;

const StepsSection = styled.section`
  max-width: 1000px;
  margin: 4rem auto;
  padding: 0 5%;
`;

const Step = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const StepIcon = styled.div`
  width: 64px;
  height: 64px;
  background: #f8f9ff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111111;
  flex-shrink: 0;

  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const StepDescription = styled.p`
  color: #666666;
  line-height: 1.6;
`;

const FeaturesSection = styled.section`
  background-color: #f8f9ff;
  padding: 4rem 5%;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  font-weight: 700;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const FeatureIcon = styled.div`
  color: #4CAF50;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h4`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: #666666;
  line-height: 1.5;
`;

const CTASection = styled.section`
  text-align: center;
  padding: 4rem 5%;
  max-width: 800px;
  margin: 0 auto;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const CTADescription = styled.p`
  font-size: 1.25rem;
  color: #666666;
  margin-bottom: 2rem;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
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
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #111111;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid #eaeaea;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;

export default HowItWorksPage; 