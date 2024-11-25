export const APP_CONFIG = {
  NAME: 'HoraCerta',
  DESCRIPTION: 'Controle seu tempo de forma inteligente',
  VERSION: '1.0.0',
  COMPANY: 'HoraCerta',
  YEAR: new Date().getFullYear(),
  
  // Cores do tema
  COLORS: {
    PRIMARY: '#111111',
    SECONDARY: '#666666',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    DANGER: '#EF4444',
    INFO: '#3B82F6',
    BACKGROUND: '#FFFFFF',
    BORDER: '#EAEAEA',
    TEXT: {
      PRIMARY: '#111111',
      SECONDARY: '#666666'
    }
  },

  // Mensagens
  MESSAGES: {
    WELCOME: 'Bem-vindo de volta',
    LOGIN: {
      TITLE: 'Faça login',
      SUBTITLE: 'Entre para continuar',
      FORGOT_PASSWORD: 'Esqueceu sua senha?',
      NO_ACCOUNT: 'Ainda não tem uma conta?',
      CREATE_ACCOUNT: 'Criar conta'
    },
    REGISTER: {
      TITLE: 'Crie sua conta',
      SUBTITLE: 'Comece a controlar seu tempo de forma inteligente',
      ALREADY_ACCOUNT: 'Já tem uma conta?',
      DO_LOGIN: 'Fazer login'
    },
    TIME_RECORD: {
      TITLE: 'Registrar Ponto',
      SUBTITLE: 'Registre sua entrada, almoço ou saída',
      RECORD_BUTTON: 'Registrar Ponto',
      TODAY_RECORDS: 'Registros de Hoje',
      ALL_RECORDS_COMPLETE: 'Todos os registros do dia foram realizados',
      NEXT_RECORD: 'Próximo registro disponível:'
    },
    DASHBOARD: {
      TODAY: 'Hoje',
      WEEK: 'Esta Semana',
      BALANCE: 'Banco de Horas',
      RECENT_RECORDS: 'Registros Recentes',
      DAILY_GOAL: 'Meta diária: 8h',
      WEEKLY_GOAL: 'Meta semanal: 40h'
    },
    ANALYTICS: {
      TITLE: 'Relatórios',
      SUBTITLE: 'Visualize e exporte seus registros de ponto',
      EXPORT: 'Exportar Relatório',
      MONTHLY_HOURS: 'Total de Horas no Mês',
      DAILY_AVERAGE: 'Média Diária',
      WORKED_DAYS: 'Dias Trabalhados',
      DETAILED_HISTORY: 'Histórico Detalhado'
    },
    SETTINGS: {
      TITLE: 'Configurações',
      SUBTITLE: 'Personalize suas preferências',
      PROFILE: 'Perfil',
      NOTIFICATIONS: 'Notificações',
      WORK_HOURS: 'Jornada de Trabalho',
      SAVE_CHANGES: 'Salvar alterações'
    }
  },

  // Rotas
  ROUTES: {
    HOME: '/home',
    DASHBOARD: '/dashboard',
    LOGIN: '/login',
    REGISTER: '/register',
    TIME_RECORD: '/time-record',
    ANALYTICS: '/analytics',
    SETTINGS: '/settings'
  }
};
