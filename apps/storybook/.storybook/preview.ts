import type { Preview } from '@storybook/react-vite';
import '@kimgseok/design-tokens/css';

const preview: Preview = {
  parameters: {
    a11y: { test: 'error' },
    controls: { expanded: true },
    backgrounds: { default: 'light' },
    layout: 'centered'
  }
};

export default preview;
