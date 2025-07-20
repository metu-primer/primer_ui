// Copyright © 2025
// Sinan Kalkan, Ahmet Kılavuz, Alperen Ovak, Ali Özçelik, Feyza Yavuz
// This file is part of the Image Search Engine project.
// Licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
// https://creativecommons.org/licenses/by-nc/4.0/

import React from 'react';
import PrimaryButton from './PrimaryButton';

import { SettingOutlined } from '@ant-design/icons';
import logo from '../assets/ceng-logo.png';

interface HeaderProps {
    onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => (
    <header style={{
        padding: '16px 32px',
        textAlign: 'center',
        position: 'relative'
    }}>
        <div style={{
            display: 'inline-flex', 
            alignItems: 'center',
        }}>
            <img
                src={logo}
                alt="Logo"
                style={{ height: '50px', marginRight: '16px' }}
            />
            <h1 style={{ margin: 0 }}>
                Image Search with Text Prompt
            </h1>
        </div>

        <p style={{
            fontSize: '16px',
            color: '#555',
            margin: '8px 0 0 0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center'
        }}>
            Configure your settings, enter a query, and start your image search!
        </p>

        <PrimaryButton 
            type="link"
            icon={<SettingOutlined />}
            onClick={onSettingsClick}
            style={{
                position: 'absolute',
                top: '16px',
                right: '32px'
            }}
        >
            Settings
        </PrimaryButton >
    </header>
);

export default Header;
