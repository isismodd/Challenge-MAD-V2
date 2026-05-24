// src/view/tutor/BeneficiosScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';

type Beneficio = {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'plano' | 'desconto' | 'servico' | 'parceria';
  valor?: string;
  validade?: string;
  parceiro: string;
  cor: string;
};

type PlanoSaude = {
  id: string;
  nome: string;
  preco: string;
  beneficios: string[];
  destaque: boolean;
};

// Benefícios mockados
const beneficiosMock: Beneficio[] = [
  {
    id: '1',
    titulo: '20% OFF em Consultas',
    descricao: 'Desconto especial em consultas veterinárias',
    tipo: 'desconto',
    validade: '31/12/2025',
    parceiro: 'Clínica Pet Saúde',
    cor: '#4CAF50',
  },
  {
    id: '2',
    titulo: 'Banho e Tosa Grátis',
    descricao: 'Primeiro banho e tosa gratuito para novos clientes',
    tipo: 'servico',
    validade: '30/06/2025',
    parceiro: 'Pet Shop Amigo',
    cor: '#2196F3',
  },
  {
    id: '3',
    titulo: 'Vacinação com Desconto',
    descricao: '30% de desconto no pacote de vacinas anuais',
    tipo: 'desconto',
    validade: '31/12/2025',
    parceiro: 'VetCare',
    cor: '#FF9800',
  },
  {
    id: '4',
    titulo: 'Raças Especiais',
    descricao: 'Plano especial para pets de raças específicas',
    tipo: 'plano',
    valor: 'R$ 49,90/mês',
    validade: 'Lançamento',
    parceiro: 'PetLove',
    cor: '#9C27B0',
  },
  {
    id: '5',
    titulo: 'Farmácia 15% OFF',
    descricao: 'Desconto em medicamentos e suplementos',
    tipo: 'desconto',
    validade: 'Sempre',
    parceiro: 'Farmácia Vet Popular',
    cor: '#E91E63',
  },
  {
    id: '6',
    titulo: 'Pet Sitter com Desconto',
    descricao: '10% de desconto em serviços de pet sitter',
    tipo: 'servico',
    validade: '31/12/2025',
    parceiro: 'Cuido do Seu Pet',
    cor: '#00BCD4',
  },
];

// Planos de saúde mockados
const planosSaudeMock: PlanoSaude[] = [
  {
    id: '1',
    nome: 'Plano Básico',
    preco: 'R$ 39,90/mês',
    beneficios: [
      '2 consultas por ano',
      'Vacinas anuais com desconto',
      'Desconto em exames (15%)',
      'Telemedicina 24h',
    ],
    destaque: false,
  },
  {
    id: '2',
    nome: 'Plano Premium',
    preco: 'R$ 79,90/mês',
    beneficios: [
      '4 consultas por ano',
      'Vacinas anuais grátis',
      'Exames com 30% de desconto',
      'Telemedicina 24h',
      'Banho e tosa incluído (2x/ano)',
      'Atendimento prioritário',
    ],
    destaque: true,
  },
  {
    id: '3',
    nome: 'Plano Completo',
    preco: 'R$ 129,90/mês',
    beneficios: [
      'Consultas ilimitadas',
      'Vacinas anuais grátis',
      'Exames com 50% de desconto',
      'Telemedicina 24h',
      'Banho e tosa mensal',
      'Atendimento domiciliar',
      'Pet sitter incluso (4h/mês)',
    ],
    destaque: false,
  },
];

