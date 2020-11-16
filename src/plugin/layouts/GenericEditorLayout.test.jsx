import React from 'react';
import { render, screen } from '@testing-library/react';

import GenericEditorLayout from './GenericEditorLayout';

test('renders learn react link', async () => {
  render(<GenericEditorLayout getComponent={() => () => ''} />);
  const linkElement = screen.getByText(/TopBar/i);
  expect(linkElement).toBeInTheDocument();
});
