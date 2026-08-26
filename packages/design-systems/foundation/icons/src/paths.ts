export type IconName = 'add' | 'check' | 'chevron-left' | 'chevron-right' | 'close' | 'menu';
export const iconPaths: Record<IconName, string[]> = {
  add: ['M12 5v14', 'M5 12h14'],
  check: ['m5 12 4 4L19 6'],
  'chevron-left': ['m15 18-6-6 6-6'],
  'chevron-right': ['m9 18 6-6-6-6'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16']
};
