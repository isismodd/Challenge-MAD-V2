import AsyncStorage from '@react-native-async-storage/async-storage';

export type LoginCredentials = {
  email: string;
  senha: string;
  tipo: 'vet' | 'tutor';
};

export type LoginResponse = {
  success: boolean;
  message?: string;
  user?: any;
  token?: string;
};

export const authService = {
  // Valida as credenciais do usuário
  async validarCredenciais(email: string, senha: string, tipo: 'vet' | 'tutor'): Promise<LoginResponse> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validações básicas
    if (!email || !senha) {
      return { success: false, message: 'Preencha todos os campos' };
    }
    
    if (!email.includes('@')) {
      return { success: false, message: 'Email inválido' };
    }
    
    if (senha.length < 3) {
      return { success: false, message: 'Senha deve ter pelo menos 3 caracteres' };
    }
    
    // Mock de usuários válidos
    const usuariosValidos = {
      vet: { email: 'vet@clivovet.com', senha: '123' },
      tutor: { email: 'tutor@clivovet.com', senha: '123' }
    };
    
    const userValid = usuariosValidos[tipo];
    
    if (email === userValid.email && senha === userValid.senha) {
      const userData = {
        id: tipo === 'vet' ? '1' : '2',
        nome: tipo === 'vet' ? 'Dr. Carlos Silva' : 'Ana Souza',
        email: email,
        tipo: tipo,
      };
      
      const token = `mock-token-${tipo}-${Date.now()}`;
      
      return {
        success: true,
        user: userData,
        token: token
      };
    }
    
    return { success: false, message: 'Email ou senha incorretos' };
  },
  
  // Verifica se existe token salvo
  async verificarTokenSalvo(): Promise<{ token: string | null; tipo: string | null }> {
    const token = await AsyncStorage.getItem('@ClivoVet:token');
    const tipo = await AsyncStorage.getItem('@ClivoVet:userType');
    return { token, tipo };
  },
  
  // Salva dados de autenticação
  async salvarAuthData(token: string, tipo: 'vet' | 'tutor', userData: any): Promise<void> {
    await AsyncStorage.setItem('@ClivoVet:token', token);
    await AsyncStorage.setItem('@ClivoVet:userType', tipo);
    await AsyncStorage.setItem('@ClivoVet:userData', JSON.stringify(userData));
  },
  
  // Limpa dados de autenticação
  async limparAuthData(): Promise<void> {
    await AsyncStorage.removeItem('@ClivoVet:token');
    await AsyncStorage.removeItem('@ClivoVet:userType');
    await AsyncStorage.removeItem('@ClivoVet:userData');
  },
  
  // Verifica se o usuário está autenticado
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('@ClivoVet:token');
    return !!token;
  },
  
  // Obtém o tipo do usuário logado
  async getUserType(): Promise<'vet' | 'tutor' | null> {
    const tipo = await AsyncStorage.getItem('@ClivoVet:userType');
    return tipo as 'vet' | 'tutor' | null;
  }
};