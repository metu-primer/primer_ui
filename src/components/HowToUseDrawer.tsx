// Copyright © 2025
// Sinan Kalkan, Ahmet Kılavuz, Alperen Ovak, Ali Özçelik, Feyza Yavuz
// This file is part of the Image Search Engine project.
// Licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
// https://creativecommons.org/licenses/by-nc/4.0/

import React from 'react';
import { Drawer } from 'antd';

interface HowToUseDrawerProps {
    visible: boolean;
    onClose: () => void;
}

const HowToUseDrawer: React.FC<HowToUseDrawerProps> = ({ visible, onClose }) => (
    <Drawer
        title="How To Use"
        placement="left"
        visible={visible}
        onClose={onClose}
        width={400}
    >
        <p style={{ fontSize: '18px' }}>Follow these steps to use the image search feature:</p>
        <ol style={{ fontSize: '16px' }}>
            <li>Fill the configs using the settings button.</li>
            <li>Type your query.</li>
            <li>Click "Search" to fetch images based on your query.</li>
            <li>View or download the images as needed.</li>
        </ol>
    </Drawer>
);

export default HowToUseDrawer;
