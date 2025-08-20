// src/hooks/useSpellTemplates.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  SpellTemplate, 
  CreateSpellTemplateRequest, 
  UpdateSpellTemplateRequest 
} from '@/types/api';
import { api } from '@/lib/api';

// Get all spell templates
export const useSpellTemplates = () => {
  return useQuery<SpellTemplate[]>({
    queryKey: ['spellTemplates'],
    queryFn: () => api.get('/SpellTemplates').then(res => res.data),
  });
};

// Get active spell templates only
export const useActiveSpellTemplates = () => {
  return useQuery<SpellTemplate[]>({
    queryKey: ['spellTemplates', 'active'],
    queryFn: () => api.get('/SpellTemplates/active').then(res => res.data),
  });
};

// Get single spell template
export const useSpellTemplate = (id: number) => {
  return useQuery<SpellTemplate>({
    queryKey: ['spellTemplates', id],
    queryFn: () => api.get(`/SpellTemplates/${id}`).then(res => res.data),
    enabled: !!id,
  });
};

// Create spell template
export const useCreateSpellTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<SpellTemplate, Error, CreateSpellTemplateRequest>({
    mutationFn: (data) => api.post('/SpellTemplates', data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spellTemplates'] });
    },
  });
};

// Update spell template
export const useUpdateSpellTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<SpellTemplate, Error, { id: number; data: UpdateSpellTemplateRequest }>({
    mutationFn: ({ id, data }) => api.put(`/SpellTemplates/${id}`, data).then(res => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['spellTemplates'] });
      queryClient.invalidateQueries({ queryKey: ['spellTemplates', id] });
    },
  });
};

// Partially update spell template
export const usePatchSpellTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<SpellTemplate, Error, { id: number; data: Partial<UpdateSpellTemplateRequest> }>({
    mutationFn: ({ id, data }) => api.patch(`/SpellTemplates/${id}`, data).then(res => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['spellTemplates'] });
      queryClient.invalidateQueries({ queryKey: ['spellTemplates', id] });
    },
  });
};

// Delete spell template
export const useDeleteSpellTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => api.delete(`/SpellTemplates/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spellTemplates'] });
    },
  });
};

// Get spell templates by level
export const useSpellTemplatesByLevel = (level: number) => {
  return useQuery<SpellTemplate[]>({
    queryKey: ['spellTemplates', 'level', level],
    queryFn: () => api.get(`/SpellTemplates/by-level/${level}`).then(res => res.data),
    enabled: level !== undefined,
  });
};

// Get spell templates by school
export const useSpellTemplatesBySchool = (school: string) => {
  return useQuery<SpellTemplate[]>({
    queryKey: ['spellTemplates', 'school', school],
    queryFn: () => api.get(`/SpellTemplates/by-school/${school}`).then(res => res.data),
    enabled: !!school,
  });
};

// Get available schools
export const useSpellTemplateSchools = () => {
  return useQuery<string[]>({
    queryKey: ['spellTemplates', 'schools'],
    queryFn: () => api.get('/SpellTemplates/schools').then(res => res.data),
  });
};