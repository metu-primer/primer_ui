import React, { useState, useEffect } from 'react';
import { Tooltip, Input, Radio, InputNumber, Slider, Select, Tag, message } from 'antd';
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { BACKEND_URL } from '../App';
import SecondaryButton from './Buttons/SecondaryButton';

interface HomePageSettingsProps {
  url: string;
  setUrl: (url: string) => void;
  savedUrls: string[];
  k: number | null;
  setk: (value: number) => void;
  threshold: number | null;
  setThreshold: (value: number) => void;
  faceFilter: string[];
  setFaceFilter: (faces: string[]) => void;
  refreshTrigger?: number;
}

const sectionStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  borderRadius: '6px',
  width: '23%',
  minWidth: '180px',
  position: 'relative' as const,
};

const infoIconStyle = {
  position: 'absolute' as const,
  top: '8px',
  right: '8px',
  cursor: 'pointer',
  color: '#1890ff',
  fontSize: '14px',
};

const HomePageSettings: React.FC<HomePageSettingsProps> = ({
  url,
  setUrl,
  savedUrls,
  k,
  setk,
  threshold,
  setThreshold,
  faceFilter,
  setFaceFilter,
  refreshTrigger
}) => {
    const { t } = useTranslation();
    const [availableFaces, setAvailableFaces] = useState<string[]>([]);
    const [hasMetadata, setHasMetadata] = useState(false);
    const [loadingFaces, setLoadingFaces] = useState(false);

    // Fetch available faces when URL changes
    useEffect(() => {
        console.log('[FACE FILTER DEBUG] useEffect triggered - url:', url, 'refreshTrigger:', refreshTrigger);
        if (url) {
            fetchFaceMetadata(url);
        } else {
            console.log('[FACE FILTER DEBUG] No URL set, clearing face data');
            setAvailableFaces([]);
            setHasMetadata(false);
        }
    }, [url, refreshTrigger]);

    const fetchFaceMetadata = async (folder: string) => {
        console.log('[FACE FILTER DEBUG] Fetching metadata for folder:', folder);
        setLoadingFaces(true);
        try {
            const response = await fetch(`${BACKEND_URL}/face/metadata?folder=${encodeURIComponent(folder)}`);
            const data = await response.json();
            console.log('[FACE FILTER DEBUG] Metadata response:', data);

            if (data.success) {
                setHasMetadata(data.hasMetadata);
                setAvailableFaces(data.faces || []);
                console.log('[FACE FILTER DEBUG] Has metadata:', data.hasMetadata, 'Faces:', data.faces);

                // Clear filter if selected faces are no longer available
                if (data.hasMetadata && faceFilter.length > 0) {
                    const validFaces = faceFilter.filter(f => data.faces.includes(f));
                    if (validFaces.length !== faceFilter.length) {
                        setFaceFilter(validFaces);
                    }
                }
            } else {
                setHasMetadata(false);
                setAvailableFaces([]);
                console.log('[FACE FILTER DEBUG] No metadata or failed');
            }
        } catch (error) {
            console.error('[FACE FILTER DEBUG] Error fetching face metadata:', error);
            setHasMetadata(false);
            setAvailableFaces([]);
        } finally {
            setLoadingFaces(false);
        }
    };

    const handleSelectFolder = async () => {
      const res = await fetch(`${BACKEND_URL}/select-folder`);
      const data = await res.json();
      if (data.path) {
        setUrl(data.path);
      } else {
        console.log("No folder selected");
      }
    };

    return (
    <div style={{ width: '100%', marginTop: '8px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>

        {/* Number of Images */}
        <div style={sectionStyle}>
            <Tooltip title={t('home_page_settings.tooltip_number_images')}>
            <InfoCircleOutlined style={infoIconStyle} />
          </Tooltip>
            <h4>{t('home_page_settings.number_images')}</h4>
          <InputNumber
            min={1}
            value={k || 1}
            onChange={(value) => setk(value ?? 1)}
            style={{ width: '100%' }}
            size="small"
          />
        </div>

        {/* URL Selection */}
        <div style={sectionStyle}>
          <Tooltip title={t('home_page_settings.tooltip_url')}>
            <InfoCircleOutlined style={infoIconStyle} />
          </Tooltip>
          <h4>{t('home_page_settings.url')}</h4>
          <Input
            placeholder={t('home_page_settings.url_manuel')}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: '100%', marginBottom: 4 }}
            size="small"
          />

          <Select
            value={url}
            onChange={(value) => setUrl(value)}
            placeholder="Select a saved URL"
            style={{ width: '100%' }}
          >
            {savedUrls.map((savedUrl, index) => (
              <Select.Option key={index} value={savedUrl}>
                {savedUrl}
              </Select.Option>
            ))}
          </Select>

          <input
            id="folderInput"
            type="file"
            {...({ webkitdirectory: true } as React.InputHTMLAttributes<HTMLInputElement>)}
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                const folderPath = files[0].webkitRelativePath.split('/')[0];
                setUrl(folderPath);
              }
            }}
            style={{ display: 'none' }}
          />

          <SecondaryButton
            onClick={handleSelectFolder}
            style={{ width: '100%', marginTop: '8px'}}
          >
            Select Folder
          </SecondaryButton>
        </div>

        {/* Threshold */}
        <div style={sectionStyle}>
          <Tooltip title={t('home_page_settings.tooltip_threshold')}>
            <InfoCircleOutlined style={infoIconStyle} />
          </Tooltip>
          <h4>{t('home_page_settings.threshold')}: <span style={{ fontWeight: 'normal' }}>{threshold}</span></h4>
          <Slider
            min={-1}
            max={1}
            step={0.01}
            value={typeof threshold === 'number' ? threshold : 0}
            onChange={setThreshold}
            style={{ width: '100%' }}
          />
        </div>

        {/* Face Filter */}
        <div style={sectionStyle}>
          <Tooltip title={t('home_page_settings.tooltip_face_filter')}>
            <InfoCircleOutlined style={infoIconStyle} />
          </Tooltip>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <UserOutlined />
            {t('home_page_settings.face_filter')}
          </h4>

          {hasMetadata ? (
            <>
              <Select
                mode="multiple"
                placeholder={t('home_page_settings.select_faces')}
                value={faceFilter}
                onChange={setFaceFilter}
                style={{ width: '100%' }}
                loading={loadingFaces}
                size="small"
                maxTagCount={2}
                options={availableFaces.map(face => ({ label: face, value: face }))}
              />
              {faceFilter.length > 0 && (
                <div style={{ marginTop: '4px', fontSize: '11px', color: '#52c41a' }}>
                  {t('home_page_settings.filtering_by_faces', { count: faceFilter.length })}
                </div>
              )}
            </>
          ) : (
            <div style={{ fontSize: '12px', color: '#999' }}>
              {url ? (
                <span>{t('home_page_settings.no_face_metadata')}</span>
              ) : (
                <span>{t('home_page_settings.select_folder_first')}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePageSettings;
