import { Circle, Flame, Mountain, Droplet, Zap, Skull } from 'lucide-react';

/** @type {{ [key: string]: any }} */
const drakeIconMap = {
  infernal: Flame,
  mountain: Mountain,
  ocean: Droplet,
  cloud: Circle,
  hextech: Zap,
  chemtech: Skull,
};

/**
 * @typedef {Object} ObjectiveIconsProps
 * @property {string} label
 * @property {number=} leftCount
 * @property {number=} rightCount
 * @property {string[]=} leftIcons
 * @property {string[]=} rightIcons
 */

/**
 * @param {ObjectiveIconsProps} props
 */
export default function ObjectiveIcons({ label, leftCount, rightCount, leftIcons, rightIcons }) {
  /**
   * @param {string[]|undefined} icons
   * @param {number|undefined} count
   * @param {boolean} isLeft
   * @returns {import('react').ReactNode}
   */
  const renderIcons = (icons, count, isLeft) => {
    const color = isLeft ? 'var(--dashboard-blue)' : 'var(--dashboard-yellow)';
    
    if (icons) {
      return icons.map((iconName, index) => {
        const IconComponent = drakeIconMap[iconName] || Circle;
        return (
          <IconComponent
            key={index}
            size={20}
            style={{ color }}
            fill={color}
          />
        );
      });
    }
    
    if (count !== undefined) {
      return Array.from({ length: count }).map((_, index) => (
        <Circle
          key={index}
          size={20}
          style={{ color }}
          fill={color}
        />
      ));
    }
    
    return null;
  };

  return (
    <div className="mb-4">
      <div 
        className="mb-2"
        style={{
          color: 'var(--dashboard-text-secondary)',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {renderIcons(leftIcons, leftCount, true)}
        </div>
        <div className="flex gap-2">
          {renderIcons(rightIcons, rightCount, false)}
        </div>
      </div>
    </div>
  );
}
