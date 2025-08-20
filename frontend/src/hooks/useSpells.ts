
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Spell, 
  CreateSpellRequest, 
  UpdateSpellRequest,
  CreateFromTemplateRequest 
} from '@/types/api';
import { api } from '@/lib/api';


export const useSpells = () => {
  return useQuery<Spell[]>({
    queryKey: ['spells'],
    queryFn: () => api.get('/Spells').then(res => res.data),
  });
};


export const useSpell = (id: number) => {
  return useQuery<Spell>({
    queryKey: ['spells', id],
    queryFn: () => api.get(`/Spells/${id}`).then(res => res.data),
    enabled: !!id,
  });
};


export const useSpellsByCharacter = (characterId: number) => {
  return useQuery<Spell[]>({
    queryKey: ['spells', 'character', characterId],
    queryFn: () => api.get(`/Spells/by-character/${characterId}`).then(res => res.data),
    enabled: !!characterId,
  });
};


export const useCreateSpell = () => {
  const queryClient = useQueryClient();

  return useMutation<Spell, Error, CreateSpellRequest>({
    mutationFn: (data) => api.post('/Spells', data).then(res => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['spells'] });
      queryClient.invalidateQueries({ queryKey: ['spells', 'character', data.characterId] });
      queryClient.invalidateQueries({ queryKey: ['characters', data.characterId] });
    },
  });
};


export const useCreateSpellFromTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<Spell, Error, CreateFromTemplateRequest>({
    mutationFn: (data) => api.post('/Spells/from-template', data).then(res => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['spells'] });
      queryClient.invalidateQueries({ queryKey: ['spells', 'character', data.characterId] });
      queryClient.invalidateQueries({ queryKey: ['characters', data.characterId] });
    },
  });
};


export const useUpdateSpell = () => {
  const queryClient = useQueryClient();

  return useMutation<Spell, Error, { id: number; data: UpdateSpellRequest }>({
    mutationFn: ({ id, data }) => api.put(`/Spells/${id}`, data).then(res => res.data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['spells'] });
      queryClient.invalidateQueries({ queryKey: ['spells', id] });
      queryClient.invalidateQueries({ queryKey: ['spells', 'character', data.characterId] });
      queryClient.invalidateQueries({ queryKey: ['characters', data.characterId] });
    },
  });
};


export const useDeleteSpell = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => api.delete(`/Spells/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spells'] });
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
};