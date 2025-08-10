// Copyright © 2025
// Sinan Kalkan, Ahmet Kılavuz, Alperen Ovak, Ali Özçelik, Feyza Yavuz
// This file is part of the Image Search Engine project.
// Licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
// https://creativecommons.org/licenses/by-nc/4.0/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Button, message } from 'antd';
import PrimaryButton from './components/PrimaryButton';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { RadioChangeEvent } from 'antd/es/radio';
import trFlag from './assets/turkey.png';
import gbFlag from './assets/united-kingdom.png';
// i18n
import './i18n'; // ensure i18n is initialized once in the app
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

import Header from './components/Header';
import HowToUseDrawer from './components/HowToUseDrawer';
import SearchBar from './components/SearchBar';
import ImagesDisplay from './components/ImagesDisplay';
import SettingsDrawer from './components/SettingsDrawer';
import HomePageSettings from './components/HomePageSettings';

const showBackendError = (
    err: unknown,
    fallback = i18n.t('msg_unexpected_error')
) => {
  if (axios.isAxiosError(err)) {
    const specific =
            (err.response?.data as any)?.error ||
            (err.response?.data as any)?.message ||
      err.message;

    message.error(specific || fallback, 4);
    return;
  }
  if (err instanceof Error) {
    message.error(err.message || fallback, 4);
    return;
  }
  message.error(fallback, 4);
};

