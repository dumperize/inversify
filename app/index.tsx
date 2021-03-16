import React from 'react';
import ReactDOM from 'react-dom';

import AppRoot from './AppRoot';


const mountNode = document.getElementById('app');

if (mountNode) {
  // Отключение Google Translate плагина для страницы.
  // Плагин при работе манипулирует DOM деревом, что конфликтует с работой react.
  mountNode.setAttribute('notranslate', 'true');
  mountNode.setAttribute('class', 'notranslate');
}

ReactDOM.render(
  <AppRoot />,
  mountNode,
);
