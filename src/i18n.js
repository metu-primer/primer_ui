// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            // Languages
            lang_turkish: "Turkish",
            lang_english: "English",
            language_label: "Language",
            // UI labels / buttons
            how_to_use: "How to Use",
            footer_copyright: "© 2025 Orta Doğu Teknik Üniversitesi",

            // Search / state
            tooltip_ready: "Ready to search",
            tooltip_fill_in: "Please fill in: {{fields}}",

            // Missing fields (used to build the tooltip list)
            missing_field: {
                query: "query",
                index_selection: "index selection",
                url: "URL",
                threshold: "Similarity threshold"
            },

            // Messages / notifications
            msg_images_fetched: "Images fetched successfully!",
            msg_failed_fetch_images: "Failed to fetch images.",
            msg_failed_load_settings: "Failed to load saved settings.",
            msg_failed_fetch_settings: "Failed to fetch settings",
            msg_settings_saved: "Settings saved successfully!",
            msg_error_saving_settings: "Error saving settings.",
            msg_unexpected_error: "An unexpected error occurred.",
            msg_backend_issues_prefix: "Some issues occurred: ",

            // Settings drawer (keys likely used by child components later)
            settings: {
                save: "Save",
                cancel: "Cancel"
            },
            // English
            settings_drawer: {
                title: "Settings",

                select_index: {
                    title: "Select Index",
                    tooltip: "Select the indexing type for your search.",
                    options: {
                        IndexIVFPQ: "IndexIVFPQ",
                        IndexFlatL2: "IndexFlatL2",
                        IndexIVFFlat: "IndexIVFFlat"
                    }
                },

                select_device: {
                    title: "Select Device",
                    tooltip: "Choose between CPU or GPU for processing.",
                    options: {
                        cpu: "CPU",
                        gpu: "GPU"
                    }
                },

                folder_name: {
                    title: "Download Folder Name",
                    tooltip: "Enter the name of the folder you will download.",
                    placeholder: "Enter folder name"
                },

                save_button: "Save Settings"
            },
            searchbar: {
                placeholder: "Enter your search query",
                search: "Search",
                did_you_mean: "Did you mean"
            },
            images_display: {
                show_returned_images: "Show Returned Images",
                hide_images: "Hide Images",
                found_images: "Found Images:",
                download_all_zip: "Download All as Zip",
                image_alt: "Generated image {{index}}"
            },
            howto: {
                title: "How To Use",
                subtitle: "Follow these steps to use the image search feature:",
                step_config: "Fill in the settings on the main screen, you can use the settings button for advanced settings and customize advanced settings.",
                step_type_query: "Type your query.",
                step_click_search: "Click \"{{search}}\" to fetch images based on your query.",
                step_view_download: "View or download the images as needed."
            },
            header: {
                logo_alt: "Department logo",
                title: "Image Search with Text Prompt",
                subtitle: "Configure your settings, enter a query, and start your image search!",
                settings: "Settings"
            },
            home_page_settings: {
                number_images: "Number of images",
                tooltip_number_images: "This is the number of images to find and show",
                url: "URL",
                url_manuel: "Enter URL manually",
                tooltip_url: "Enter the URL of the folder that contains images to find similarities",
                threshold: "Similarity Threshold",
                tooltip_threshold: "Set the similarity threshold for image matching"
            }
        }
    },

    tr: {
        translation: {
            // Languages
            lang_turkish: "Türkçe",
            lang_english: "İngilizce",
            language_label: "Dil",
            // UI labels / buttons
            how_to_use: "Nasıl Kullanılır",
            footer_copyright: "© 2025 Orta Doğu Teknik Üniversitesi",

            // Search / state
            tooltip_ready: "Aramaya hazır",
            tooltip_fill_in: "Lütfen doldurun: {{fields}}",

            // Missing fields
            missing_field: {
                query: "sorgu",
                index_selection: "indeks seçimi",
                url: "URL",
                threshold: "Benzerlik Eşiği"
            },

            // Messages / notifications
            msg_images_fetched: "Görseller başarıyla getirildi!",
            msg_failed_fetch_images: "Görseller getirilemedi.",
            msg_failed_load_settings: "Kayıtlı ayarlar yüklenemedi.",
            msg_failed_fetch_settings: "Ayarlar alınamadı",
            msg_settings_saved: "Ayarlar başarıyla kaydedildi!",
            msg_error_saving_settings: "Ayarlar kaydedilirken hata oluştu.",
            msg_unexpected_error: "Beklenmeyen bir hata oluştu.",
            msg_backend_issues_prefix: "Bazı sorunlar oluştu: ",

            // Settings drawer
            settings: {
                save: "Kaydet",
                cancel: "İptal"
            },
            // Turkish
            settings_drawer: {
                title: "Ayarlar",

                select_index: {
                    title: "İndeks Seçin",
                    tooltip: "Aramanız için indeksleme türünü seçin.",
                    options: {
                        IndexIVFPQ: "IndexIVFPQ",
                        IndexFlatL2: "IndexFlatL2",
                        IndexIVFFlat: "IndexIVFFlat"
                    }
                },

                select_device: {
                    title: "Cihaz Seçin",
                    tooltip: "İşleme için CPU veya GPU arasında seçim yapın.",
                    options: {
                        cpu: "CPU",
                        gpu: "GPU"
                    }
                },

                folder_name: {
                    title: "İndirilecek Klasör Adı",
                    tooltip: "İndireceğiniz klasörün adını girin.",
                    placeholder: "Klasör adını girin"
                },

                save_button: "Ayarları Kaydet"
            },
            searchbar: {
                placeholder: "Arama sorgunuzu girin",
                search: "Ara",
                did_you_mean: "Bunu mu demek istediniz"
            },
            images_display: {
                show_returned_images: "Dönen Görselleri Göster",
                hide_images: "Görselleri Gizle",
                found_images: "Bulunan Görseller:",
                download_all_zip: "Tümünü Zip Olarak İndir",
                image_alt: "Oluşturulan görsel {{index}}"
            },
            howto: {
                title: "Nasıl Kullanılır",
                subtitle: "Görsel arama özelliğini kullanmak için şu adımları izleyin:",
                step_config: "Ana ekrandaki ayarları doldurun, gelişmiş ayarlar için ayarlar butonunu kullanıp gelişmiş ayarları özelleştirebilirsiniz.",
                step_type_query: "Sorgunuzu yazın.",
                step_click_search: "\"{{search}}\" düğmesine tıklayarak sorgunuza göre görselleri getirin.",
                step_view_download: "Gerektiğinde görselleri görüntüleyin veya indirin."
            },
            header: {
                logo_alt: "Bölüm logosu",
                title: "Metin İsteği ile Görsel Arama",
                subtitle: "Ayarlarınızı yapılandırın, bir sorgu girin ve görsel aramaya başlayın!",
                settings: "Ayarlar"
            },
            home_page_settings: {
                number_images: "Resim Sayısı",
                tooltip_number_images: "Bulunacak ve gösterilecek görüntü sayısı",
                url: "URL",
                url_manuel: "URL'yi manuel girin",
                tooltip_url: "Benzerlikleri bulmak için görselleri içeren klasörün URL'sini girin",
                threshold: "Benzerlik Eşiği",
                tooltip_threshold: "Görüntü eşleştirmesi için benzerlik eşiğini ayarlayın"
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',          // default language
        fallbackLng: 'en',
        interpolation: { escapeValue: false }
    });

export default i18n;
