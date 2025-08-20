
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { CreateSpellTemplateRequest, UpdateSpellTemplateRequest, SpellSchool } from '@/types/api';
import { Sparkles, BookOpen, Zap } from 'lucide-react';

const spellTemplateSchema = z.object({
  name: z.string().min(1, 'Spell name is required'),
  level: z.number().min(0).max(9),
  school: z.string().min(1, 'School is required'),
  castingTime: z.string().min(1, 'Casting time is required'),
  range: z.string().min(1, 'Range is required'),
  duration: z.string().min(1, 'Duration is required'),
  components: z.string().optional(),
  effect: z.string().optional(),
  damage: z.string().optional(),
  isActive: z.boolean(),
});

interface SpellTemplateFormProps {
  onSubmit: (data: CreateSpellTemplateRequest | UpdateSpellTemplateRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreateSpellTemplateRequest>;
  isEdit?: boolean;
}

const schoolOptions = [
  { value: 'Abjuration', label: 'Abjuration' },
  { value: 'Conjuration', label: 'Conjuration' },
  { value: 'Divination', label: 'Divination' },
  { value: 'Enchantment', label: 'Enchantment' },
  { value: 'Evocation', label: 'Evocation' },
  { value: 'Illusion', label: 'Illusion' },
  { value: 'Necromancy', label: 'Necromancy' },
  { value: 'Transmutation', label: 'Transmutation' },
];

const levelOptions = [
  { value: '0', label: 'Cantrip' },
  ...Array.from({ length: 9 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1}${getOrdinalSuffix(i + 1)} Level`
  }))
];

function getOrdinalSuffix(number: number): string {
  const j = number % 10;
  const k = number % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

const castingTimeOptions = [
  { value: '1 action', label: '1 action' },
  { value: '1 bonus action', label: '1 bonus action' },
  { value: '1 reaction', label: '1 reaction' },
  { value: '1 minute', label: '1 minute' },
  { value: '10 minutes', label: '10 minutes' },
  { value: '1 hour', label: '1 hour' },
  { value: '8 hours', label: '8 hours' },
  { value: '24 hours', label: '24 hours' },
];

const rangeOptions = [
  { value: 'Self', label: 'Self' },
  { value: 'Touch', label: 'Touch' },
  { value: '30 feet', label: '30 feet' },
  { value: '60 feet', label: '60 feet' },
  { value: '90 feet', label: '90 feet' },
  { value: '120 feet', label: '120 feet' },
  { value: '150 feet', label: '150 feet' },
  { value: '300 feet', label: '300 feet' },
  { value: '1 mile', label: '1 mile' },
  { value: 'Unlimited', label: 'Unlimited' },
];

const durationOptions = [
  { value: 'Instantaneous', label: 'Instantaneous' },
  { value: '1 round', label: '1 round' },
  { value: '1 minute', label: '1 minute' },
  { value: '10 minutes', label: '10 minutes' },
  { value: '1 hour', label: '1 hour' },
  { value: '8 hours', label: '8 hours' },
  { value: '24 hours', label: '24 hours' },
  { value: 'Until dispelled', label: 'Until dispelled' },
  { value: 'Permanent', label: 'Permanent' },
];

export const SpellTemplateForm: React.FC<SpellTemplateFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
  isEdit = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateSpellTemplateRequest>({
    resolver: zodResolver(spellTemplateSchema),
    defaultValues: {
      name: initialData?.name || '',
      level: initialData?.level || 0,
      school: initialData?.school || 'Evocation',
      castingTime: initialData?.castingTime || '1 action',
      range: initialData?.range || '60 feet',
      duration: initialData?.duration || 'Instantaneous',
      components: initialData?.components || '',
      effect: initialData?.effect || '',
      damage: initialData?.damage || '',
      isActive: initialData?.isActive ?? true,
    },
  });

  const level = watch('level');
  const school = watch('school');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Basic Information
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Spell Name"
              {...register('name')}
              error={errors.name?.message}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Level"
                options={levelOptions}
                {...register('level', { valueAsNumber: true })}
                error={errors.level?.message}
                required
              />
              <Select
                label="School"
                options={schoolOptions}
                {...register('school')}
                error={errors.school?.message}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Effect/Description
              </label>
              <textarea
                {...register('effect')}
                rows={3}
                className="w-full px-4 py-2 border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 border-gray-300 hover:border-gray-400"
                placeholder="Describe the spell's effect..."
              />
            </div>

            <Input
              label="Damage (optional)"
              {...register('damage')}
              placeholder="e.g., 3d6, 1d8+3, etc."
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('isActive')}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Active (available for use)
              </label>
            </div>
          </CardBody>
        </Card>

        {}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Spell Mechanics
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <Select
              label="Casting Time"
              options={castingTimeOptions}
              {...register('castingTime')}
              error={errors.castingTime?.message}
              required
            />

            <Select
              label="Range"
              options={rangeOptions}
              {...register('range')}
              error={errors.range?.message}
              required
            />

            <Select
              label="Duration"
              options={durationOptions}
              {...register('duration')}
              error={errors.duration?.message}
              required
            />

            <Input
              label="Components"
              {...register('components')}
              placeholder="e.g., V, S, M (a pinch of sulfur)"
              helperText="V = Verbal, S = Somatic, M = Material"
            />
          </CardBody>
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <Button type="submit" size="lg" isLoading={isLoading}>
          {isEdit ? 'Update Spell Template' : 'Create Spell Template'}
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};