import Svg, { Path } from 'react-native-svg';
import { iconPaths, type IconName } from './paths';
export type { IconName } from './paths';

export interface NativeIconProps { name: IconName; size?: 16 | 20 | 24; color: string; label?: string; }
export function NativeIcon({ name, size = 20, color, label }: NativeIconProps) {
  return <Svg accessibilityLabel={label} accessibilityRole={label ? 'image' : undefined} accessible={Boolean(label)} fill="none" height={size} viewBox="0 0 24 24" width={size}>{iconPaths[name].map((path) => <Path d={path} key={path} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />)}</Svg>;
}
