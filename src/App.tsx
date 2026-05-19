
import { ConfigProvider } from 'antd';
import { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import { useAppStore } from './app/store';
import { getThemeConfig } from './app/theme';
import { setupSupabaseErrorHandler } from './lib/supabaseErrorHandler';

function App() {
  const { theme } = useAppStore();

  // Initialize Supabase error handler once
  useEffect(() => {
    setupSupabaseErrorHandler();
  }, []);

  return (
    <ConfigProvider theme={getThemeConfig(theme)}>
      <AppRouter />
    </ConfigProvider>
  );
}

export default App
