// sru/pages/CreateCharacter.tsx
import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { CharacterForm } from '@/components/character/CharacterForm';
import { useCreateCharacter } from '@/hooks/useCharacters';
import { CreateCharacterRequest } from '@/types/api';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CreateCharacter: React.FC = () => {
  const navigate = useNavigate();
  const createCharacter = useCreateCharacter();

  const handleSubmit = (data: CreateCharacterRequest) => {
    createCharacter.mutate(data, {
      onSuccess: () => {
        navigate('/characters');
      },
    });
  };

  return (
    <div>
      <PageHeader
        title="Add New Character"
        subtitle="Create your next D&D adventure companion"
        icon={UserPlus}
      />

      <CharacterForm
        onSubmit={handleSubmit}
        isLoading={createCharacter.isLoading}
      />
    </div>
  );
};