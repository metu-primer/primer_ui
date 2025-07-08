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
