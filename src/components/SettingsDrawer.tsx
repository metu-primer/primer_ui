// Copyright © 2025
// Sinan Kalkan, Ahmet Kılavuz, Alperen Ovak, Ali Özçelik, Feyza Yavuz
// This file is part of the Image Search Engine project.
// Licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
// https://creativecommons.org/licenses/by-nc/4.0/

import React from 'react';
import { Drawer, Tooltip, Radio, InputNumber, Input, Slider } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import PrimaryButton from './PrimaryButton';


interface SettingsDrawerProps {
    visible: boolean;
    onClose: () => void;
    tempSettings: {
        selectedIndex: string | null;
        url: string;
        k: number | null;
        threshold: number | null;
        selectedDevice: string;
        folderName?: string;
    };
    onIndexChange: (e: any) => void;
    onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFolderSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onThresholdChange: (value: number) => void;
    onKChange: (value: number) => void;
    onDeviceChange: (e: any) => void;
    onFolderNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSaveSettings: () => void;
    savedUrls: string[];
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
    visible,
    onClose,
    tempSettings,
    onIndexChange,
    onUrlChange,
    onFolderSelect,
    onThresholdChange,
    onKChange,
    onDeviceChange,
    onFolderNameChange,
    onSaveSettings,
    savedUrls,
}) => (
    <Drawer
        title="Settings"
        placement="right"
        visible={visible}
        onClose={onClose}
        width={400}
    >
        {/* Select Index */}
        <div style={sectionStyle}>
            <Tooltip title="Select the indexing type for your search.">
                <InfoCircleOutlined style={infoIconStyle} />
            </Tooltip>
            <h3>Select Index</h3>
            <Radio.Group onChange={onIndexChange} value={tempSettings.selectedIndex}>
                <Radio value="IndexIVFPQ">IndexIVFPQ</Radio>
                <Radio value="IndexFlatL2">IndexFlatL2</Radio>
                <Radio value="IndexIVFFlat">IndexIVFFlat</Radio>
            </Radio.Group>
        </div>

        {/* Select Device */}
        <div style={sectionStyle}>
            <Tooltip title="Choose between CPU or GPU for processing.">
                <InfoCircleOutlined style={infoIconStyle} />
            </Tooltip>
            <h3>Select Device</h3>
            <Radio.Group
                onChange={onDeviceChange}
                value={tempSettings.selectedDevice}
            >
                <Radio value="cpu">CPU</Radio>
                <Radio value="gpu">GPU</Radio>
            </Radio.Group>
        </div>

        {/* Download Folder Name */}
        <div style={sectionStyle}>
            <Tooltip title="Enter the name of the folder you will download.">
                <InfoCircleOutlined style={infoIconStyle} />
            </Tooltip>
            <h3>Download Folder Name</h3>
            <Input
                placeholder="Enter folder name"
                value={tempSettings.folderName}
                onChange={onFolderNameChange}
                style={{ width: '100%' }}
            />
        </div>

        {/* Save Settings */}
        <div style={{ marginTop: '20px' }}>
            <PrimaryButton type="primary" onClick={onSaveSettings}>
                Save Settings
            </PrimaryButton>
        </div>
    </Drawer>
);

const sectionStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '16px',
    position: 'relative' as const,
};

const infoIconStyle = {
    position: 'absolute' as const,
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    color: '#1890ff',
    fontSize: '16px',
};

export default SettingsDrawer;
