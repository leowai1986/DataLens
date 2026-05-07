import { setupServer } from 'msw/node';
import { handlers } from '@features/data-explorer/api/handlers';

export const server = setupServer(...handlers);
