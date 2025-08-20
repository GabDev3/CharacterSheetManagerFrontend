// src/hooks/useCharacters.ts - Updated to use PatchCharacterRequest

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Character, CharacterSummary, CreateCharacterRequest, PatchCharacterRequest } from '@/types/api';
import { api } from '@/lib/api';

// Get all characters (summary)
export const useCharacters = () => {
  return useQuery<CharacterSummary[]>({
    queryKey: ['characters'],
    queryFn: async () => {
      const response = await api.get('/Characters');
      return response.data;
    },
  });
};

// Get single character with details
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

// Create character
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

// FIXED: Patch character (partial update)
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
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['characters', variables.id] });
    },
    onError: (error) => {
      console.error('PATCH failed:', error);
    },
  });
};

// Delete character
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