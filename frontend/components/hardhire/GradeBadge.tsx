import { Grade, gradeColorMap, gradeLabelMap } from '@/lib/mock-data';

interface GradeBadgeProps {
  grade: Grade;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

const sizeMap = {
  sm: 'text-lg w-8 h-8',
  md: 'text-2xl w-12 h-12',
  lg: 'text-5xl w-20 h-20',
  xl: 'text-[200px] w-auto h-auto',
};

export default function GradeBadge({ grade, size = 'md', showLabel = false }: GradeBadgeProps) {
  const color = gradeColorMap[grade];
  return (
    <span className="inline-flex items-center justify-center gap-2">
      <span
        className={`font-playfair font-black leading-none ${sizeMap[size]} ${size === 'xl' ? '' : 'rounded-[4px]'}`}
        style={{ color }}
      >
        {grade}
      </span>
      {showLabel && (
        <span className="font-inter text-sm font-medium" style={{ color }}>
          {gradeLabelMap[grade]}
        </span>
      )}
    </span>
  );
}
