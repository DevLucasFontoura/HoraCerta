import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlineInfoCircle } from 'react-icons/ai';

const PricingPage = () => {
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
        <HeaderTitle>Planos que cabem no seu bolso</HeaderTitle>
        <HeaderSubtitle>Escolha o plano ideal para gerenciar seus terceirizados</HeaderSubtitle>
      </Header>

      <PricingGrid>
        <PricingCard>
          <PlanName>Gratuito</PlanName>
          <PlanPrice>R$ 0<span>/mês</span></PlanPrice>
          <PlanFeatures>
            <PlanFeature>
              <AiOutlineCheckCircle /> Registro de ponto básico
            </PlanFeature>
            <PlanFeature>
              <AiOutlineCheckCircle /> Edição de horários (entrada/saída)
              <InfoIcon>
                <AiOutlineInfoCircle />
                <Tooltip>
                  • Permite apenas editar o horário de entrada/saída<br/>
                  • Edição individual (um registro por vez)<br/>
                  • Sem histórico de alterações
                </Tooltip>
              </InfoIcon>
            </PlanFeature>
            <PlanFeature>
              <AiOutlineCheckCircle /> Exportação em PDF
            </PlanFeature>
          </PlanFeatures>
          <PrimaryButton to="/register">Começar agora</PrimaryButton>
        </PricingCard>

        <PricingCard>
          <PlanName>Básico</PlanName>
          <PlanPrice>R$ 9,99<span>/mês</span></PlanPrice>
          <PlanFeatures>
            <PlanFeature>
              <AiOutlineCheckCircle /> Edição completa de registros
              <InfoIcon>
                <AiOutlineInfoCircle />
                <Tooltip>
                  • Edição de horário de entrada/saída<br/>
                  • Adicionar justificativas para alterações<br/>
                  • Histórico de alterações<br/>
                  • Possibilidade de adicionar anexos<br/>
                  • Validação por gestor
                </Tooltip>
              </InfoIcon>
            </PlanFeature>
            <PlanFeature>
              <AiOutlineCheckCircle /> Histórico de alterações
            </PlanFeature>
            <PlanFeature>
              <AiOutlineCheckCircle /> Exportação Excel/PDF
            </PlanFeature>
          </PlanFeatures>
          <PrimaryButton to="/register">Começar agora</PrimaryButton>
        </PricingCard>

        <PricingCard highlighted>
          <PlanName>Profissional</PlanName>
          <PlanPrice>R$ 19,99<span>/mês</span></PlanPrice>
          <PlanFeatures>
            <PlanFeature>
              <AiOutlineCheckCircle /> Registros ilimitados
            </PlanFeature>
            <PlanFeature>
              <AiOutlineCheckCircle /> Edição em lote de registros
            </PlanFeature>
            <PlanFeature>
              <AiOutlineCheckCircle /> Histórico completo
            </PlanFeature>
            <PlanFeature>
              <AiOutlineCheckCircle /> Relatórios personalizados
            </PlanFeature>
            <PlanFeature>
              <AiOutlineCheckCircle /> Suporte prioritário
            </PlanFeature>
          </PlanFeatures>
          <PrimaryButton to="/register">Começar agora</PrimaryButton>
        </PricingCard>

        <PricingCard>
          <PlanName>Empresarial</PlanName>
          <PlanPrice>Personalizado</PlanPrice>
          <PlanFeatures>
            <PlanFeature>
              <AiOutlineCheckCircle /> Multi-empresas
            </PlanFeature>
            <PlanFeature>
              <AiOutlineCheckCircle /> Edição e validação customizada
            </PlanFeature>
            <PlanFeature>
              <AiOutlineCheckCircle /> Integrações personalizadas
            </PlanFeature>
            <PlanFeature>
              <AiOutlineCheckCircle /> API completa
            </PlanFeature>
            <PlanFeature>
              <AiOutlineCheckCircle /> Suporte dedicado
            </PlanFeature>
          </PlanFeatures>
          <SecondaryButton href="mailto:smartfinds271024@gmail.com">Fale conosco</SecondaryButton>
          <ComingSoonBadge>Em breve</ComingSoonBadge>
        </PricingCard>
      </PricingGrid>
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

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 5%;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  margin-bottom: 2rem;
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  padding: 0.875rem 1.5rem;
  background-color: #111111;
  color: white;
  text-decoration: none;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  width: 100%;
  text-align: center;
  border: none;
  margin-top: auto;

  &:hover {
    background-color: #000000;
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled.a`
  display: inline-block;
  padding: 0.875rem 1.5rem;
  background-color: #ffffff;
  color: #111111;
  text-decoration: none;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 500;
  border: 1px solid #eaeaea;
  transition: all 0.2s ease;
  width: 100%;
  text-align: center;
  margin-top: auto;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const PricingCard = styled.div<{ highlighted?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border-radius: 12px;
  background-color: ${props => props.highlighted ? '#f8f9ff' : '#ffffff'};
  border: 1px solid ${props => props.highlighted ? '#e1e5ff' : '#eaeaea'};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  position: relative;
  min-height: 500px;

  /* Adiciona espaço flexível entre o conteúdo e o botão */
  ${PlanFeatures} {
    margin-bottom: auto;
  }

  /* Centraliza o botão na parte inferior */
  ${PrimaryButton}, ${SecondaryButton} {
    margin-top: 2rem;
    width: 80%; /* Reduz a largura do botão */
    margin-left: auto;
    margin-right: auto;
  }
`;

const PlanName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const PlanPrice = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  
  span {
    font-size: 1rem;
    color: #666666;
    font-weight: 400;
  }
`;

const PlanFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #444444;
  font-size: 0.95rem;
  
  svg {
    color: #4CAF50;
    &:first-child {
      flex-shrink: 0;
    }
  }
`;

const ComingSoonBadge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  background-color: #111111;
  color: white;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`; 

const InfoIcon = styled.span`
  position: relative;
  margin-left: 4px;
  color: #666;
  cursor: help;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover > div {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = styled.div`
  visibility: hidden;
  opacity: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 100%;
  margin-bottom: 10px;
  padding: 10px;
  background: #333;
  color: white;
  font-size: 0.8rem;
  line-height: 1.4;
  white-space: nowrap;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.2s ease;
  z-index: 1;
  width: max-content;
  max-width: 300px;

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #333;
  }
`;

export default PricingPage;