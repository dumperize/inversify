import React from 'react';
import { withInfo } from '@storybook/addon-info';
import { addDecorator } from '@storybook/react';

import ThemeProvider from '../../app/ThemeProvider';


export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  layout: 'centered',
};

addDecorator(withInfo);

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  ),
];
