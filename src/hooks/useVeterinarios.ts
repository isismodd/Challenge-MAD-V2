import { useQuery } from '@tanstack/react-query';
import { veterinarioService } from '../services/veterinarioService';

export function useVeterinarios() {
  return useQuery({ queryKey: ['veterinarios'], queryFn: veterinarioService.getAll });
}