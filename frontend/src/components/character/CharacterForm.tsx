// src/components/character/CharacterForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { ImageUpload } from './ImageUpload';
import { CreateCharacterRequest, CharacterClass } from '@/types/api';
import { User, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const characterSchema = z.object({
  name: z.string().min(1, 'Character name is required'),
  class: z.string().min(1, 'Class is required'),
  level: z.number().min(1).max(20),
  armorClass: z.number().min(1).max(30),
  strength: z.number().min(1).max(20),
  dexterity: z.number().min(1).max(20),
  constitution: z.number().min(1).max(20),
  intelligence: z.number().min(1).max(20),
  wisdom: z.number().min(1).max(20),
  charisma: z.number().min(1).max(20),
});

interface CharacterFormProps {
  onSubmit: (data: CreateCharacterRequest) => void;
  isLoading?: boolean;
}

const classOptions = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
  'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
].map(cls => ({ value: cls, label: cls }));

export const CharacterForm: React.FC<CharacterFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [characterImage, setCharacterImage] = useState<string>();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateCharacterRequest>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      level: 1,
      armorClass: 10,
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
  });

  const level = watch('level');

  const onFormSubmit = (data: CreateCharacterRequest) => {
    onSubmit({
      ...data,
      imageBase64: characterImage,
    });
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <User className="w-5 h-5 mr-2" />
              Basic Information
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Character Name"
              {...register('name')}
              error={errors.name?.message}
              required
            />

            <div className="grid grid-cols-3 gap-4">
              <Select
                label="Class"
                options={classOptions}
                placeholder="Select Class"
                {...register('class')}
                error={errors.class?.message}
                required
              />
              <Input
                label="Level"
                type="number"
                min={1}
                max={20}
                {...register('level', { valueAsNumber: true })}
                error={errors.level?.message}
              />
              <Input
                label="Armor Class"
                type="number"
                min={1}
                max={30}
                {...register('armorClass', { valueAsNumber: true })}
                error={errors.armorClass?.message}
              />
            </div>

            <ImageUpload
              onImageChange={setCharacterImage}
              currentImage={characterImage}
            />
          </CardBody>
        </Card>

        {/* Ability Scores */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Ability Scores
            </h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Strength"
                type="number"
                min={1}
                max={20}
                {...register('strength', { valueAsNumber: true })}
                error={errors.strength?.message}
              />
              <Input
                label="Dexterity"
                type="number"
                min={1}
                max={20}
                {...register('dexterity', { valueAsNumber: true })}
                error={errors.dexterity?.message}
              />
              <Input
                label="Constitution"
                type="number"
                min={1}
                max={20}
                {...register('constitution', { valueAsNumber: true })}
                error={errors.constitution?.message}
              />
              <Input
                label="Intelligence"
                type="number"
                min={1}
                max={20}
                {...register('intelligence', { valueAsNumber: true })}
                error={errors.intelligence?.message}
              />
              <Input
                label="Wisdom"
                type="number"
                min={1}
                max={20}
                {...register('wisdom', { valueAsNumber: true })}
                error={errors.wisdom?.message}
              />
              <Input
                label="Charisma"
                type="number"
                min={1}
                max={20}
                {...register('charisma', { valueAsNumber: true })}
                error={errors.charisma?.message}
              />
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <Button type="submit" size="lg" isLoading={isLoading}>
          Create Character
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};