export default function BeneficiosScreen() {
  const [beneficios, setBeneficios] = useState(beneficiosMock);
  const [planos, setPlanos] = useState(planosSaudeMock);
  const [abaAtiva, setAbaAtiva] = useState<'beneficios' | 'planos'>('beneficios');

  const handleResgatarBeneficio = (beneficio: Beneficio) => {
    Alert.alert(
      'Resgatar Benefício',
      `Deseja resgatar "${beneficio.titulo}"?\n\n${beneficio.descricao}\n\nParceiro: ${beneficio.parceiro}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resgatar',
          onPress: () => Alert.alert('Sucesso', `Benefício resgatado! Apresente no app para o parceiro.`),
        },
      ]
    );
  };

  const handleContratarPlano = (plano: PlanoSaude) => {
    Alert.alert(
      'Contratar Plano',
      `Você está contratando o ${plano.nome} - ${plano.preco}\n\nDeseja continuar?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Contratar',
          onPress: () => Alert.alert('Sucesso', `Plano ${plano.nome} contratado com sucesso! Bem-vindo.`),
        },
      ]
    );
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'plano':
        return '📋';
      case 'desconto':
        return '💰';
      case 'servico':
        return '🐾';
      case 'parceria':
        return '🤝';
      default:
        return '🎁';
    }
  };

  const renderBeneficioCard = ({ item }: { item: Beneficio }) => (
    <TouchableOpacity
      style={[styles.beneficioCard, { borderLeftColor: item.cor }]}
      onPress={() => handleResgatarBeneficio(item)}
      activeOpacity={0.7}
    >
      <View style={styles.beneficioHeader}>
        <Text style={styles.beneficioIcon}>{getTipoIcon(item.tipo)}</Text>
        <View style={styles.beneficioInfo}>
          <Text style={styles.beneficioTitulo}>{item.titulo}</Text>
          <Text style={styles.beneficioParceiro}>{item.parceiro}</Text>
        </View>
      </View>
      
      <Text style={styles.beneficioDescricao}>{item.descricao}</Text>
      
      <View style={styles.beneficioFooter}>
        {item.valor && (
          <Text style={styles.beneficioValor}>{item.valor}</Text>
        )}
        <Text style={styles.beneficioValidade}>⏱️ Válido até: {item.validade}</Text>
      </View>
      
      <TouchableOpacity style={[styles.resgatarButton, { backgroundColor: item.cor }]}>
        <Text style={styles.resgatarButtonText}>Resgatar →</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPlanoCard = ({ item }: { item: PlanoSaude }) => (
    <View style={[styles.planoCard, item.destaque && styles.planoCardDestaque]}>
      {item.destaque && (
        <View style={styles.destaqueBadge}>
          <Text style={styles.destaqueBadgeText}>⭐ MAIS POPULAR</Text>
        </View>
      )}
      
      <Text style={styles.planoNome}>{item.nome}</Text>
      <Text style={styles.planoPreco}>{item.preco}</Text>
      
      <View style={styles.planoBeneficios}>
        {item.beneficios.map((beneficio, index) => (
          <View key={index} style={styles.beneficioItem}>
            <Text style={styles.beneficioCheck}>✓</Text>
            <Text style={styles.beneficioTexto}>{beneficio}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity
        style={[styles.contratarButton, item.destaque && styles.contratarButtonDestaque]}
        onPress={() => handleContratarPlano(item)}
      >
        <Text style={styles.contratarButtonText}>Contratar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎁 Benefícios e Planos</Text>
        <Text style={styles.subtitle}>Aproveite vantagens exclusivas para seu pet</Text>
      </View>

      {/* Abas */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'beneficios' && styles.tabAtiva]}
          onPress={() => setAbaAtiva('beneficios')}
        >
          <Text style={[styles.tabText, abaAtiva === 'beneficios' && styles.tabTextAtiva]}>
            🎁 Benefícios
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, abaAtiva === 'planos' && styles.tabAtiva]}
          onPress={() => setAbaAtiva('planos')}
        >
          <Text style={[styles.tabText, abaAtiva === 'planos' && styles.tabTextAtiva]}>
            📋 Planos de Saúde
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo da aba ativa */}
      {abaAtiva === 'beneficios' ? (
        <FlatList
          data={beneficios}
          keyExtractor={(item) => item.id}
          renderItem={renderBeneficioCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum benefício disponível no momento</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={planos}
          keyExtractor={(item) => item.id}
          renderItem={renderPlanoCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum plano disponível no momento</Text>
            </View>
          }
        />
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
    backgroundColor: '#00098d',
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
    paddingVertical: 5,
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
    borderBottomColor: '#410418',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  tabTextAtiva: {
    color: '#E91E63',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  beneficioCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  beneficioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  beneficioIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  beneficioInfo: {
    flex: 1,
  },
  beneficioTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  beneficioParceiro: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  beneficioDescricao: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  beneficioFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  beneficioValor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  beneficioValidade: {
    fontSize: 12,
    color: '#999',
  },
  resgatarButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  resgatarButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  planoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planoCardDestaque: {
    borderWidth: 2,
    borderColor: '#FFD700',
    transform: [{ scale: 1.02 }],
  },
  destaqueBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  destaqueBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  planoNome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  planoPreco: {
    fontSize: 18,
    color: '#027202',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  planoBeneficios: {
    marginBottom: 20,
  },
  beneficioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  beneficioCheck: {
    width: 24,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  beneficioTexto: {
    flex: 1,
    fontSize: 13,
    color: '#666',
  },
  contratarButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contratarButtonDestaque: {
    backgroundColor: '#e4ba00',
  },
  contratarButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});