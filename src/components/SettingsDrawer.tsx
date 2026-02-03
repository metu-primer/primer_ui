// Copyright © 2025
// Sinan Kalkan, Ahmet Kılavuz, Alperen Ovak, Ali Özçelik, Feyza Yavuz
// This file is part of the Image Search Engine project.
// Licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
// https://creativecommons.org/licenses/by-nc/4.0/

import React, { useState, useEffect } from 'react';
import { Drawer, Tooltip, Radio, Input, Select, Slider, Modal, Upload, message, Spin, Divider } from 'antd';
import { InfoCircleOutlined, UserAddOutlined, ScanOutlined, FolderOpenOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import PrimaryButton from './Buttons/PrimaryButton';
import SecondaryButton from './Buttons/SecondaryButton';
import { useTranslation } from 'react-i18next';
import { BACKEND_URL } from '../App';

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
    currentSearchUrl?: string;
}

interface ScanResult {
    success: boolean;
    scanned: number;
    matched: number;
    breakdown: Record<string, number>;
    errors: string[];
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
                                                           currentSearchUrl,
                                                       }) => {
    const { t } = useTranslation();

    // Face Recognition State
    const [knownFaces, setKnownFaces] = useState<string[]>([]);
    const [selectedFaces, setSelectedFaces] = useState<string[]>([]);
    const [scanFolder, setScanFolder] = useState('');
    const [faceThreshold, setFaceThreshold] = useState(0.4);
    const [loadingFaces, setLoadingFaces] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);

    // Register face modal state
    const [registerModalVisible, setRegisterModalVisible] = useState(false);
    const [newFaceName, setNewFaceName] = useState('');
    const [newFaceImage, setNewFaceImage] = useState<string | null>(null);
    const [registering, setRegistering] = useState(false);

    // Fetch known faces and pre-fill scan folder when drawer opens
    useEffect(() => {
        if (visible) {
            fetchKnownFaces();
            if (!scanFolder && currentSearchUrl) {
                setScanFolder(currentSearchUrl);
            }
        }
    }, [visible]);

    const fetchKnownFaces = async () => {
        setLoadingFaces(true);
        try {
            const response = await fetch(`${BACKEND_URL}/face/known-faces`);
            const data = await response.json();
            if (data.success) {
                setKnownFaces(data.faces);
            } else {
                message.error(data.error || t('face.error_loading_faces'));
            }
        } catch (error) {
            message.error(t('face.error_loading_faces'));
            console.error('Error fetching known faces:', error);
        } finally {
            setLoadingFaces(false);
        }
    };

    const handleSelectFolder = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/select-folder`);
            const data = await res.json();
            if (data.path) {
                setScanFolder(data.path);
            } else if (data.error) {
                message.warning(data.error);
            }
        } catch (error) {
            console.error('Error selecting folder:', error);
        }
    };

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setNewFaceImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        return false;
    };

    const handleRegisterFace = async () => {
        if (!newFaceName.trim()) {
            message.error(t('face.error_name_required'));
            return;
        }
        if (!newFaceImage) {
            message.error(t('face.error_image_required'));
            return;
        }

        setRegistering(true);
        try {
            const response = await fetch(`${BACKEND_URL}/face/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newFaceName.trim(),
                    imageBase64: newFaceImage,
                }),
            });
            const data = await response.json();

            if (data.success) {
                message.success(data.message || t('face.register_success'));
                setRegisterModalVisible(false);
                setNewFaceName('');
                setNewFaceImage(null);
                fetchKnownFaces();
            } else {
                message.error(data.error || t('face.register_failed'));
            }
        } catch (error) {
            message.error(t('face.register_failed'));
            console.error('Error registering face:', error);
        } finally {
            setRegistering(false);
        }
    };

    const handleDeleteFace = async (name: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/face/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            const data = await response.json();

            if (data.success) {
                message.success(data.message);
                fetchKnownFaces();
                // Remove from selection if it was selected
                setSelectedFaces(prev => prev.filter(f => f !== name));
            } else {
                message.error(data.error || t('face.delete_failed'));
            }
        } catch (error) {
            message.error(t('face.delete_failed'));
            console.error('Error deleting face:', error);
        }
    };

    const handleScanFolder = async () => {
        if (!scanFolder.trim()) {
            message.error(t('face.error_input_folder_required'));
            return;
        }
        if (selectedFaces.length === 0) {
            message.error(t('face.error_select_faces'));
            return;
        }

        setScanning(true);
        setScanResult(null);

        try {
            const response = await fetch(`${BACKEND_URL}/face/scan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    folder: scanFolder,
                    targetFaces: selectedFaces,
                    threshold: faceThreshold,
                }),
            });
            const data = await response.json();

            if (data.success) {
                setScanResult(data);
                message.success(
                    t('face.scan_complete', { scanned: data.scanned, matched: data.matched })
                );
            } else {
                message.error(data.error || t('face.scan_failed'));
            }
        } catch (error) {
            message.error(t('face.scan_failed'));
            console.error('Error scanning folder:', error);
        } finally {
            setScanning(false);
        }
    };

    return (
        <>
        <Drawer
            title={t('settings_drawer.title')}
            placement="right"
            open={visible}
            onClose={onClose}
            width={450}
        >
            <Spin spinning={scanning} tip={t('face.scanning')}>
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
                <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                    <PrimaryButton type="primary" onClick={onSaveSettings}>
                        {t('settings_drawer.save_button')}
                    </PrimaryButton>
                </div>

                <Divider>{t('face.title')}</Divider>

                {/* Face Recognition Section - NEW METADATA APPROACH */}
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#e6f7ff', borderRadius: '8px', border: '1px solid #91d5ff' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#1890ff' }}>
                        <InfoCircleOutlined style={{ marginRight: '8px' }} />
                        {t('face.metadata_info')}
                    </p>
                </div>

                {/* Section 1: Manage Known Faces */}
                <div style={faceRecognitionSectionStyle}>
                    <div style={labelStyle}>
                        <UserAddOutlined />
                        {t('face.manage_faces')}
                        <Tooltip title={t('face.manage_faces_tooltip')}>
                            <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer' }} />
                        </Tooltip>
                    </div>

                    {/* List of known faces with delete option */}
                    {knownFaces.length > 0 ? (
                        <div style={{ marginBottom: '12px' }}>
                            {knownFaces.map(face => (
                                <div key={face} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 12px',
                                    marginBottom: '4px',
                                    backgroundColor: '#fff',
                                    borderRadius: '4px',
                                    border: '1px solid #d9d9d9'
                                }}>
                                    <span>{face}</span>
                                    <DeleteOutlined
                                        style={{ color: '#ff4d4f', cursor: 'pointer' }}
                                        onClick={() => handleDeleteFace(face)}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#999', fontSize: '13px', marginBottom: '12px' }}>
                            {t('face.no_faces_registered')}
                        </p>
                    )}

                    <SecondaryButton
                        icon={<UserAddOutlined />}
                        onClick={() => setRegisterModalVisible(true)}
                        style={{ width: '100%' }}
                    >
                        {t('face.register_new')}
                    </SecondaryButton>
                </div>

                {/* Section 2: Scan Folder for Faces */}
                <div style={faceRecognitionSectionStyle}>
                    <div style={labelStyle}>
                        <ScanOutlined />
                        {t('face.scan_folder_title')}
                        <Tooltip title={t('face.scan_folder_tooltip')}>
                            <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer' }} />
                        </Tooltip>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' }}>
                            {t('face.select_faces_to_scan')}
                        </label>
                        <Select
                            mode="multiple"
                            placeholder={t('face.select_faces_placeholder')}
                            value={selectedFaces}
                            onChange={setSelectedFaces}
                            style={{ width: '100%' }}
                            loading={loadingFaces}
                            options={knownFaces.map(face => ({ label: face, value: face }))}
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' }}>
                            {t('face.folder_to_scan')}
                        </label>
                        <Input
                            placeholder={t('face.folder_path_placeholder')}
                            value={scanFolder}
                            onChange={(e) => setScanFolder(e.target.value)}
                            style={{ marginBottom: '8px' }}
                        />
                        <SecondaryButton
                            icon={<FolderOpenOutlined />}
                            onClick={handleSelectFolder}
                            style={{ width: '100%' }}
                        >
                            {t('face.browse_folder')}
                        </SecondaryButton>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '13px', color: '#666' }}>
                            {t('face.threshold')}: {faceThreshold.toFixed(2)}
                        </label>
                        <Tooltip title={t('face.threshold_tooltip')}>
                            <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '8px' }} />
                        </Tooltip>
                        <Slider
                            min={0.1}
                            max={0.9}
                            step={0.05}
                            value={faceThreshold}
                            onChange={setFaceThreshold}
                        />
                    </div>

                    <PrimaryButton
                        icon={<ScanOutlined />}
                        onClick={handleScanFolder}
                        loading={scanning}
                        style={{ width: '100%', height: '44px' }}
                    >
                        {t('face.scan_for_faces')}
                    </PrimaryButton>
                </div>

                {/* Scan Results */}
                {scanResult && (
                    <div style={{ ...faceRecognitionSectionStyle, backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
                        <h4 style={{ color: '#52c41a', marginBottom: '12px' }}>
                            {t('face.scan_results_title')}
                        </h4>
                        <p><strong>{t('face.total_scanned')}:</strong> {scanResult.scanned}</p>
                        <p><strong>{t('face.images_with_faces')}:</strong> {scanResult.matched}</p>

                        {Object.keys(scanResult.breakdown).length > 0 && (
                            <>
                                <p style={{ marginTop: '12px' }}><strong>{t('face.breakdown')}:</strong></p>
                                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                    {Object.entries(scanResult.breakdown).map(([name, count]) => (
                                        <li key={name}>{name}: {count} {t('face.images')}</li>
                                    ))}
                                </ul>
                            </>
                        )}

                        <p style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
                            {t('face.metadata_saved_info')}
                        </p>

                        {scanResult.errors.length > 0 && (
                            <p style={{ marginTop: '8px', color: '#faad14', fontSize: '12px' }}>
                                {t('face.warnings')}: {scanResult.errors.length}
                            </p>
                        )}
                    </div>
                )}
            </Spin>
        </Drawer>

        {/* Register Face Modal */}
        <Modal
            title={t('face.register_new_face')}
            open={registerModalVisible}
            onCancel={() => {
                setRegisterModalVisible(false);
                setNewFaceName('');
                setNewFaceImage(null);
            }}
            footer={[
                <SecondaryButton key="cancel" onClick={() => setRegisterModalVisible(false)}>
                    {t('face.cancel')}
                </SecondaryButton>,
                <PrimaryButton
                    key="register"
                    onClick={handleRegisterFace}
                    loading={registering}
                >
                    {t('face.register')}
                </PrimaryButton>,
            ]}
        >
            <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    {t('face.person_name')}
                </label>
                <Input
                    placeholder={t('face.enter_name')}
                    value={newFaceName}
                    onChange={(e) => setNewFaceName(e.target.value)}
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    {t('face.face_image')}
                </label>
                <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={handleImageUpload}
                >
                    <SecondaryButton icon={<UploadOutlined />}>
                        {t('face.upload_image')}
                    </SecondaryButton>
                </Upload>

                {newFaceImage && (
                    <div style={{ marginTop: '12px' }}>
                        <img
                            src={newFaceImage}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                        />
                    </div>
                )}
            </div>
        </Modal>
        </>
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

const faceRecognitionSectionStyle = {
    border: '1px solid #e8e8e8',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
    backgroundColor: '#fafafa',
};

const labelStyle = {
    fontWeight: 600,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
};

export default SettingsDrawer;
