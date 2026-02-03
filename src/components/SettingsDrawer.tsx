// Copyright © 2025
// Sinan Kalkan, Ahmet Kılavuz, Alperen Ovak, Ali Özçelik, Feyza Yavuz
// This file is part of the Image Search Engine project.
// Licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
// https://creativecommons.org/licenses/by-nc/4.0/

import React from 'react';
import { Drawer, Tooltip, Radio, Input } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import PrimaryButton from './Buttons/PrimaryButton';
import { useTranslation } from 'react-i18next';

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
                                                       }) => {
    const { t } = useTranslation();

    return (
        <Drawer
            title={t('settings_drawer.title')}
            placement="right"
            // AntD v5 uses `open` instead of `visible`; keep prop name for callers but map here
            open={visible}
            onClose={onClose}
            width={400}
        >
            {/* Select Index */}
            <div style={sectionStyle}>
                <Tooltip title={t('settings_drawer.select_index.tooltip')}>
                    <InfoCircleOutlined style={infoIconStyle} />
                </Tooltip>
                <h3>{t('settings_drawer.select_index.title')}</h3>
                <Radio.Group onChange={onIndexChange} value={tempSettings.selectedIndex}>
                    <Radio value="IndexIVFPQ">{t('settings_drawer.select_index.options.IndexIVFPQ')}</Radio>
                    <Radio value="IndexFlatL2">{t('settings_drawer.select_index.options.IndexFlatL2')}</Radio>
                    <Radio value="IndexIVFFlat">{t('settings_drawer.select_index.options.IndexIVFFlat')}</Radio>
                </Radio.Group>
            </div>

            {/* Select Device */}
            <div style={sectionStyle}>
                <Tooltip title={t('settings_drawer.select_device.tooltip')}>
                    <InfoCircleOutlined style={infoIconStyle} />
                </Tooltip>
                <h3>{t('settings_drawer.select_device.title')}</h3>
                <Radio.Group onChange={onDeviceChange} value={tempSettings.selectedDevice}>
                    <Radio value="cpu">{t('settings_drawer.select_device.options.cpu')}</Radio>
                    <Radio value="gpu">{t('settings_drawer.select_device.options.gpu')}</Radio>
                </Radio.Group>
            </div>

            {/* Download Folder Name */}
            <div style={sectionStyle}>
                <Tooltip title={t('settings_drawer.folder_name.tooltip')}>
                    <InfoCircleOutlined style={infoIconStyle} />
                </Tooltip>
                <h3>{t('settings_drawer.folder_name.title')}</h3>
                <Input
                    placeholder={t('settings_drawer.folder_name.placeholder')}
                    value={tempSettings.folderName}
                    onChange={onFolderNameChange}
                    style={{ width: '100%' }}
                />
            </div>

            {/* Save Settings */}
            <div style={{ marginTop: '20px' }}>
                <PrimaryButton type="primary" onClick={onSaveSettings}>
                    {t('settings_drawer.save_button')}
                </PrimaryButton>
            </div>
        </Drawer>
    );
};

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
