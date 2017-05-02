 
// import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux';
import Game from './components/Game/voiceGame.js'
render(
	<Game/>,
	document.getElementById('root')
	);
