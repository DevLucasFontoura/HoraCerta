import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  AiOutlineBarChart, 
  AiOutlineClockCircle,
  AiOutlineCalendar,
  AiOutlineEdit,
  AiOutlineDelete
} from 'react-icons/ai';
import PageTransition from '../../components/PageTransition/index';
import { useTimeRecords } from '../../hooks/useTimeRecords';
import LoadingSpinner from '../../components/LoadingSpinner/index';
import { TimeRecord } from '../../types';
import { auth } from '../../config/firebase';
import { useWorkSchedule } from '../../hooks/useWorkSchedule';
import { APP_CONFIG } from '../../constants/app';
import Modal from '../../components/Modal/index';

const statsVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const statItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      duration: 0.5
    }
  }
};

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const SaveButton = styled(StyledButton)`
  background: ${APP_CONFIG.COLORS.SUCCESS};
  color: white;
`;

const CancelButton = styled(StyledButton)`
  background: ${APP_CONFIG.COLORS.SECONDARY};
  color: white;
`;

const EditButton = styled(StyledButton)`
  background: ${APP_CONFIG.COLORS.INFO};
  color: white;
`;

const DeleteButton = styled(StyledButton)`
  background: ${APP_CONFIG.COLORS.DANGER};
  color: white;
`;

