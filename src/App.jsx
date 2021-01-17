import React from 'react';
import Router from './Router';
import './assets/reset.css';
import './assets/style.css';
import { Header } from './components/Header';

const App = () => {
    return (
        <React.Fragment>
            <Header />
            <main className="c-main">
                <Router />
            </main>
        </React.Fragment>
    )
}

export default App