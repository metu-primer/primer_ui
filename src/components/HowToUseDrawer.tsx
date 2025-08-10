// Copyright © 2025
// Sinan Kalkan, Ahmet Kılavuz, Alperen Ovak, Ali Özçelik, Feyza Yavuz
// This file is part of the Image Search Engine project.
// Licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
// https://creativecommons.org/licenses/by-nc/4.0/

import React from 'react';
import { Drawer } from 'antd';
import { useTranslation } from 'react-i18next';

interface HowToUseDrawerProps {
    visible: boolean;
    onClose: () => void;
}

const HowToUseDrawer: React.FC<HowToUseDrawerProps> = ({ visible, onClose }) => {
    const { t } = useTranslation();

    return (
        <Drawer
            title={t('howto.title')}
            placement="left"
            // AntD v5 uses `open`; keep prop name external but map here.
            open={visible}
            onClose={onClose}
            width={400}
        >
            <p style={{ fontSize: '18px' }}>{t('howto.subtitle')}</p>
            <ol style={{ fontSize: '16px' }}>
                <li>{t('howto.step_config')}</li>
                <li>{t('howto.step_type_query')}</li>
                <li>{t('howto.step_click_search', { search: t('searchbar.search') })}</li>
                <li>{t('howto.step_view_download')}</li>
            </ol>
        </Drawer>
    );
};

export default HowToUseDrawer;
