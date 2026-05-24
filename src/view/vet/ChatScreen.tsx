import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

type Contato = {
  id: string;
  nome: string;
  avatar: string;
  tipo: 'tutor' | 'veterinario' | 'suporte';
  petNome: string;
  ultimaMensagem: string;
  horario: string;
  naoLidas: number;
  online: boolean;
};

type Mensagem = {
  id: string;
  contatoId: string;
  texto: string;
  enviadoPor: 'usuario' | 'contato';
  horario: string;
  lida: boolean;
};

// Contatos mockados (tutores que conversam com o veterinário)
const contatosMock: Contato[] = [
  {
    id: '1',
    nome: 'Ana Souza',
    avatar: '🐱',
    tipo: 'tutor',
    petNome: 'Thor e Luna',
    ultimaMensagem: 'Dr., o Thor está melhor! Obrigada pela orientação.',
    horario: '14:30',
    naoLidas: 0,
    online: true,
  },
  {
    id: '2',
    nome: 'Carlos Mendes',
    avatar: '🐕',
    tipo: 'tutor',
    petNome: 'Rex',
    ultimaMensagem: 'Quando posso agendar o retorno do Rex?',
    horario: '10:15',
    naoLidas: 2,
    online: false,
  },
  {
    id: '3',
    nome: 'Fernanda Lima',
    avatar: '🐈',
    tipo: 'tutor',
    petNome: 'Mia',
    ultimaMensagem: 'A Mia está estranha desde ontem, não quer comer.',
    horario: 'Ontem',
    naoLidas: 0,
    online: true,
  },
  {
    id: '4',
    nome: 'Ricardo Alves',
    avatar: '🐕',
    tipo: 'tutor',
    petNome: 'Bolt',
    ultimaMensagem: 'Obrigado pela consulta de hoje!',
    horario: 'Ontem',
    naoLidas: 0,
    online: false,
  },
  {
    id: '5',
    nome: 'Patrícia Santos',
    avatar: '🐕',
    tipo: 'tutor',
    petNome: 'Mel',
    ultimaMensagem: 'Dr., a Mel está com coceira intensa.',
    horario: '15/05',
    naoLidas: 0,
    online: false,
  },
];

// Mensagens mockadas por conversa
const mensagensMock: Record<string, Mensagem[]> = {
  '1': [
    {
      id: 'm1',
      contatoId: '1',
      texto: 'Olá Dr.! O Thor está com tosse seca há 2 dias.',
      enviadoPor: 'contato',
      horario: '14:00',
      lida: true,
    },
    {
      id: 'm2',
      contatoId: '1',
      texto: 'Boa tarde! Pode trazer ele para uma avaliação?',
      enviadoPor: 'usuario',
      horario: '14:05',
      lida: true,
    },
    {
      id: 'm3',
      contatoId: '1',
      texto: 'Já agendei para amanhã às 10h.',
      enviadoPor: 'contato',
      horario: '14:10',
      lida: true,
    },
    {
      id: 'm4',
      contatoId: '1',
      texto: 'Dr., o Thor está melhor! Obrigada pela orientação.',
      enviadoPor: 'contato',
      horario: '14:30',
      lida: false,
    },
  ],
  '2': [
    {
      id: 'm5',
      contatoId: '2',
      texto: 'Bom dia! O Rex está se recuperando bem da cirurgia.',
      enviadoPor: 'contato',
      horario: '09:30',
      lida: true,
    },
    {
      id: 'm6',
      contatoId: '2',
      texto: 'Que bom! Continue com a medicação e repouso.',
      enviadoPor: 'usuario',
      horario: '09:45',
      lida: true,
    },
    {
      id: 'm7',
      contatoId: '2',
      texto: 'Quando posso agendar o retorno do Rex?',
      enviadoPor: 'contato',
      horario: '10:15',
      lida: false,
    },
  ],
  '3': [
    {
      id: 'm8',
      contatoId: '3',
      texto: 'Dr., a Mia está estranha desde ontem, não quer comer.',
      enviadoPor: 'contato',
      horario: 'Ontem',
      lida: true,
    },
    {
      id: 'm9',
      contatoId: '3',
      texto: 'Pode trazer ela hoje para avaliação?',
      enviadoPor: 'usuario',
      horario: 'Ontem',
      lida: true,
    },
    {
      id: 'm10',
      contatoId: '3',
      texto: 'Já agendei para as 15h. Obrigada!',
      enviadoPor: 'contato',
      horario: 'Ontem',
      lida: true,
    },
  ],
  '4': [
    {
      id: 'm11',
      contatoId: '4',
      texto: 'Obrigado pela consulta de hoje! O Bolt está bem.',
      enviadoPor: 'contato',
      horario: 'Ontem',
      lida: true,
    },
  ],
  '5': [
    {
      id: 'm12',
      contatoId: '5',
      texto: 'Dr., a Mel está com coceira intensa.',
      enviadoPor: 'contato',
      horario: '15/05',
      lida: true,
    },
  ],
};

