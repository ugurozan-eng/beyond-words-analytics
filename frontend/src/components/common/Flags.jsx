import React from 'react';

export const TurkeyFlag = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" className={className}>
        <path fill="#E30A17" d="M0 0h1200v800H0z" />
        <circle cx="444" cy="400" r="200" fill="#fff" />
        <circle cx="477" cy="400" r="160" fill="#E30A17" />
        <path fill="#fff" d="M583.334 400l18.379 56.574h59.488l-48.125 34.972 18.379 56.574-48.121-34.972-48.121 34.972 18.379-56.574-48.125-34.972h59.488z" />
    </svg>
);

export const UKFlag = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className={className}>
        <clipPath id="s">
            <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <clipPath id="t">
            <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <g clipPath="url(#s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
        </g>
    </svg>
);
