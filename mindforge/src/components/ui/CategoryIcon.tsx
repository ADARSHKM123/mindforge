import React from 'react';
import { BookOpen, Calculator, Layers, Crosshair, Zap, MessageSquare } from 'lucide-react';
import { SkillCategory } from '../../types';
import { categoryInfo } from '../../data/games';

const iconMap: Record<SkillCategory, React.ComponentType<{ size?: number | string; color?: string; strokeWidth?: number }>> = {
  reading: BookOpen,
  math: Calculator,
  memory: Layers,
  focus: Crosshair,
  speed: Zap,
  verbal: MessageSquare,
};

interface CategoryIconProps {
  category: SkillCategory;
  size?: number;
  /** Renders inside a soft tinted square when true */
  boxed?: boolean;
  boxSize?: number;
}

export const categoryColor = (category: SkillCategory) => categoryInfo[category].cssVar;

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, size = 18, boxed = false, boxSize = 40 }) => {
  const Icon = iconMap[category];
  const color = categoryColor(category);
  if (!boxed) return <Icon size={size} color={color} strokeWidth={2} />;
  return (
    <div style={{
      width: boxSize, height: boxSize, borderRadius: 10,
      background: `color-mix(in srgb, ${color} 14%, transparent)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon size={size} color={color} strokeWidth={2} />
    </div>
  );
};

export default CategoryIcon;
