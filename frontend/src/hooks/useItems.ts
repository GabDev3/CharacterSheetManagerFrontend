
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Item, 
  CreateItemRequest, 
  UpdateItemRequest,
  CreateFromTemplateRequest 
} from '@/types/api';
import { api } from '@/lib/api';


export const useItems = () => {
  return useQuery<Item[]>({
    queryKey: ['items'],
    queryFn: () => api.get('/Items').then(res => res.data),
  });
};


export const useItem = (id: number) => {
  return useQuery<Item>({
    queryKey: ['items', id],
    queryFn: () => api.get(`/Items/${id}`).then(res => res.data),
    enabled: !!id,
  });
};


export const useItemsByCharacter = (characterId: number) => {
  return useQuery<Item[]>({
    queryKey: ['items', 'character', characterId],
    queryFn: () => api.get(`/Items/by-character/${characterId}`).then(res => res.data),
    enabled: !!characterId,
  });
};


export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation<Item, Error, CreateItemRequest>({
    mutationFn: (data) => api.post('/Items', data).then(res => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['items', 'character', data.characterId] });
      queryClient.invalidateQueries({ queryKey: ['characters', data.characterId] });
    },
  });
};


export const useCreateItemFromTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<Item, Error, CreateFromTemplateRequest>({
    mutationFn: (data) => api.post('/Items/from-template', data).then(res => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['items', 'character', data.characterId] });
      queryClient.invalidateQueries({ queryKey: ['characters', data.characterId] });
    },
  });
};


export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation<Item, Error, { id: number; data: UpdateItemRequest }>({
    mutationFn: ({ id, data }) => api.put(`/Items/${id}`, data).then(res => res.data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['items', id] });
      queryClient.invalidateQueries({ queryKey: ['items', 'character', data.characterId] });
      queryClient.invalidateQueries({ queryKey: ['characters', data.characterId] });
    },
  });
};


export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => api.delete(`/Items/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
};