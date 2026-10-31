import { useEffect } from 'react';
import { notificationService } from '../services/notificationService';

export function useNotificacao() {
  useEffect(() => {
    notificationService.solicitarPermissoes();
  }, []);

  const notificar = (titulo: string, mensagem: string) => {
    notificationService.dispararNotificacao(titulo, mensagem);
  };

  return { notificar };
}