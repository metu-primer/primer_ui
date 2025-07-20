// Copyright © 2025
// Sinan Kalkan, Ahmet Kılavuz, Alperen Ovak, Ali Özçelik, Feyza Yavuz
// This file is part of the Image Search Engine project.
// Licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
// https://creativecommons.org/licenses/by-nc/4.0/

import React from 'react';
import PrimaryButton from './PrimaryButton'

interface ImagesDisplayProps {
    images: { name: string; data: string }[];
    showImages: boolean;
    setShowImages: (show: boolean) => void;
    onDownloadZip: () => void;
    k: number | null;
}

const ImagesDisplay: React.FC<ImagesDisplayProps> = ({ images, showImages, setShowImages, onDownloadZip, k }) => (
    <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <div style={{ marginBottom: '30px' }}>
            <PrimaryButton
                type="primary"
                onClick={() => setShowImages(!showImages)}
                style={{
                    width: '175px',
                }}
            >
                {showImages ? 'Hide Images' : 'Show Returned Images'}
            </PrimaryButton>
        </div>

        {showImages && (
            <>
                <h3>Found Images:</h3>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}
                >
                    {images.slice(0, k ?? 1).map((image, index) => (
                        <img
                            key={index}
                            src={image.data}
                            alt={`Generated ${index}`}
                            style={{
                                maxWidth: '150px',
                                margin: '10px',
                            }}
                        />
                    ))}
                </div>

                <PrimaryButton
                    type="primary"
                    onClick={onDownloadZip}
                    style={{
                        width: '175px',
                        marginTop: '16px',
                    }}
                >
                    Download All as Zip
                </PrimaryButton>
            </>
        )}
    </div>

);

export default ImagesDisplay;
