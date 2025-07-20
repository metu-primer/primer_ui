// Copyright © 2025
// Sinan Kalkan, Ahmet Kılavuz, Alperen Ovak, Ali Özçelik, Feyza Yavuz
// This file is part of the Image Search Engine project.
// Licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
// https://creativecommons.org/licenses/by-nc/4.0/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {  message, Spin } from 'antd';
import PrimaryButton from './components/PrimaryButton';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { RadioChangeEvent } from 'antd/es/radio';

import Header from './components/Header';
import HowToUseDrawer from './components/HowToUseDrawer';
import SearchBar from './components/SearchBar';
import ImagesDisplay from './components/ImagesDisplay';
import SettingsDrawer from './components/SettingsDrawer';


const showBackendError = (
  err: unknown,
  fallback = "An unexpected error occurred."
) => {
  if (axios.isAxiosError(err)) {
    const specific =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message;

    message.error(specific || fallback, 4);  
    return;
  }

  message.error(fallback, 4);
};


const LOCAL_STORAGE_KEY = 'savedUrls';
export const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL;

function App() {
    const [query, setQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
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
                if (!response.ok) throw new Error('Failed to fetch settings');
                const data = await response.json();

                setTempSettings(prev => ({
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
                showBackendError(error, "Failed to load saved settings."); 
            }
        };

        fetchSettings();
    }, []);

    // In App component:

    const getMissingFields = () => {
        const missingFields: string[] = [];
        if (!query) missingFields.push("query");
        if (!selectedIndex) missingFields.push("index selection");
        if (!url) missingFields.push("URL");
        if (threshold === null || threshold === undefined) missingFields.push("threshold");
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
            k: k
        };
        

        setLoading(true);
        setSuggestedQuery(null);
        try {
            const response = await axios.post(`${BACKEND_URL}/predict`, requestData);
            const images = response.data.images.map((image: { name: string; data: string }) => ({
                name: image.name,
                data: `data:image/jpeg;base64,${image.data}`
            }));
            setImageUrls(images);
            setShowImages(true);
            if (newQuery !== response.data.query) {
                setSuggestedQuery(response.data.query);
            }
            message.success("Images fetched successfully!");
        } catch (error) {
            console.error(error);
            showBackendError(error, "Failed to fetch images.");   
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
        
        const updatedSavedUrls = Array.isArray(savedUrls) ? [...savedUrls] : [];
        if (tempSettings.url && !updatedSavedUrls.includes(tempSettings.url)) {
            updatedSavedUrls.unshift(tempSettings.url);
            if (updatedSavedUrls.length > 3) {
                updatedSavedUrls.pop();
            }
            setSavedUrls(updatedSavedUrls);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSavedUrls));
        }
        
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

            if (!response.ok) throw new Error('Failed to save settings');

            const result = await response.json();
            setModalVisible(false);
            message.success(result.message || "Settings saved successfully!");
        } catch (error) {
            console.error(error);
            showBackendError(error, "Error saving settings.");     
        }
    };

    return (
        

        <div style={{ height: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            backgroundColor: '#f5f5f5',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/white-wall-3.png")',
            backgroundRepeat: 'repeat'  }}>
            
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
                How to Use
            </PrimaryButton>

            <Header onSettingsClick={() => {
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
            }} />

            <HowToUseDrawer
                visible={showHowtoUse}
                onClose={() => setShowHowtoUse(false)}
            />

            
        <div style={{
            flex: 1,  
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',  
            padding: '40px 20px'
        }}>
           <SearchBar
                query={query}
                onQueryChange={(e) => setQuery(e.target.value)}
                onSearch={() => handleSearch(query)}
                loading={loading}
                disabled={isSearchDisabled}
                suggestedQuery={suggestedQuery}
                onSuggestedQueryClick={(suggestedQuery) => {
                    setQuery(suggestedQuery);
                    handleSearch(suggestedQuery);
                    setSuggestedQuery(null);
                }}
                tooltipText={
                    isSearchDisabled
                        ? `Please fill in: ${getMissingFields().join(", ")}`
                        : "Ready to search"
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
                onIndexChange={(e: RadioChangeEvent) => setTempSettings(prev => ({ ...prev, selectedIndex: e.target.value }))}
                onUrlChange={(e) => setTempSettings(prev => ({ ...prev, url: e.target.value }))}
                onFolderSelect={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                        const folderPath = files[0].webkitRelativePath.split('/')[0];
                        setUrl(folderPath);
                        setTempSettings(prev => ({ ...prev, url: folderPath }));
                    }
                }}
                onThresholdChange={(value) => setTempSettings(prev => ({ ...prev, threshold: value }))}
                onKChange={(value) => setTempSettings(prev => ({ ...prev, k: value }))}
                onDeviceChange={(e: RadioChangeEvent) => setTempSettings(prev => ({ ...prev, selectedDevice: e.target.value }))}
                onFolderNameChange={(e) => setTempSettings(prev => ({ ...prev, folderName: e.target.value }))}
                onSaveSettings={handleSaveSettings}
                savedUrls={savedUrls}
            />
            <footer style={{
                textAlign: 'center',
                padding: '20px',
                fontSize: '14px',
                color: '#888',
                borderTop: '1px solid #eee',
                marginBottom: '5px'
            }}>
                © 2025 Orta Doğu Teknik Üniversitesi
            </footer>
        </div>
    );
}

export default App;
