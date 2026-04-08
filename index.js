import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import App from './App';

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  document.title = 'GatorPark';
  document.querySelectorAll('link[rel="icon"],link[rel="shortcut icon"]').forEach((el) => {
    el.remove();
  });
  const iconLink = document.createElement('link');
  iconLink.setAttribute('rel', 'icon');
  iconLink.setAttribute('type', 'image/svg+xml');
  iconLink.setAttribute('href', '/favicon.svg');
  document.head.appendChild(iconLink);
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
