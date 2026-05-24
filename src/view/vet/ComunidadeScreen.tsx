// src/view/vet/ComunidadeScreen.tsx
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

type Post = {
  id: string;
  autor: string;
  autorAvatar: string;
  tipo: 'veterinario' | 'tutor' | 'admin';
  titulo: string;
  conteudo: string;
  imagem?: string;
  curtidas: number;
  comentarios: number;
  data: string;
  curtidoPorUsuario: boolean;
  categoria: 'dica' | 'artigo' | 'evento' | 'cientifico' | 'duvida';
};

type Comentario = {
  id: string;
  postId: string;
  autor: string;
  conteudo: string;
  data: string;
};

// Posts mockados para a comunidade veterinária
const postsMock: Post[] = [
  {
    id: '1',
    autor: 'Dr. Carlos Silva',
    autorAvatar: '👨‍⚕️',
    tipo: 'veterinario',
    titulo: 'Novo protocolo para manejo de obesidade canina',
    conteudo: 'Compartilho com vocês um novo protocolo que estamos utilizando na clínica para controle de obesidade em cães. Resultados muito positivos nos primeiros 30 dias!',
    curtidas: 89,
    comentarios: 23,
    data: '2025-05-20T10:30:00',
    curtidoPorUsuario: false,
    categoria: 'cientifico',
  },
  {
    id: '2',
    autor: 'Dra. Mariana Costa',
    autorAvatar: '👩‍⚕️',
    tipo: 'veterinario',
    titulo: 'Dica: Dermatologia felina',
    conteudo: 'Atenção colegas! Gatos com dermatite atópica respondem muito bem a ácidos graxos essenciais na dieta. Alguém mais tem tido bons resultados?',
    curtidas: 56,
    comentarios: 18,
    data: '2025-05-19T14:20:00',
    curtidoPorUsuario: true,
    categoria: 'dica',
  },
  {
    id: '3',
    autor: 'Clivo Vet',
    autorAvatar: '🏥',
    tipo: 'admin',
    titulo: 'Webinar Gratuito: Emergências Veterinárias',
    conteudo: 'Participe do nosso webinar no dia 25/06 às 19h. Tema: Manejo de emergências em pequenos animais. Inscrições abertas!',
    curtidas: 234,
    comentarios: 45,
    data: '2025-05-18T09:00:00',
    curtidoPorUsuario: false,
    categoria: 'evento',
  },
  {
    id: '4',
    autor: 'Dr. André Lima',
    autorAvatar: '👨‍⚕️',
    tipo: 'veterinario',
    titulo: 'Artigo: Novas diretrizes de vacinação',
    conteudo: 'ACVIM atualizou as diretrizes de vacinação para cães e gatos. Principais mudanças: vacina contra leptospirose agora é considerada essencial.',
    curtidas: 112,
    comentarios: 34,
    data: '2025-05-17T16:45:00',
    curtidoPorUsuario: false,
    categoria: 'artigo',
  },
  {
    id: '5',
    autor: 'Ana Souza',
    autorAvatar: '🐱',
    tipo: 'tutor',
    titulo: 'Dúvida sobre recuperação pós-cirúrgica',
    conteudo: 'Meu gato foi castrado há 3 dias e está comendo pouco. É normal?',
    curtidas: 23,
    comentarios: 12,
    data: '2025-05-16T20:00:00',
    curtidoPorUsuario: false,
    categoria: 'duvida',
  },
  {
    id: '6',
    autor: 'Dr. Ricardo Alves',
    autorAvatar: '👨‍⚕️',
    tipo: 'veterinario',
    titulo: 'Caso clínico: Corpo estranho esofágico',
    conteudo: 'Compartilhando um caso interessante: Bulldog com corpo estranho no esôfago. Remoção endoscópica bem sucedida!',
    curtidas: 67,
    comentarios: 19,
    data: '2025-05-15T11:00:00',
    curtidoPorUsuario: true,
    categoria: 'cientifico',
  },
];

