import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLembretes, useEnviarTodosPendentes } from '../../hooks/useLembretes';
import { useTheme } from '../../control/ThemeContext';

type Filtro = 'todos' | 'pendentes';

export default function SaudePreventivaScreen() {
  const { data: lembretesData, isLoading, isError, refetch } = useLembretes();
  const enviarTodos = useEnviarTodosPendentes();
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const { colors } = useTheme();

  const lembretes = Array.isArray(lembretesData) ? lembretesData : [];

  useEffect(() => {
    if (lembretes.length > 0) {
      console.log('EXEMPLO DE LEMBRETE:', JSON.stringify(lembretes[0], null, 2));
    }
  }, [lembretes]);

  const getEmail = (item: any): string => {
    return (
      item.tutorEmail || item.email || item.tutor_email || item.emailTutor ||
      item.consulta?.tutorEmail || item.animal?.tutorEmail || item.consulta?.animal?.tutorEmail || '-'
    );
  };

  const isEmailValido = (email: string): boolean => {
    if (!email) return false;
    const emailTratado = String(email).trim();
    if (emailTratado === '' || emailTratado === '-' || emailTratado.toLowerCase() === 'null' || emailTratado.toLowerCase() === 'undefined') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailTratado);
  };

  const getAnimalNome = (item: any): string => {
    return item.animalNome || item.animal?.nome || item.consulta?.animalNome || item.consulta?.animal?.nome || '-';
  };

  const getTutorNome = (item: any): string => {
    return item.tutorNome || item.consulta?.tutorNome || item.animal?.tutorNome || item.consulta?.animal?.tutorNome || '-';
  };

  const isEnviado = (item: any): boolean => {
    const valor = item.enviado ?? item.enviadoFlag ?? item.status;
    return valor === true || valor === 1 || valor === 'S' || valor === 'ENVIADO';
  };

  const stats = useMemo(() => {
    const total = lembretes.length;
    const enviados = lembretes.filter((item: any) => isEnviado(item)).length;
    const listaPendentes = lembretes.filter((item: any) => !isEnviado(item));
    const pendentes = listaPendentes.length;
    const semEmailValido = listaPendentes.filter((item: any) => !isEmailValido(getEmail(item))).length;
    const aptosParaEnvio = pendentes - semEmailValido;

    return { total, enviados, pendentes, semEmailValido, aptosParaEnvio };
  }, [lembretes]);

  const lembretesFiltrados = useMemo(() => {
    if (filtro === 'pendentes') {
      return lembretes.filter((item: any) => !isEnviado(item));
    }
    return lembretes;
  }, [lembretes, filtro]);

  const executarEnvio = () => {
    enviarTodos.mutate(undefined, {
      onSuccess: (response: any) => {
        const mensagem = response?.message || response?.mensagem || `${stats.aptosParaEnvio} lembrete(s) enviado(s) com sucesso.`;
        Alert.alert('Sucesso', mensagem);
        refetch();
      },
      onError: (error: any) => {
        const mensagem = error?.response?.data?.message || error?.response?.data?.mensagem || error?.response?.data?.erro || 'Não foi possível enviar os lembretes. Verifique se os tutores possuem e-mails válidos.';
        Alert.alert('Erro no envio', mensagem);
      },
    });
  };

  const handleEnviarTodos = () => {
    if (stats.pendentes === 0) {
      Alert.alert('Aviso', 'Não há lembretes pendentes para enviar.');
      return;
    }

    if (stats.aptosParaEnvio === 0) {
      Alert.alert('Nenhum e-mail válido', 'Não foi possível realizar o envio porque nenhum lembrete pendente possui um endereço de e-mail válido.\n\nVerifique o cadastro dos tutores e tente novamente.');
      return;
    }

    if (stats.semEmailValido > 0) {
      Alert.alert('Atenção', `${stats.semEmailValido} lembrete(s) não possuem e-mail válido e não poderão ser enviados.\n\n${stats.aptosParaEnvio} lembrete(s) possuem e-mail válido.\n\nDeseja continuar?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Continuar', onPress: executarEnvio },
      ]);
      return;
    }

    Alert.alert('Enviar lembretes', `Deseja enviar ${stats.aptosParaEnvio} lembrete(s) pendente(s) por e-mail?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Enviar', onPress: executarEnvio },
    ]);
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando lembretes...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: '#ef4444' }]}>Erro ao carregar lembretes.</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={() => refetch()}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderLembreteCard = ({ item }: { item: any }) => {
    const enviado = isEnviado(item);
    const email = getEmail(item);
    const emailValido = isEmailValido(email);
    const animalNome = getAnimalNome(item);
    const tutorNome = getTutorNome(item);

    return (
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.titulo, { color: colors.text }]}>Lembrete #{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: enviado ? '#10b981' : '#f59e0b' }]}>
            <Text style={styles.statusText}>{enviado ? 'ENVIADO' : 'PENDENTE'}</Text>
          </View>
        </View>

        <Text style={[styles.info, { color: colors.textSecondary }]}>Animal: {animalNome}</Text>
        <Text style={[styles.info, { color: colors.textSecondary }]}>Tutor: {tutorNome}</Text>
        <Text style={[styles.info, !emailValido && styles.emailInvalido, { color: emailValido ? colors.textSecondary : '#dc2626' }]}>
          E-mail: {emailValido ? email : `${email} ⚠️`}
        </Text>

        {!emailValido && !enviado && (
          <View style={styles.avisoEmailContainer}>
            <Text style={styles.avisoEmailTitulo}>⚠️ E-mail inválido</Text>
            <Text style={styles.avisoEmailTexto}>Este lembrete não poderá ser enviado porque o tutor não possui um endereço de e-mail válido.</Text>
          </View>
        )}

        <Text style={[styles.info, { color: colors.textSecondary }]}>
          Data de Envio: {item.dataEnvio ? new Date(item.dataEnvio).toLocaleString('pt-BR') : '-'}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <Text style={styles.title}>Lembretes</Text>
      </View>

      <View style={[styles.statsContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>{stats.total}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Enviados</Text>
          <Text style={[styles.statValue, { color: '#10b981' }]}>{stats.enviados}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pendentes</Text>
          <Text style={[styles.statValue, { color: '#f59e0b' }]}>{stats.pendentes}</Text>
        </View>
      </View>

      {stats.semEmailValido > 0 && (
        <View style={styles.resumoEmailInvalido}>
          <Text style={styles.resumoEmailTitulo}>⚠️ Atenção</Text>
          <Text style={styles.resumoEmailTexto}>{stats.semEmailValido} lembrete(s) pendente(s) não possuem e-mail válido.</Text>
          <Text style={styles.resumoEmailTexto}>Aptos para envio: {stats.aptosParaEnvio}</Text>
        </View>
      )}

      <View style={styles.actionsContainer}>
        <View style={[styles.toggleContainer, { backgroundColor: colors.border }]}>
          <TouchableOpacity style={[styles.toggleButton, filtro === 'todos' && { backgroundColor: colors.card, elevation: 2 }]} onPress={() => setFiltro('todos')}>
            <Text style={[styles.toggleText, { color: colors.textSecondary }, filtro === 'todos' && { color: colors.primary }]}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleButton, filtro === 'pendentes' && { backgroundColor: colors.card, elevation: 2 }]} onPress={() => setFiltro('pendentes')}>
            <Text style={[styles.toggleText, { color: colors.textSecondary }, filtro === 'pendentes' && { color: colors.primary }]}>Pendentes</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.btnEnviarTodos, { backgroundColor: colors.button }, enviarTodos.isPending && { opacity: 0.7 }]} onPress={handleEnviarTodos} disabled={enviarTodos.isPending}>
          {enviarTodos.isPending ? (
            <View style={styles.enviandoContainer}>
              <ActivityIndicator color={colors.buttonText} />
              <Text style={[styles.btnEnviarTodosText, { color: colors.buttonText }]}>Enviando...</Text>
            </View>
          ) : (
            <Text style={[styles.btnEnviarTodosText, { color: colors.buttonText }]}>Enviar Todos Pendentes</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={lembretesFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderLembreteCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.textSecondary }]}>{filtro === 'pendentes' ? 'Nenhum lembrete pendente.' : 'Nenhum lembrete cadastrado.'}</Text>}
        refreshing={isLoading}
        onRefresh={() => refetch()}
        extraData={filtro}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, fontSize: 14 },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: 1 },
  statCard: { flex: 1, alignItems: 'center', marginHorizontal: 5, paddingVertical: 10, borderRadius: 10, elevation: 1 },
  statLabel: { fontSize: 12, marginBottom: 5 },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  resumoEmailInvalido: { marginHorizontal: 15, marginTop: 15, backgroundColor: '#fff7ed', borderWidth: 1, borderColor: '#fdba74', borderRadius: 10, padding: 12 },
  resumoEmailTitulo: { color: '#c2410c', fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  resumoEmailTexto: { color: '#9a3412', fontSize: 13, marginBottom: 2 },
  actionsContainer: { padding: 15, gap: 10 },
  toggleContainer: { flexDirection: 'row', borderRadius: 10, padding: 4 },
  toggleButton: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  toggleText: { fontSize: 14, fontWeight: '600' },
  btnEnviarTodos: { padding: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', minHeight: 50 },
  btnEnviarTodosText: { fontWeight: 'bold', fontSize: 15 },
  enviandoContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  listContent: { padding: 15, paddingBottom: 40 },
  card: { borderRadius: 12, padding: 15, marginBottom: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  titulo: { fontSize: 16, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  info: { fontSize: 14, marginBottom: 5 },
  emailInvalido: { fontWeight: '600' },
  avisoEmailContainer: { marginTop: 5, marginBottom: 10, padding: 10, backgroundColor: '#fee2e2', borderRadius: 8, borderWidth: 1, borderColor: '#fecaca' },
  avisoEmailTitulo: { color: '#991b1b', fontWeight: 'bold', fontSize: 13, marginBottom: 3 },
  avisoEmailTexto: { color: '#991b1b', fontSize: 12, lineHeight: 17 },
  emptyText: { textAlign: 'center', marginTop: 50 },
  errorText: { fontSize: 16, marginBottom: 15, textAlign: 'center' },
  retryButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: 'bold' },
});