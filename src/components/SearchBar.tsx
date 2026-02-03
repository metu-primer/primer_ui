// Copyright © 2025
// Sinan Kalkan, Ahmet Kılavuz, Alperen Ovak, Ali Özçelik, Feyza Yavuz
// This file is part of the Image Search Engine project.
// Licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
// https://creativecommons.org/licenses/by-nc/4.0/

import React from 'react';
import { Spin, Tooltip } from 'antd';
import PrimaryButton from './Buttons/PrimaryButton';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
    query: string;
    onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: () => void;
    loading: boolean;
    disabled: boolean;
    suggestedQuery: string | null;
    onSuggestedQueryClick: (query: string) => void;
    tooltipText: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
                                                 query,
                                                 onQueryChange,
                                                 onSearch,
                                                 loading,
                                                 disabled,
                                                 suggestedQuery,
                                                 onSuggestedQueryClick,
                                                 tooltipText,
                                             }) => {
    const { t } = useTranslation();

    return (
        <div style={{ textAlign: 'center' }}>
            <input
                type="text"
                value={query}
                onChange={onQueryChange}
                placeholder={t('searchbar.placeholder')}
                aria-label={t('searchbar.placeholder')}
                style={{
                    width: '400px',
                    height: '40px',
                    fontSize: '16px',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                }}
            />

            <div style={{ marginTop: '16px' }}>
                <Tooltip title={tooltipText}>
                    <PrimaryButton
                        type="primary"
                        onClick={onSearch}
                        disabled={disabled}
                        style={{ width: '175px' }}
                    >
                        {loading ? <Spin /> : t('searchbar.search')}
                    </PrimaryButton>
                </Tooltip>
            </div>

            {suggestedQuery && (
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <p>
                        {t('searchbar.did_you_mean')}{' '}
                        <PrimaryButton type="link" onClick={() => onSuggestedQueryClick(suggestedQuery)}>
                            {suggestedQuery}
                        </PrimaryButton>
                        ?
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
