// Copyright © 2025
// Sinan Kalkan, Ahmet Kılavuz, Alperen Ovak, Ali Özçelik, Feyza Yavuz
// This file is part of the Image Search Engine project.
// Licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
// https://creativecommons.org/licenses/by-nc/4.0/

import React from 'react';
import { Button, ButtonProps } from 'antd';

const PrimaryButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button
      {...props}
      style={{
        backgroundColor: '#ffffff',      
        borderColor: '#1890ff',         
        color: '#1890ff',               
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 500,
        height: '40px',
        padding: '0 20px',
        alignContent: 'center',
        ...props.style,                  
      }}
      className={`custom-button ${props.className ?? ''}`}
    />
  );
};

export default PrimaryButton;