const LOCAL_STORAGE_KEY = 'savedUrls';
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;

  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<string | null>('IndexFlatL2');
  const [url, setUrl] = useState('');
  const [savedUrls, setSavedUrls] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<{ name: string; data: string }[]>([]);
  const [showImages, setShowImages] = useState(false);
  const [k, setk] = useState<number | null>(1);
  const [loading, setLoading] = useState(false);
  const [showHowtoUse, setShowHowtoUse] = useState(false);
  const [threshold, setThreshold] = useState<number | null>(0);
  const [suggestedQuery, setSuggestedQuery] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState('cpu');
  const [openModal, setOpenModal] = useState(false);

  const [tempSettings, setTempSettings] = useState({
    selectedIndex: selectedIndex,
    url: url,
    k: k,
    threshold: threshold,
    selectedDevice: selectedDevice,
    savedUrls: savedUrls,
    folderName: 'images',
  });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/settings`);
                if (!response.ok) throw new Error(t('msg_failed_fetch_settings'));
                const data = await response.json();

                if (data.warnings && data.warnings.length > 0) {
                    console.warn('Backend warnings:', data.warnings);
                    throw new Error(`${t('msg_backend_issues_prefix')}${data.warnings.join(', ')}`);
                }

                setTempSettings((prev) => ({
                    ...prev,
                    k: data.k || 1,
                    selectedIndex: data.selectedIndex || null,
                    url: data.url || '',
                    threshold: data.threshold || 0,
                    selectedDevice: data.selectedDevice || '',
                }));
                setUrl(data.url);
                setSavedUrls(Array.isArray(data.recent_paths) ? data.recent_paths : []);
                setk(data.k || 1);
                setSelectedIndex(data.selectedIndex || null);
                setThreshold(data.threshold || 0);
                setSelectedDevice(data.selectedDevice || '');
            } catch (error) {
                console.error(error);
                showBackendError(error, t('msg_failed_load_settings'));
            }
        };

        fetchSettings();

    }, []);

    const getMissingFields = () => {
        const missingFields: string[] = [];
        if (!query) missingFields.push(t('missing_field.query'));
        if (!selectedIndex) missingFields.push(t('missing_field.index_selection'));
        if (!url) missingFields.push(t('missing_field.url'));
        if (threshold === null || threshold === undefined) missingFields.push(t('missing_field.threshold'));
        return missingFields;
    };

    const isSearchDisabled = getMissingFields().length > 0;

    const handleSearch = async (newQuery?: string) => {
        const requestData = {
            query: newQuery,
            selectedIndex: selectedIndex,
            url: [url].concat(savedUrls.slice(0, 2)),
            threshold: threshold,
            selectedDevice: selectedDevice,
            k: k,
        };

        setSavedUrls(requestData.url);
        setLoading(true);
        setSuggestedQuery(null);
        try {
            const response = await axios.post(`${BACKEND_URL}/predict`, requestData);
            const data = response.data;

            if (data.warnings && data.warnings.length > 0) {
                console.warn("Backend warnings:", data.warnings);
                throw new Error("Some issues occurred: " + data.warnings.join(", "));
            }

            const images = response.data.images.map((image: { name: string; data: string }) => ({
                name: image.name,
                data: `data:image/jpeg;base64,${image.data}`,
            }));

            setImageUrls(images);
            setShowImages(true);

            if (newQuery !== response.data.query) {
                setSuggestedQuery(response.data.query);
            }
            message.success(t('msg_images_fetched'));
        } catch (error) {
            console.error(error);
            showBackendError(error, t('msg_failed_fetch_images'));
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadZip = async () => {
        const zip = new JSZip();
        imageUrls.forEach((image) => {
            const imgData = image.data.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
            zip.file(image.name, imgData, { base64: true });
        });
        const content = await zip.generateAsync({ type: 'blob' });
        const folderName = tempSettings.folderName || 'images';
        saveAs(content, `${folderName}.zip`);
    };

  const handleSaveSettings = async () => {
    setSelectedIndex(tempSettings.selectedIndex);
    setUrl(tempSettings.url);
    setk(tempSettings.k);
    setThreshold(tempSettings.threshold);
    setSelectedDevice(tempSettings.selectedDevice);

    const settings = {
      k: tempSettings.k,
      selectedIndex: tempSettings.selectedIndex,
      url: tempSettings.url,
      threshold: tempSettings.threshold,
      selectedDevice: tempSettings.selectedDevice,
      savedUrls: tempSettings.savedUrls,
    };

        try {
            const response = await fetch(`${BACKEND_URL}/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            if (!response.ok) throw new Error(t('msg_error_saving_settings'));

            const result = await response.json();

            if (result.warnings && result.warnings.length > 0) {
                console.warn('Backend warnings:', result.warnings);
                throw new Error(`${t('msg_backend_issues_prefix')}${result.warnings.join(', ')}`);
            }

            setModalVisible(false);
            message.success(result.message || t('msg_settings_saved'));
        } catch (error) {
            console.error(error);
            showBackendError(error, t('msg_error_saving_settings'));
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f5f5f5',
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/white-wall-3.png")',
                backgroundRepeat: 'repeat',
                backgroundAttachment: 'fixed',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 16,
                    right: "12%",
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    zIndex: 1000,
                    border: '1px solid #1890ff',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                }}
            >
                <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{t('language_label')}:</span>

                <Button
                    onClick={() => i18n.changeLanguage('tr')}
                    style={{
                        padding: 0,
                        width: 40,
                        height: 30,
                        borderRadius: '6px',
                        backgroundColor: currentLang === 'tr' ? '#e6f7ff' : 'transparent',
                        border: currentLang === 'tr' ? '2px solid #1890ff' : '1px solid #d9d9d9'
                    }}
                >
                    <img
                        src={trFlag}
                        alt="Turkish"
                        style={{ width: '100%', height: '100%', borderRadius: '6px', objectFit: 'cover' }}
                    />
                </Button>

                <Button
                    onClick={() => i18n.changeLanguage('en')}
                    style={{
                        padding: 0,
                        width: 40,
                        height: 30,
                        borderRadius: '6px',
                        backgroundColor: currentLang === 'en' ? '#e6f7ff' : 'transparent',
                        border: currentLang === 'en' ? '2px solid #1890ff' : '1px solid #d9d9d9'
                    }}
                >
                    <img
                        src={gbFlag}
                        alt="English"
                        style={{ width: '100%', height: '100%', borderRadius: '6px', objectFit: 'cover' }}
                    />
                </Button>
            </div>



            <PrimaryButton
                type="link"
                icon={<QuestionCircleOutlined />}
                onClick={() => setShowHowtoUse(!showHowtoUse)}
                style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    zIndex: 1000,
                }}
            >
                {t('how_to_use')}
            </PrimaryButton>

            <Header
                onSettingsClick={() => {
                    setTempSettings({
                        selectedIndex: selectedIndex,
                        url: url,
                        k: k,
                        threshold: threshold,
                        selectedDevice: selectedDevice,
                        savedUrls: savedUrls,
                        folderName: tempSettings.folderName,
                    });
                    setModalVisible(true);
                }}
            />

            <HowToUseDrawer visible={showHowtoUse} onClose={() => setShowHowtoUse(false)} />

            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '40px 20px',
                }}
            >
                <HomePageSettings
                    url={url}
                    setUrl={setUrl}
                    savedUrls={savedUrls}
                    k={k}
                    setk={setk}
                    threshold={threshold}
                    setThreshold={setThreshold}
                />

                <SearchBar
                    query={query}
                    onQueryChange={(e) => setQuery(e.target.value)}
                    onSearch={() => handleSearch(query)}
                    loading={loading}
                    disabled={isSearchDisabled}
                    suggestedQuery={suggestedQuery}
                    onSuggestedQueryClick={(sq) => {
                        setQuery(sq);
                        handleSearch(sq);
                        setSuggestedQuery(null);
                    }}
                    tooltipText={
                        isSearchDisabled
                            ? t('tooltip_fill_in', { fields: getMissingFields().join(', ') })
                            : t('tooltip_ready')
                    }
                />

                {imageUrls.length > 0 && (
                    <ImagesDisplay
                        images={imageUrls}
                        showImages={showImages}
                        setShowImages={setShowImages}
                        onDownloadZip={handleDownloadZip}
                        k={k}
                    />
                )}
            </div>

            <SettingsDrawer
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                tempSettings={tempSettings}
                onIndexChange={(e: RadioChangeEvent) =>
                    setTempSettings((prev) => ({ ...prev, selectedIndex: e.target.value }))
                }
                onUrlChange={(e) => setTempSettings((prev) => ({ ...prev, url: e.target.value }))}
                onFolderSelect={(e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files && files.length > 0) {
                        const folderPath = (files[0] as any).webkitRelativePath.split('/')[0];
                        setUrl(folderPath);
                        setTempSettings((prev) => ({ ...prev, url: folderPath }));
                    }
                }}
                onThresholdChange={(value) => setTempSettings((prev) => ({ ...prev, threshold: value }))}
                onKChange={(value) => setTempSettings((prev) => ({ ...prev, k: value }))}
                onDeviceChange={(e: RadioChangeEvent) =>
                    setTempSettings((prev) => ({ ...prev, selectedDevice: e.target.value }))
                }
                onFolderNameChange={(e) => setTempSettings((prev) => ({ ...prev, folderName: e.target.value }))}
                onSaveSettings={handleSaveSettings}
                savedUrls={savedUrls}
            />

            <footer
                style={{
                    textAlign: 'center',
                    padding: '20px',
                    fontSize: '14px',
                    color: '#888',
                    borderTop: '1px solid #eee',
                    marginBottom: '5px',
                }}
            >
                {t('footer_copyright')}
            </footer>
        </div>
    );
}

export default App;
