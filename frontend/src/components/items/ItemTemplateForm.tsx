
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { CreateItemTemplateRequest, UpdateItemTemplateRequest, ItemCategory } from '@/types/api';
import { Sword, Shield, Settings } from 'lucide-react';

const itemTemplateSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  category: z.string().min(1, 'Category is required'),
  effect: z.string().optional(),
  strengthBonus: z.number().min(0).optional(),
  dexterityBonus: z.number().min(0).optional(),
  constitutionBonus: z.number().min(0).optional(),
  intelligenceBonus: z.number().min(0).optional(),
  wisdomBonus: z.number().min(0).optional(),
  charismaBonus: z.number().min(0).optional(),
  armorBonus: z.number().min(0).optional(),
  isActive: z.boolean(),
});

interface ItemTemplateFormProps {
  onSubmit: (data: CreateItemTemplateRequest | UpdateItemTemplateRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreateItemTemplateRequest>;
  isEdit?: boolean;
}

const categoryOptions = [
  { value: 'Weapon', label: 'Weapon' },
  { value: 'Armor', label: 'Armor' },
  { value: 'Accessory', label: 'Accessory' },
  { value: 'Consumable', label: 'Consumable' },
  { value: 'Miscellaneous', label: 'Miscellaneous' },
];

export const ItemTemplateForm: React.FC<ItemTemplateFormProps> = ({
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
  } = useForm<CreateItemTemplateRequest>({
    resolver: zodResolver(itemTemplateSchema),
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || 'Weapon',
      effect: initialData?.effect || '',
      strengthBonus: initialData?.strengthBonus || 0,
      dexterityBonus: initialData?.dexterityBonus || 0,
      constitutionBonus: initialData?.constitutionBonus || 0,
      intelligenceBonus: initialData?.intelligenceBonus || 0,
      wisdomBonus: initialData?.wisdomBonus || 0,
      charismaBonus: initialData?.charismaBonus || 0,
      armorBonus: initialData?.armorBonus || 0,
      isActive: initialData?.isActive ?? true,
    },
  });

  const category = watch('category');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <Sword className="w-5 h-5 mr-2" />
              Basic Information
            </h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Item Name"
              {...register('name')}
              error={errors.name?.message}
              required
            />

            <Select
              label="Category"
              options={categoryOptions}
              placeholder="Select Category"
              {...register('category')}
              error={errors.category?.message}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Effect/Description
              </label>
              <textarea
                {...register('effect')}
                rows={3}
                className="w-full px-4 py-2 border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 border-gray-300 hover:border-gray-400"
                placeholder="Describe the item's effect or properties..."
              />
            </div>

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
              <Shield className="w-5 h-5 mr-2" />
              Stat Bonuses
            </h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Strength Bonus"
                type="number"
                min={0}
                max={10}
                {...register('strengthBonus', { valueAsNumber: true })}
                error={errors.strengthBonus?.message}
              />
              <Input
                label="Dexterity Bonus"
                type="number"
                min={0}
                max={10}
                {...register('dexterityBonus', { valueAsNumber: true })}
                error={errors.dexterityBonus?.message}
              />
              <Input
                label="Constitution Bonus"
                type="number"
                min={0}
                max={10}
                {...register('constitutionBonus', { valueAsNumber: true })}
                error={errors.constitutionBonus?.message}
              />
              <Input
                label="Intelligence Bonus"
                type="number"
                min={0}
                max={10}
                {...register('intelligenceBonus', { valueAsNumber: true })}
                error={errors.intelligenceBonus?.message}
              />
              <Input
                label="Wisdom Bonus"
                type="number"
                min={0}
                max={10}
                {...register('wisdomBonus', { valueAsNumber: true })}
                error={errors.wisdomBonus?.message}
              />
              <Input
                label="Charisma Bonus"
                type="number"
                min={0}
                max={10}
                {...register('charismaBonus', { valueAsNumber: true })}
                error={errors.charismaBonus?.message}
              />
            </div>
            
            <div className="mt-4">
              <Input
                label="Armor Class Bonus"
                type="number"
                min={0}
                max={10}
                {...register('armorBonus', { valueAsNumber: true })}
                error={errors.armorBonus?.message}
              />
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <Button type="submit" size="lg" isLoading={isLoading}>
          {isEdit ? 'Update Item Template' : 'Create Item Template'}
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};