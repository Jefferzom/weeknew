import React from 'react';

export default function Header({ children }){ // sempre usar destruturaçao {}
    return (
        <header>
            <h1>{children}</h1>
        </header>
    );
}