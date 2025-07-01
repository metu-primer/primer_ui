import React from 'react';
import { Button } from 'antd';
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

        <Button
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
        </Button>
    </header>
);

export default Header;
