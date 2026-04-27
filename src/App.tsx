
import { ConfigProvider } from 'antd';
import AppRouter from './router/AppRouter';
import { useAppStore } from './app/store';
import { getThemeConfig } from './app/theme';

function App() {
 const { theme } = useAppStore();

  return (
    <ConfigProvider theme={getThemeConfig(theme)}>
      <AppRouter />
    </ConfigProvider>
  );
}

export default App
