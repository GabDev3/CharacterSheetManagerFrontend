
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ItemTemplate, 
  CreateItemTemplateRequest, 
  UpdateItemTemplateRequest 
} from '@/types/api';
import { api } from '@/lib/api';


export const useItemTemplates = () => {
  return useQuery<ItemTemplate[]>({
    queryKey: ['itemTemplates'],
    queryFn: () => api.get('/ItemTemplates').then(res => res.data),
  });
};


export const useActiveItemTemplates = () => {
  return useQuery<ItemTemplate[]>({
    queryKey: ['itemTemplates', 'active'],
    queryFn: () => api.get('/ItemTemplates/active').then(res => res.data),
  });
};


export const useItemTemplate = (id: number) => {
  return useQuery<ItemTemplate>({
    queryKey: ['itemTemplates', id],
    queryFn: () => api.get(`/ItemTemplates/${id}`).then(res => res.data),
    enabled: !!id,
  });
};


export const useCreateItemTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<ItemTemplate, Error, CreateItemTemplateRequest>({
    mutationFn: (data) => api.post('/ItemTemplates', data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemTemplates'] });
    },
  });
};


export const useUpdateItemTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<ItemTemplate, Error, { id: number; data: UpdateItemTemplateRequest }>({
    mutationFn: ({ id, data }) => api.put(`/ItemTemplates/${id}`, data).then(res => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['itemTemplates'] });
      queryClient.invalidateQueries({ queryKey: ['itemTemplates', id] });
    },
  });
};


export const usePatchItemTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<ItemTemplate, Error, { id: number; data: Partial<UpdateItemTemplateRequest> }>({
    mutationFn: ({ id, data }) => api.patch(`/ItemTemplates/${id}`, data).then(res => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['itemTemplates'] });
      queryClient.invalidateQueries({ queryKey: ['itemTemplates', id] });
    },
  });
};


export const useDeleteItemTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => api.delete(`/ItemTemplates/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemTemplates'] });
    },
  });
};


export const useItemTemplatesByCategory = (category: string) => {
  return useQuery<ItemTemplate[]>({
    queryKey: ['itemTemplates', 'category', category],
    queryFn: () => api.get(`/ItemTemplates/by-category/${category}`).then(res => res.data),
    enabled: !!category,
  });
};


export const useItemTemplateCategories = () => {
  return useQuery<string[]>({
    queryKey: ['itemTemplates', 'categories'],
    queryFn: () => api.get('/ItemTemplates/categories').then(res => res.data),
  });
};