import { iconPaths, type IconName } from './paths';
export type { IconName } from './paths';

export interface IconProps { name: IconName; size?: 16 | 20 | 24; color?: string; label?: string; }
export function Icon({ name, size = 20, color = 'currentColor', label }: IconProps) {
  return <svg aria-hidden={label ? undefined : true} aria-label={label} fill="none" height={size} role={label ? 'img' : undefined} viewBox="0 0 24 24" width={size}>{iconPaths[name].map((path) => <path d={path} key={path} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />)}</svg>;
}
