// src/view/tutor/ChatScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';

type Contato = {
  id: string;
  nome: string;
  avatar: string;
  tipo: 'veterinario' | 'tutor' | 'suporte';
  ultimaMensagem: string;
  horario: string;
  naoLidas: number;
  online: boolean;
  especialidade?: string;
};

type Mensagem = {
  id: string;
  contatoId: string;
  texto: string;
  enviadoPor: 'usuario' | 'contato';
  horario: string;
  lida: boolean;
};

// Contatos mockados
const contatosMock: Contato[] = [
  {
    id: '1',
    nome: 'Dr. Carlos Silva',
    avatar: '👨‍⚕️',
    tipo: 'veterinario',
    ultimaMensagem: 'Os exames do Thor estão normais. Pode ficar tranquila!',
    horario: '14:30',
    naoLidas: 2,
    online: true,
    especialidade: 'Clínico Geral',
  },
  {
    id: '2',
    nome: 'Dra. Mariana Costa',
    avatar: '👩‍⚕️',
    tipo: 'veterinario',
    ultimaMensagem: 'Agende o retorno da Luna para a próxima semana.',
    horario: 'Ontem',
    naoLidas: 0,
    online: false,
    especialidade: 'Dermatologia',
  },
  {
    id: '3',
    nome: 'Suporte Clivo Vet',
    avatar: '📞',
    tipo: 'suporte',
    ultimaMensagem: 'Como podemos ajudar você hoje?',
    horario: 'Ontem',
    naoLidas: 0,
    online: true,
  },
  {
    id: '4',
    nome: 'Grupo de Cachorros',
    avatar: '🐕',
    tipo: 'tutor',
    ultimaMensagem: 'Alguém tem dica de adestramento?',
    horario: 'Ontem',
    naoLidas: 5,
    online: false,
  },
  {
    id: '5',
    nome: 'Grupo de Gatos',
    avatar: '🐈',
    tipo: 'tutor',
    ultimaMensagem: 'Minha gata está muito agitada à noite...',
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
      texto: 'Olá! Como está o Thor hoje?',
      enviadoPor: 'contato',
      horario: '14:00',
      lida: true,
    },
    {
      id: 'm2',
      contatoId: '1',
      texto: 'Ele está melhor, Dr. Está comendo bem.',
      enviadoPor: 'usuario',
      horario: '14:05',
      lida: true,
    },
    {
      id: 'm3',
      contatoId: '1',
      texto: 'Que bom! Os exames chegaram. Estão normais.',
      enviadoPor: 'contato',
      horario: '14:30',
      lida: false,
    },
    {
      id: 'm4',
      contatoId: '1',
      texto: 'Pode ficar tranquila, está tudo bem com ele.',
      enviadoPor: 'contato',
      horario: '14:31',
      lida: false,
    },
  ],
  '2': [
    {
      id: 'm5',
      contatoId: '2',
      texto: 'Dra., a Luna ainda está com coceira.',
      enviadoPor: 'usuario',
      horario: '10:00',
      lida: true,
    },
    {
      id: 'm6',
      contatoId: '2',
      texto: 'Precisamos agendar o retorno para a próxima semana.',
      enviadoPor: 'contato',
      horario: 'Ontem',
      lida: true,
    },
    {
      id: 'm7',
      contatoId: '2',
      texto: 'Ok, pode ser na terça?',
      enviadoPor: 'usuario',
      horario: 'Ontem',
      lida: true,
    },
    {
      id: 'm8',
      contatoId: '2',
      texto: 'Agende o retorno da Luna para a próxima semana.',
      enviadoPor: 'contato',
      horario: 'Ontem',
      lida: true,
    },
  ],
  '3': [
    {
      id: 'm9',
      contatoId: '3',
      texto: 'Bem-vindo ao Suporte Clivo Vet!',
      enviadoPor: 'contato',
      horario: '10:00',
      lida: true,
    },
    {
      id: 'm10',
      contatoId: '3',
      texto: 'Como podemos ajudar você hoje?',
      enviadoPor: 'contato',
      horario: '10:01',
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

    // Simular resposta automática após 1 segundo (apenas para demo)
    setTimeout(() => {
      const resposta: Mensagem = {
        id: (Date.now() + 1).toString(),
        contatoId: conversaAtiva.id,
        texto: 'Obrigado pela mensagem! Em breve retornarei.',
        enviadoPor: 'contato',
        horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        lida: false,
      };
      setMensagens(prev => ({
        ...prev,
        [conversaAtiva.id]: [...(prev[conversaAtiva.id] || []), resposta],
      }));
    }, 1000);
  };

  const getTipoCor = (tipo: string) => {
    switch (tipo) {
      case 'veterinario': return '#4CAF50';
      case 'tutor': return '#2196F3';
      default: return '#FF9800';
    }
  };

  const getAvatarTexto = (contato: Contato) => {
    if (contato.online) return '🟢';
    return '⚪';
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
        
        {item.especialidade && (
          <Text style={styles.contatoEspecialidade}>{item.especialidade}</Text>
        )}
        
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
            {conversaAtiva.especialidade && (
              <Text style={styles.conversaEspecialidade}>{conversaAtiva.especialidade}</Text>
            )}
            <Text style={styles.conversaStatus}>
              {conversaAtiva.online ? 'Online agora' : 'Offline'}
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
        <Text style={styles.title}>💬 Conversas</Text>
        <Text style={styles.subtitle}>Mensagens com veterinários e outros tutores</Text>
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
    backgroundColor: '#2196F3',
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
  contatoEspecialidade: {
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 4,
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
    color: '#2196F3',
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
  conversaEspecialidade: {
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
    backgroundColor: '#2196F3',
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
    backgroundColor: '#2196F3',
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