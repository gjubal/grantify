import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AuthenticationProvider } from './authentication';
import { ToastProvider } from './toast';

const queryClient = new QueryClient();

const AppProvider: React.FC = ({ children }) => {
  return (
    <AuthenticationProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    </AuthenticationProvider>
  );
};

export default AppProvider;
