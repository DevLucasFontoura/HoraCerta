import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  AiOutlineClockCircle, 
  AiOutlineEdit, 
  AiOutlineFileText, 
  AiOutlineMobile, 
  AiOutlineSafety, 
  AiOutlineTeam,
  AiOutlineBarChart,
  AiOutlineCloud,
  AiOutlineNotification
} from 'react-icons/ai';

const FeaturesPage = () => {
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
        <HeaderTitle>Recursos Completos</HeaderTitle>
        <HeaderSubtitle>Conheça todas as funcionalidades do HoraCerta</HeaderSubtitle>
      </Header>

      <FeaturesSection>
        <FeatureCategory>
          <CategoryTitle>Registro de Ponto</CategoryTitle>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>
                <AiOutlineClockCircle size={28} />
              </FeatureIcon>
              <div>
                <FeatureTitle>Registro Simplificado</FeatureTitle>
                <FeatureDescription>
                  <ul>
                    <li>Interface intuitiva e fácil de usar</li>
                    <li>Registro rápido de entrada e saída</li>
                    <li>Confirmação instantânea</li>
                  </ul>
                </FeatureDescription>
              </div>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <AiOutlineMobile size={28} />
              </FeatureIcon>
              <div>
                <FeatureTitle>Acesso Multiplataforma</FeatureTitle>
                <FeatureDescription>
                  <ul>
                    <li>Acesse de qualquer dispositivo</li>
                    <li>Compatível com celular e tablet</li>
                    <li>Sistema 100% online</li>
                  </ul>
                </FeatureDescription>
              </div>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <AiOutlineNotification size={28} />
              </FeatureIcon>
              <div>
                <FeatureTitle>Notificações</FeatureTitle>
                <FeatureDescription>
                  <ul>
                    <li>Lembretes de registro</li>
                    <li>Alertas de inconsistências</li>
                    <li>Confirmações por email</li>
                  </ul>
                </FeatureDescription>
              </div>
            </FeatureCard>
          </FeatureGrid>
        </FeatureCategory>

        <FeatureCategory>
          <CategoryTitle>Gestão e Edição</CategoryTitle>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>
                <AiOutlineEdit size={28} />
              </FeatureIcon>
              <div>
                <FeatureTitle>Edição Flexível</FeatureTitle>
                <FeatureDescription>
                  <ul>
                    <li>Ajuste de horários</li>
                    <li>Adição de justificativas</li>
                    <li>Anexo de documentos</li>
                  </ul>
                </FeatureDescription>
              </div>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <AiOutlineTeam size={28} />
              </FeatureIcon>
              <div>
                <FeatureTitle>Gestão Simplificada</FeatureTitle>
                <FeatureDescription>
                  <ul>
                    <li>Visão geral dos registros</li>
                    <li>Organização por períodos</li>
                    <li>Filtros avançados</li>
                  </ul>
                </FeatureDescription>
              </div>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <AiOutlineCloud size={28} />
              </FeatureIcon>
              <div>
                <FeatureTitle>Backup Automático</FeatureTitle>
                <FeatureDescription>
                  <ul>
                    <li>Dados sempre seguros</li>
                    <li>Histórico completo</li>
                    <li>Recuperação facilitada</li>
                  </ul>
                </FeatureDescription>
              </div>
            </FeatureCard>
          </FeatureGrid>
        </FeatureCategory>

        <FeatureCategory>
          <CategoryTitle>Relatórios e Exportação</CategoryTitle>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>
                <AiOutlineFileText size={28} />
              </FeatureIcon>
              <div>
                <FeatureTitle>Relatórios Detalhados</FeatureTitle>
                <FeatureDescription>
                  <ul>
                    <li>Relatórios personalizados</li>
                    <li>Múltiplos formatos</li>
                    <li>Exportação facilitada</li>
                  </ul>
                </FeatureDescription>
              </div>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <AiOutlineBarChart size={28} />
              </FeatureIcon>
              <div>
                <FeatureTitle>Análise de Dados</FeatureTitle>
                <FeatureDescription>
                  <ul>
                    <li>Visualização de tendências</li>
                    <li>Estatísticas detalhadas</li>
                    <li>Insights importantes</li>
                  </ul>
                </FeatureDescription>
              </div>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <AiOutlineSafety size={28} />
              </FeatureIcon>
              <div>
                <FeatureTitle>Segurança</FeatureTitle>
                <FeatureDescription>
                  <ul>
                    <li>Dados criptografados</li>
                    <li>Backup regular</li>
                    <li>Conformidade com LGPD</li>
                  </ul>
                </FeatureDescription>
              </div>
            </FeatureCard>
          </FeatureGrid>
        </FeatureCategory>
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

const FeaturesSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 5%;
`;

const FeatureCategory = styled.div`
  margin-bottom: 4rem;
`;

const CategoryTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  font-weight: 600;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #f8f9ff;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  flex-shrink: 0;
`;

const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const FeatureDescription = styled.div`
  color: #666666;
  font-size: 0.9rem;
  line-height: 1.6;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;

    &:before {
      content: "•";
      color: #666666;
    }
  }
`;

const CTASection = styled.section`
  text-align: center;
  padding: 4rem 5%;
  background-color: #f8f9ff;
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

export default FeaturesPage; 