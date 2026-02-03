import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Select,
  Input,
  Slider,
  Modal,
  Upload,
  message,
  Spin,
  Tooltip,
  Progress
} from 'antd';
import {
  InfoCircleOutlined,
  UploadOutlined,
  UserAddOutlined,
  ScanOutlined,
  FolderOpenOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { BACKEND_URL } from '../App';
import PrimaryButton from './Buttons/PrimaryButton';
import SecondaryButton from './Buttons/SecondaryButton';

interface FaceRecognitionPanelProps {
  visible: boolean;
  onClose: () => void;
}

interface RecognitionResult {
  success: boolean;
  recognizedCount: number;
  totalScanned: number;
  outputFolder: string;
  breakdown: Record<string, number>;
  errors: string[];
}

const sectionStyle = {
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

const FaceRecognitionPanel: React.FC<FaceRecognitionPanelProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();

  // State
  const [knownFaces, setKnownFaces] = useState<string[]>([]);
  const [selectedFaces, setSelectedFaces] = useState<string[]>([]);
  const [inputFolder, setInputFolder] = useState('');
  const [outputFolderName, setOutputFolderName] = useState('recognized_faces_output');
  const [threshold, setThreshold] = useState(0.4);
  const [loading, setLoading] = useState(false);
  const [loadingFaces, setLoadingFaces] = useState(false);
  const [result, setResult] = useState<RecognitionResult | null>(null);

  // Register face modal state
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [newFaceName, setNewFaceName] = useState('');
  const [newFaceImage, setNewFaceImage] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);

  // Fetch known faces when panel opens
  useEffect(() => {
    if (visible) {
      fetchKnownFaces();
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
        setInputFolder(data.path);
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
    return false; // Prevent auto upload
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
        fetchKnownFaces(); // Refresh the list
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

  const handleStartRecognition = async () => {
    if (!inputFolder.trim()) {
      message.error(t('face.error_input_folder_required'));
      return;
    }
    if (selectedFaces.length === 0) {
      message.error(t('face.error_select_faces'));
      return;
    }

    // Build output folder path
    const outputFolder = inputFolder.replace(/\/$/, '') + '/../' + outputFolderName;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${BACKEND_URL}/face/recognize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputFolder: inputFolder,
          outputFolder: outputFolder,
          targetFaces: selectedFaces,
          threshold: threshold,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setResult(data);
        message.success(
          t('face.recognition_complete', { count: data.recognizedCount })
        );
      } else {
        message.error(data.error || t('face.recognition_failed'));
      }
    } catch (error) {
      message.error(t('face.recognition_failed'));
      console.error('Error in face recognition:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Drawer
        title={t('face.title')}
        placement="right"
        width={450}
        onClose={onClose}
        open={visible}
        styles={{ body: { paddingBottom: 80 } }}
      >
        <Spin spinning={loading} tip={t('face.processing')}>
          {/* Section 1: Select Faces */}
          <div style={sectionStyle}>
            <div style={labelStyle}>
              <UserAddOutlined />
              {t('face.select_faces')}
              <Tooltip title={t('face.select_faces_tooltip')}>
                <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer' }} />
              </Tooltip>
            </div>

            <Select
              mode="multiple"
              placeholder={t('face.select_faces_placeholder')}
              value={selectedFaces}
              onChange={setSelectedFaces}
              style={{ width: '100%', marginBottom: '12px' }}
              loading={loadingFaces}
              options={knownFaces.map(face => ({ label: face, value: face }))}
            />

            <SecondaryButton
              icon={<UserAddOutlined />}
              onClick={() => setRegisterModalVisible(true)}
              style={{ width: '100%' }}
            >
              {t('face.register_new')}
            </SecondaryButton>
          </div>

          {/* Section 2: Search Location */}
          <div style={sectionStyle}>
            <div style={labelStyle}>
              <FolderOpenOutlined />
              {t('face.search_folder')}
              <Tooltip title={t('face.search_folder_tooltip')}>
                <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer' }} />
              </Tooltip>
            </div>

            <Input
              placeholder={t('face.folder_path_placeholder')}
              value={inputFolder}
              onChange={(e) => setInputFolder(e.target.value)}
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

          {/* Section 3: Output Settings */}
          <div style={sectionStyle}>
            <div style={labelStyle}>
              {t('face.output_settings')}
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', color: '#666' }}>
                {t('face.output_folder_name')}
              </label>
              <Input
                value={outputFolderName}
                onChange={(e) => setOutputFolderName(e.target.value)}
                placeholder="recognized_faces_output"
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', color: '#666' }}>
                {t('face.threshold')}: {threshold.toFixed(2)}
              </label>
              <Tooltip title={t('face.threshold_tooltip')}>
                <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '8px' }} />
              </Tooltip>
              <Slider
                min={0.1}
                max={0.9}
                step={0.05}
                value={threshold}
                onChange={setThreshold}
              />
            </div>
          </div>

          {/* Start Button */}
          <PrimaryButton
            icon={<ScanOutlined />}
            onClick={handleStartRecognition}
            loading={loading}
            style={{ width: '100%', height: '48px', fontSize: '16px' }}
          >
            {t('face.start_recognition')}
          </PrimaryButton>

          {/* Results */}
          {result && (
            <div style={{ ...sectionStyle, marginTop: '16px', backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
              <h4 style={{ color: '#52c41a', marginBottom: '12px' }}>
                {t('face.results_title')}
              </h4>
              <p><strong>{t('face.total_scanned')}:</strong> {result.totalScanned}</p>
              <p><strong>{t('face.recognized_count')}:</strong> {result.recognizedCount}</p>
              <p><strong>{t('face.output_location')}:</strong></p>
              <p style={{ fontSize: '12px', wordBreak: 'break-all', color: '#666' }}>
                {result.outputFolder}
              </p>

              {Object.keys(result.breakdown).length > 0 && (
                <>
                  <p style={{ marginTop: '12px' }}><strong>{t('face.breakdown')}:</strong></p>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {Object.entries(result.breakdown).map(([name, count]) => (
                      <li key={name}>{name}: {count} {t('face.images')}</li>
                    ))}
                  </ul>
                </>
              )}

              {result.errors.length > 0 && (
                <>
                  <p style={{ marginTop: '12px', color: '#faad14' }}>
                    <strong>{t('face.warnings')}:</strong> {result.errors.length}
                  </p>
                </>
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

export default FaceRecognitionPanel;