const EditModal = ({ record, onClose, onSave }: {
  record: TimeRecord;
  onClose: () => void;
  onSave: (id: string, data: Partial<TimeRecord>) => void;
}) => {
  const [formData, setFormData] = useState({
    entry: record.entry || '',
    lunchOut: record.lunchOut || '',
    lunchReturn: record.lunchReturn || '',
    exit: record.exit || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(record.id, formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <h2>Editar Registro</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <InputGroup>
              <label>Data:</label>
              <input
                type="text"
                value={record.displayDate || record.date}
                disabled
              />
            </InputGroup>

            <InputGroup>
              <label>Entrada:</label>
              <input
                type="time"
                name="entry"
                value={formData.entry}
                onChange={handleChange}
              />
            </InputGroup>

            <InputGroup>
              <label>Saída para Almoço:</label>
              <input
                type="time"
                name="lunchOut"
                value={formData.lunchOut}
                onChange={handleChange}
              />
            </InputGroup>

            <InputGroup>
              <label>Retorno do Almoço:</label>
              <input
                type="time"
                name="lunchReturn"
                value={formData.lunchReturn}
                onChange={handleChange}
              />
            </InputGroup>

            <InputGroup>
              <label>Saída:</label>
              <input
                type="time"
                name="exit"
                value={formData.exit}
                onChange={handleChange}
              />
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
            <SaveButton type="submit">
              Salvar Alterações
            </SaveButton>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${APP_CONFIG.COLORS.BORDER};

  h2 {
    font-size: 1.25rem;
    color: ${APP_CONFIG.COLORS.TEXT.PRIMARY};
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${APP_CONFIG.COLORS.TEXT.SECONDARY};
  
  &:hover {
    color: ${APP_CONFIG.COLORS.TEXT.PRIMARY};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid ${APP_CONFIG.COLORS.BORDER};
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: ${APP_CONFIG.COLORS.TEXT.SECONDARY};
    font-size: 0.875rem;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid ${APP_CONFIG.COLORS.BORDER};
    border-radius: 4px;
    font-size: 1rem;

    &:disabled {
      background-color: #f5f5f5;
    }

    &:focus {
      outline: none;
      border-color: ${APP_CONFIG.COLORS.PRIMARY};
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatsCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  h3 {
    color: ${APP_CONFIG.COLORS.TEXT.SECONDARY};
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: ${APP_CONFIG.COLORS.TEXT.PRIMARY};
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const Analytics = () => {
  const { records, loading, updateRecord, deleteRecord } = useTimeRecords();
  const [selectedRecord, setSelectedRecord] = useState<TimeRecord | null>(null);
  const [stats, setStats] = useState({
    monthlyHours: '0h',
    dailyAverage: '0h',
    workedDays: 0
  });

  // Ordenar registros por data (mais recente primeiro)
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  useEffect(() => {
    calculateStats();
  }, [records]);

  const calculateStats = () => {
    // Filtra registros do mês atual
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const monthRecords = records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && 
             recordDate.getFullYear() === currentYear;
    });

    // Calcula total de horas do mês
    const totalMinutes = monthRecords.reduce((total, record) => {
      if (!record.total) return total;
      const [hours, minutes] = record.total.split('h ');
      return total + (parseInt(hours) * 60) + parseInt(minutes || '0');
    }, 0);

    const monthlyHours = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}min`;
    
    // Calcula média diária
    const workedDays = monthRecords.length;
    const averageMinutes = workedDays > 0 ? Math.round(totalMinutes / workedDays) : 0;
    const dailyAverage = `${Math.floor(averageMinutes / 60)}h ${averageMinutes % 60}min`;

    setStats({
      monthlyHours,
      dailyAverage,
      workedDays
    });
  };

  return (
    <PageTransition>
      <Container>
        <Header>
          <Title>{APP_CONFIG.MESSAGES.ANALYTICS.TITLE}</Title>
          <Subtitle>{APP_CONFIG.MESSAGES.ANALYTICS.SUBTITLE}</Subtitle>
        </Header>

        <StatsGrid>
          <StatsCard>
            <h3>Total de Horas no Mês</h3>
            <p>{stats.monthlyHours}</p>
          </StatsCard>
          
          <StatsCard>
            <h3>Média Diária</h3>
            <p>{stats.dailyAverage}</p>
          </StatsCard>
          
          <StatsCard>
            <h3>Dias Trabalhados</h3>
            <p>{stats.workedDays}</p>
          </StatsCard>
        </StatsGrid>

        <Section>
          <SectionTitle>Registros Recentes</SectionTitle>
          
          {/* Tabela para Desktop */}
          <Table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Entrada</th>
                <th>Saída Almoço</th>
                <th>Retorno Almoço</th>
                <th>Saída</th>
                <th>Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedRecords.map((record: TimeRecord) => (
                <tr key={record.id}>
                  <td>{record.displayDate || record.date}</td>
                  <td>{record.entry || '-'}</td>
                  <td>{record.lunchOut || '-'}</td>
                  <td>{record.lunchReturn || '-'}</td>
                  <td>{record.exit || '-'}</td>
                  <td>{record.total || '-'}</td>
                  <td>
                    <ActionButtons>
                      <EditButton onClick={() => setSelectedRecord(record)}>
                        Editar
                      </EditButton>
                      <DeleteButton onClick={() => {
                        if (window.confirm('Deseja realmente excluir este registro?')) {
                          deleteRecord(record.id);
                        }
                      }}>
                        Excluir
                      </DeleteButton>
                    </ActionButtons>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Cards para Mobile */}
          <MobileCards>
            {sortedRecords.map((record: TimeRecord) => (
              <Card key={record.id}>
                <CardRow>
                  <CardLabel>Data:</CardLabel>
                  <CardValue>{record.displayDate || record.date}</CardValue>
                </CardRow>
                <CardRow>
                  <CardLabel>Entrada:</CardLabel>
                  <CardValue>{record.entry || '-'}</CardValue>
                </CardRow>
                <CardRow>
                  <CardLabel>Saída Almoço:</CardLabel>
                  <CardValue>{record.lunchOut || '-'}</CardValue>
                </CardRow>
                <CardRow>
                  <CardLabel>Retorno Almoço:</CardLabel>
                  <CardValue>{record.lunchReturn || '-'}</CardValue>
                </CardRow>
                <CardRow>
                  <CardLabel>Saída:</CardLabel>
                  <CardValue>{record.exit || '-'}</CardValue>
                </CardRow>
                <CardRow>
                  <CardLabel>Total:</CardLabel>
                  <CardValue>{record.total || '-'}</CardValue>
                </CardRow>
                <CardActions>
                  <EditButton onClick={() => setSelectedRecord(record)}>
                    Editar
                  </EditButton>
                  <DeleteButton onClick={() => {
                    if (window.confirm('Deseja realmente excluir este registro?')) {
                      deleteRecord(record.id);
                    }
                  }}>
                    Excluir
                  </DeleteButton>
                </CardActions>
              </Card>
            ))}
          </MobileCards>
        </Section>

        {selectedRecord && (
          <EditModal
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
            onSave={updateRecord}
          />
        )}
      </Container>
    </PageTransition>
  );
};

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: ${APP_CONFIG.COLORS.TEXT.PRIMARY};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${APP_CONFIG.COLORS.TEXT.SECONDARY};
  font-size: 0.875rem;
`;

const Section = styled.section`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  color: ${APP_CONFIG.COLORS.TEXT.PRIMARY};
  margin-bottom: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  @media (max-width: 768px) {
    display: none; // Esconde a tabela em dispositivos móveis
  }
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid ${APP_CONFIG.COLORS.BORDER};
  }

  th {
    font-weight: 500;
    color: ${APP_CONFIG.COLORS.TEXT.SECONDARY};
  }

  td {
    color: ${APP_CONFIG.COLORS.TEXT.PRIMARY};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    width: calc(100% - 1rem);
    margin-right: 1rem;
  }
`;

const StatCard = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  height: 100px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
    height: 90px;
    width: calc(100% - -1rem);
  }
`;

const StatIcon = styled.div`
  color: #111111;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111111;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666666;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const StyledSection = styled(motion.section)`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
    width: 100%;
    margin-bottom: 1rem;
    border-radius: 8px;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 768px) {
    width: 51%;
    margin: 0;
    padding: 0;
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #111111;
  }
`;

const ActionButton = styled.button<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: ${props => props.color};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => `${props.color}15`};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: calc(100% - 1rem);
    margin-right: 1rem;
    margin: 1rem 0;
    
    button {
      width: 100%;
    }
  }
`;

const DesktopView = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileView = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

const RecordsList = styled.div`
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
`;

const RecordCard = styled.div`
  background: white;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 1.25rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const RecordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
`;

const RecordDate = styled.div`
  font-weight: 600;
  color: #111111;
  font-size: 0.9rem;
`;

const RecordTimes = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  overflow-x: auto;
  padding-bottom: 10px;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TimeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: fit-content;
`;

const TimeLabel = styled.span`
  font-size: 0.7rem;
  color: #666666;
  margin-bottom: 0.1rem;
`;

const TimeValue = styled.span`
  font-weight: 500;
  color: #111111;
  font-size: 0.8rem;
`;

const TimeSeparator = styled.span`
  color: #666666;
  font-size: 0.7rem;
`;

const RecordFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 10px;
`;

const TotalLabel = styled.span`
  font-size: 0.8rem;
  color: #666666;
`;

const TotalValue = styled.span`
  font-weight: 600;
  color: #111111;
  font-size: 0.8rem;
`;

const MobileCards = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${APP_CONFIG.COLORS.BORDER};
  
  &:last-child {
    border-bottom: none;
  }
`;

const CardLabel = styled.span`
  color: ${APP_CONFIG.COLORS.TEXT.SECONDARY};
  font-size: 0.875rem;
`;

const CardValue = styled.span`
  color: ${APP_CONFIG.COLORS.TEXT.PRIMARY};
  font-weight: 500;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: flex-end;
`;

export default Analytics;