// Comentários mockados
const comentariosMock: Comentario[] = [
  { id: 'c1', postId: '1', autor: 'Dra. Fernanda', conteudo: 'Excelente protocolo! Vou testar na minha clínica.', data: '2025-05-20T11:00:00' },
  { id: 'c2', postId: '1', autor: 'Dr. Paulo', conteudo: 'Tem artigo publicado sobre isso?', data: '2025-05-20T12:30:00' },
  { id: 'c3', postId: '2', autor: 'Dr. Carlos', conteudo: 'Uso ácidos graxos há 2 anos e os resultados são ótimos!', data: '2025-05-19T15:00:00' },
  { id: 'c4', postId: '5', autor: 'Dr. Carlos Silva', conteudo: 'Olá Ana! É normal nos primeiros dias. Se persistir, traga para uma avaliação.', data: '2025-05-16T21:00:00' },
];

export default function ComunidadeScreen() {
  const [posts, setPosts] = useState<Post[]>(postsMock);
  const [comentarios, setComentarios] = useState<Comentario[]>(comentariosMock);
  const [postSelecionado, setPostSelecionado] = useState<Post | null>(null);
  const [novoComentario, setNovoComentario] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'feed' | 'cientifico' | 'eventos'>('feed');

  const handleCurtir = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              curtidas: post.curtidoPorUsuario ? post.curtidas - 1 : post.curtidas + 1,
              curtidoPorUsuario: !post.curtidoPorUsuario,
            }
          : post
      )
    );
  };

  const handleAbrirComentarios = (post: Post) => {
    setPostSelecionado(post);
    setShowComments(true);
  };

  const handleFecharComentarios = () => {
    setPostSelecionado(null);
    setShowComments(false);
    setNovoComentario('');
  };

  const handleAdicionarComentario = () => {
    if (!novoComentario.trim()) {
      Alert.alert('Aviso', 'Digite um comentário');
      return;
    }

    const novo: Comentario = {
      id: Date.now().toString(),
      postId: postSelecionado!.id,
      autor: 'Dr. Carlos Silva', // Vet logado
      conteudo: novoComentario.trim(),
      data: new Date().toISOString(),
    };

    setComentarios([novo, ...comentarios]);
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postSelecionado!.id
          ? { ...post, comentarios: post.comentarios + 1 }
          : post
      )
    );
    setNovoComentario('');
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'dica': return '💡';
      case 'artigo': return '📄';
      case 'evento': return '🎪';
      case 'cientifico': return '🔬';
      case 'duvida': return '❓';
      default: return '📝';
    }
  };

  const getTipoCor = (tipo: string) => {
    switch (tipo) {
      case 'veterinario': return '#4CAF50';
      case 'tutor': return '#2196F3';
      default: return '#FF9800';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'veterinario': return 'Veterinário';
      case 'tutor': return 'Tutor';
      default: return 'Admin';
    }
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    const agora = new Date();
    const diff = agora.getTime() - data.getTime();
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (dias === 0) return 'Hoje';
    if (dias === 1) return 'Ontem';
    if (dias < 7) return `${dias} dias atrás`;
    return data.toLocaleDateString('pt-BR');
  };

  const filteredPosts = () => {
    if (abaAtiva === 'cientifico') {
      return posts.filter(p => p.categoria === 'cientifico' || p.categoria === 'artigo');
    }
    if (abaAtiva === 'eventos') {
      return posts.filter(p => p.categoria === 'evento');
    }
    return posts;
  };

  const renderPostCard = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      {/* Cabeçalho */}
      <View style={styles.postHeader}>
        <View style={[styles.avatarContainer, { backgroundColor: getTipoCor(item.tipo) }]}>
          <Text style={styles.avatarEmoji}>{item.autorAvatar}</Text>
        </View>
        <View style={styles.postHeaderInfo}>
          <View style={styles.autorRow}>
            <Text style={styles.autorNome}>{item.autor}</Text>
            <View style={[styles.tipoBadge, { backgroundColor: getTipoCor(item.tipo) }]}>
              <Text style={styles.tipoBadgeText}>{getTipoLabel(item.tipo)}</Text>
            </View>
          </View>
          <View style={styles.postMeta}>
            <Text style={styles.categoriaIcon}>{getCategoriaIcon(item.categoria)}</Text>
            <Text style={styles.postData}>{formatarData(item.data)}</Text>
          </View>
        </View>
      </View>

      {/* Título e conteúdo */}
      <Text style={styles.postTitulo}>{item.titulo}</Text>
      <Text style={styles.postConteudo}>{item.conteudo}</Text>

      {/* Ações */}
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleCurtir(item.id)}>
          <Text style={[styles.actionIcon, item.curtidoPorUsuario && styles.actionIconActive]}>
            {item.curtidoPorUsuario ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.actionText}>{item.curtidas}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleAbrirComentarios(item)}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{item.comentarios}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>↗️</Text>
          <Text style={styles.actionText}>Compartilhar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Modal de comentários
  const comentariosDoPost = comentarios.filter(c => c.postId === postSelecionado?.id);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌐 Comunidade Veterinária</Text>
        <Text style={styles.subtitle}>Troque experiências com outros profissionais</Text>
      </View>

      {/* Abas */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'feed' && styles.tabAtiva]}
          onPress={() => setAbaAtiva('feed')}
        >
          <Text style={[styles.tabText, abaAtiva === 'feed' && styles.tabTextAtiva]}>📱 Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'cientifico' && styles.tabAtiva]}
          onPress={() => setAbaAtiva('cientifico')}
        >
          <Text style={[styles.tabText, abaAtiva === 'cientifico' && styles.tabTextAtiva]}>🔬 Científico</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'eventos' && styles.tabAtiva]}
          onPress={() => setAbaAtiva('eventos')}
        >
          <Text style={[styles.tabText, abaAtiva === 'eventos' && styles.tabTextAtiva]}>🎪 Eventos</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de posts */}
      <FlatList
        data={filteredPosts()}
        keyExtractor={(item) => item.id}
        renderItem={renderPostCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Nenhum post encontrado</Text>
          </View>
        }
      />

      {/* Modal de comentários */}
      {showComments && postSelecionado && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💬 Comentários</Text>
              <TouchableOpacity onPress={handleFecharComentarios}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={comentariosDoPost}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.comentarioItem}>
                  <Text style={styles.comentarioAutor}>{item.autor}</Text>
                  <Text style={styles.comentarioTexto}>{item.conteudo}</Text>
                  <Text style={styles.comentarioData}>{formatarData(item.data)}</Text>
                </View>
              )}
              style={styles.comentariosList}
              ListEmptyComponent={
                <Text style={styles.noComments}>Nenhum comentário ainda. Seja o primeiro!</Text>
              }
            />

            <View style={styles.comentarioInputContainer}>
              <TextInput
                style={styles.comentarioInput}
                placeholder="Escreva um comentário como Dr. Carlos Silva..."
                value={novoComentario}
                onChangeText={setNovoComentario}
                multiline
              />
              <TouchableOpacity style={styles.enviarButton} onPress={handleAdicionarComentario}>
                <Text style={styles.enviarButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabAtiva: {
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  tabTextAtiva: {
    color: '#4CAF50',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  postHeaderInfo: {
    flex: 1,
  },
  autorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  autorNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tipoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tipoBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoriaIcon: {
    fontSize: 12,
  },
  postData: {
    fontSize: 12,
    color: '#999',
  },
  postTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  postConteudo: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 5,
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionIconActive: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalClose: {
    fontSize: 24,
    color: '#999',
  },
  comentariosList: {
    maxHeight: 300,
  },
  comentarioItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  comentarioAutor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  comentarioTexto: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  comentarioData: {
    fontSize: 10,
    color: '#999',
  },
  noComments: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
  },
  comentarioInputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  comentarioInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    maxHeight: 80,
  },
  enviarButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  enviarButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});