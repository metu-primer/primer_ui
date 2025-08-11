import React from 'react';
import { Tooltip, Input, Radio, InputNumber, Slider } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
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
}

const sectionStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  borderRadius: '6px',
  width: '30%',
  minWidth: '200px',
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

const HomePageSettings: React.FC<HomePageSettingsProps> = ({ url, setUrl, savedUrls, k, setk, threshold, setThreshold }) => {
    const { t } = useTranslation();

    const handleSelectFolder = async () => {
      const res = await fetch(`${BACKEND_URL}/select-folder`);
      const data = await res.json();
      if (data.path) {
        setUrl(data.path); // Set the selected folder path to the URL state
        // TODO Ahmet: give success message
      } else {
        console.log("No folder selected");
        // TODO Ahmet: give error message
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

          <Radio.Group
            onChange={(e) => setUrl(e.target.value)}
            value={url}
            style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
          >
            {savedUrls.map((savedUrl, index) => (
              <Radio key={index} value={savedUrl}>
                {savedUrl}
              </Radio>
            ))}
          </Radio.Group>

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
      </div>
    </div>
  );
};

export default HomePageSettings;