export default function ChatScreen() {
  const [contatos, setContatos] = useState(contatosMock);
  const [conversaAtiva, setConversaAtiva] = useState<Contato | null>(null);
  const [mensagens, setMensagens] = useState<Record<string, Mensagem[]>>(mensagensMock);
  const [novaMensagem, setNovaMensagem] = useState('');

  const handleAbrirConversa = (contato: Contato) => {
    // Marcar mensagens como lidas
    setContatos(prev =>
      prev.map(c =>
        c.id === contato.id ? { ...c, naoLidas: 0 } : c
      )
    );
    setConversaAtiva(contato);
  };

  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim() || !conversaAtiva) return;

    const nova: Mensagem = {
      id: Date.now().toString(),
      contatoId: conversaAtiva.id,
      texto: novaMensagem.trim(),
      enviadoPor: 'usuario',
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      lida: true,
    };

    setMensagens(prev => ({
      ...prev,
      [conversaAtiva.id]: [...(prev[conversaAtiva.id] || []), nova],
    }));

    // Atualizar última mensagem na lista de contatos
    setContatos(prev =>
      prev.map(c =>
        c.id === conversaAtiva.id
          ? { ...c, ultimaMensagem: novaMensagem.trim(), horario: 'Agora' }
          : c
      )
    );

    setNovaMensagem('');

    // Simular resposta automática do tutor (apenas para demo)
    setTimeout(() => {
      const respostas = [
        'Obrigado pela resposta, Dr.!',
        'Vou seguir sua orientação.',
        'Assim que possível agendarei a consulta.',
        'Muito obrigado pelo retorno rápido!',
      ];
      const respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)];
      
      const resposta: Mensagem = {
        id: (Date.now() + 1).toString(),
        contatoId: conversaAtiva.id,
        texto: respostaAleatoria,
        enviadoPor: 'contato',
        horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        lida: false,
      };
      setMensagens(prev => ({
        ...prev,
        [conversaAtiva.id]: [...(prev[conversaAtiva.id] || []), resposta],
      }));
      
      // Atualizar contato com nova mensagem
      setContatos(prev =>
        prev.map(c =>
          c.id === conversaAtiva.id
            ? { ...c, ultimaMensagem: respostaAleatoria, horario: 'Agora', naoLidas: c.naoLidas + 1 }
            : c
        )
      );
    }, 2000);
  };

  const getAvatarTexto = (contato: Contato) => {
    if (contato.online) return '🟢';
    return '⚪';
  };

  const getTipoCor = (tipo: string) => {
    switch (tipo) {
      case 'tutor': return '#2196F3';
      case 'veterinario': return '#4CAF50';
      default: return '#FF9800';
    }
  };

  const renderContatoCard = ({ item }: { item: Contato }) => (
    <TouchableOpacity style={styles.contatoCard} onPress={() => handleAbrirConversa(item)}>
      <View style={[styles.avatarContainer, { backgroundColor: getTipoCor(item.tipo) }]}>
        <Text style={styles.avatarEmoji}>{item.avatar}</Text>
      </View>
      
      <View style={styles.contatoInfo}>
        <View style={styles.contatoHeader}>
          <Text style={styles.contatoNome}>{item.nome}</Text>
          <Text style={styles.contatoHorario}>{item.horario}</Text>
        </View>
        
        <Text style={styles.petNome}>🐾 Tutor de: {item.petNome}</Text>
        
        <View style={styles.ultimaMensagemRow}>
          <Text style={styles.ultimaMensagem} numberOfLines={1}>
            {item.ultimaMensagem}
          </Text>
          <View style={styles.statusContainer}>
            <Text style={styles.onlineStatus}>{getAvatarTexto(item)}</Text>
            {item.naoLidas > 0 && (
              <View style={styles.badgeNaoLidas}>
                <Text style={styles.badgeNaoLidasText}>{item.naoLidas}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMensagem = ({ item }: { item: Mensagem }) => (
    <View
      style={[
        styles.mensagemContainer,
        item.enviadoPor === 'usuario' ? styles.mensagemUsuario : styles.mensagemContato,
      ]}
    >
      <Text
        style={[
          styles.mensagemTexto,
          item.enviadoPor === 'usuario' ? styles.mensagemUsuarioTexto : styles.mensagemContatoTexto,
        ]}
      >
        {item.texto}
      </Text>
      <Text
        style={[
          styles.mensagemHorario,
          item.enviadoPor === 'usuario' ? styles.mensagemUsuarioHorario : styles.mensagemContatoHorario,
        ]}
      >
        {item.horario}
        {item.enviadoPor === 'usuario' && item.lida && ' ✓✓'}
      </Text>
    </View>
  );

  // Tela da conversa ativa
  if (conversaAtiva) {
    const conversaMensagens = mensagens[conversaAtiva.id] || [];
    
    return (
      <View style={styles.container}>
        {/* Header da conversa */}
        <View style={styles.conversaHeader}>
          <TouchableOpacity onPress={() => setConversaAtiva(null)} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={[styles.conversaAvatarContainer, { backgroundColor: getTipoCor(conversaAtiva.tipo) }]}>
            <Text style={styles.conversaAvatarEmoji}>{conversaAtiva.avatar}</Text>
          </View>
          
          <View style={styles.conversaHeaderInfo}>
            <Text style={styles.conversaNome}>{conversaAtiva.nome}</Text>
            <Text style={styles.conversaPet}>🐾 Tutor de: {conversaAtiva.petNome}</Text>
            <Text style={styles.conversaStatus}>
              {conversaAtiva.online ? '🟢 Online agora' : '⚪ Offline'}
            </Text>
          </View>
        </View>

        {/* Lista de mensagens */}
        <FlatList
          data={conversaMensagens}
          keyExtractor={(item) => item.id}
          renderItem={renderMensagem}
          contentContainerStyle={styles.mensagensList}
          inverted={false}
        />

        {/* Input de mensagem */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            value={novaMensagem}
            onChangeText={setNovaMensagem}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleEnviarMensagem}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Lista de conversas
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💬 Conversas com Tutores</Text>
        <Text style={styles.subtitle}>Atendimento e suporte aos clientes</Text>
      </View>

      <FlatList
        data={contatos}
        keyExtractor={(item) => item.id}
        renderItem={renderContatoCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyText}>Nenhuma conversa ainda</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  listContent: {
    padding: 15,
  },
  contatoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  contatoInfo: {
    flex: 1,
  },
  contatoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  contatoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  contatoHorario: {
    fontSize: 11,
    color: '#999',
  },
  petNome: {
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 4,
    fontWeight: '500',
  },
  ultimaMensagemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ultimaMensagem: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    marginRight: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  onlineStatus: {
    fontSize: 12,
  },
  badgeNaoLidas: {
    backgroundColor: '#f44336',
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeNaoLidasText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  // Estilos da conversa ativa
  conversaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 28,
    color: '#4CAF50',
  },
  conversaAvatarContainer: {
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  conversaAvatarEmoji: {
    fontSize: 24,
  },
  conversaHeaderInfo: {
    flex: 1,
  },
  conversaNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  conversaPet: {
    fontSize: 12,
    color: '#4CAF50',
  },
  conversaStatus: {
    fontSize: 12,
    color: '#999',
  },
  mensagensList: {
    padding: 15,
    paddingBottom: 20,
  },
  mensagemContainer: {
    maxWidth: '80%',
    marginBottom: 12,
    padding: 10,
    borderRadius: 12,
  },
  mensagemUsuario: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50',
    borderBottomRightRadius: 4,
  },
  mensagemContato: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    borderBottomLeftRadius: 4,
  },
  mensagemTexto: {
    fontSize: 14,
    marginBottom: 4,
  },
  mensagemUsuarioTexto: {
    color: '#fff',
  },
  mensagemContatoTexto: {
    color: '#333',
  },
  mensagemHorario: {
    fontSize: 10,
    textAlign: 'right',
  },
  mensagemUsuarioHorario: {
    color: '#e0e0e0',
  },
  mensagemContatoHorario: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 80,
    backgroundColor: '#f5f5f5',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});