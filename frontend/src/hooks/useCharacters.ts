

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Character, CharacterSummary, CreateCharacterRequest, PatchCharacterRequest } from '@/types/api';
import { api } from '@/lib/api';


export const useCharacters = () => {
  return useQuery<CharacterSummary[]>({
    queryKey: ['characters'],
    queryFn: async () => {
      const response = await api.get('/Characters');
      return response.data;
    },
  });
};


export const useCharacter = (id: number) => {
  return useQuery<Character>({
    queryKey: ['characters', id],
    queryFn: async () => {
      const response = await api.get(`/Characters/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};


export const useCreateCharacter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (character: CreateCharacterRequest) => {
      const response = await api.post('/Characters', character);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
};


export const usePatchCharacter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, character }: { id: number; character: PatchCharacterRequest }) => {
      console.log('Sending PATCH request:', { id, character });
      const response = await api.patch(`/Characters/${id}`, character);
      return response.data;
    },
    onSuccess: (data, variables) => {
      console.log('PATCH successful:', data);
      
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['characters', variables.id] });
    },
    onError: (error) => {
      console.error('PATCH failed:', error);
    },
  });
};


export const useDeleteCharacter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/Characters/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
};