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
            msg_images_fetched_with_filter: "Found {{count}} images matching faces: {{faces}}",
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
                tooltip_threshold: "Set the similarity threshold for image matching",
                // NEW: Face filter settings
                face_filter: "Face Filter",
                tooltip_face_filter: "Filter search results to only include images containing selected faces. Requires scanning the folder first in Settings.",
                select_faces: "Select faces to filter by...",
                no_face_metadata: "No face data. Scan folder in Settings first.",
                select_folder_first: "Select a folder first",
                filtering_by_faces: "Filtering by {{count}} face(s)"
            },
            // Face Recognition
            face: {
                button: "Face Recognition",
                title: "Face Recognition",
                // NEW: Metadata-based approach
                metadata_info: "Scan folders to create face metadata, then filter your searches by detected faces.",
                manage_faces: "Registered Faces",
                manage_faces_tooltip: "View and manage your registered faces",
                no_faces_registered: "No faces registered yet",
                delete_failed: "Failed to delete face",
                scan_folder_title: "Scan Folder for Faces",
                scan_folder_tooltip: "Scan images in a folder to detect faces and save metadata for filtering",
                select_faces_to_scan: "Faces to look for",
                folder_to_scan: "Folder to scan",
                scan_for_faces: "Scan for Faces",
                scanning: "Scanning images for faces...",
                scan_complete: "Scan complete! Found {{matched}} images with faces out of {{scanned}} scanned.",
                scan_failed: "Face scanning failed",
                scan_results_title: "Scan Results",
                images_with_faces: "Images with Detected Faces",
                metadata_saved_info: "Metadata saved. You can now filter searches by these faces on the main page.",
                // Existing keys
                select_faces: "Select Faces to Search",
                select_faces_tooltip: "Choose which registered faces to look for in the images",
                select_faces_placeholder: "Select faces...",
                register_new: "Register New Face",
                register_new_face: "Register New Face",
                search_folder: "Folder to Search",
                search_folder_tooltip: "Select the folder containing images to scan for faces",
                folder_path_placeholder: "Enter folder path...",
                browse_folder: "Browse Folder",
                output_settings: "Output Settings",
                output_folder_name: "Output Folder Name",
                threshold: "Recognition Threshold",
                threshold_tooltip: "Lower values = stricter matching, Higher values = more lenient",
                start_recognition: "Start Recognition",
                processing: "Processing images...",
                results_title: "Recognition Results",
                total_scanned: "Total Images Scanned",
                recognized_count: "Images with Recognized Faces",
                output_location: "Output Location",
                breakdown: "Breakdown by Person",
                images: "images",
                warnings: "Warnings",
                recognition_complete: "Recognition complete! Found {{count}} images",
                recognition_failed: "Face recognition failed",
                error_loading_faces: "Failed to load known faces",
                error_name_required: "Please enter a name",
                error_image_required: "Please upload an image",
                error_input_folder_required: "Please select a folder to search",
                error_select_faces: "Please select at least one face to search for",
                register_success: "Face registered successfully",
                register_failed: "Failed to register face",
                person_name: "Person Name",
                enter_name: "Enter person's name...",
                face_image: "Face Image",
                upload_image: "Upload Image",
                cancel: "Cancel",
                register: "Register"
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
            msg_images_fetched_with_filter: "{{count}} görsel bulundu (yüzler: {{faces}})",
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
                tooltip_threshold: "Görüntü eşleştirmesi için benzerlik eşiğini ayarlayın",
                // YENİ: Yüz filtresi ayarları
                face_filter: "Yüz Filtresi",
                tooltip_face_filter: "Arama sonuçlarını yalnızca seçilen yüzleri içeren görsellerle sınırlayın. Önce Ayarlar'da klasörü taramanız gerekir.",
                select_faces: "Filtrelenecek yüzleri seçin...",
                no_face_metadata: "Yüz verisi yok. Önce Ayarlar'da klasörü tarayın.",
                select_folder_first: "Önce bir klasör seçin",
                filtering_by_faces: "{{count}} yüze göre filtreleniyor"
            },
            // Yüz Tanıma
            face: {
                button: "Yüz Tanıma",
                title: "Yüz Tanıma",
                // YENİ: Meta veri tabanlı yaklaşım
                metadata_info: "Yüz meta verisi oluşturmak için klasörleri tarayın, ardından aramalarınızı tespit edilen yüzlere göre filtreleyin.",
                manage_faces: "Kayıtlı Yüzler",
                manage_faces_tooltip: "Kayıtlı yüzlerinizi görüntüleyin ve yönetin",
                no_faces_registered: "Henüz kayıtlı yüz yok",
                delete_failed: "Yüz silinemedi",
                scan_folder_title: "Klasörü Yüzler İçin Tara",
                scan_folder_tooltip: "Yüzleri tespit etmek ve filtreleme için meta veri kaydetmek üzere bir klasördeki görselleri tarayın",
                select_faces_to_scan: "Aranacak yüzler",
                folder_to_scan: "Taranacak klasör",
                scan_for_faces: "Yüzleri Tara",
                scanning: "Görsellerde yüzler aranıyor...",
                scan_complete: "Tarama tamamlandı! {{scanned}} görselden {{matched}} tanesinde yüz bulundu.",
                scan_failed: "Yüz taraması başarısız oldu",
                scan_results_title: "Tarama Sonuçları",
                images_with_faces: "Yüz Tespit Edilen Görseller",
                metadata_saved_info: "Meta veri kaydedildi. Artık ana sayfada aramaları bu yüzlere göre filtreleyebilirsiniz.",
                // Mevcut anahtarlar
                select_faces: "Aranacak Yüzleri Seçin",
                select_faces_tooltip: "Görsellerde aranacak kayıtlı yüzleri seçin",
                select_faces_placeholder: "Yüz seçin...",
                register_new: "Yeni Yüz Kaydet",
                register_new_face: "Yeni Yüz Kaydet",
                search_folder: "Aranacak Klasör",
                search_folder_tooltip: "Yüz taraması yapılacak görselleri içeren klasörü seçin",
                folder_path_placeholder: "Klasör yolunu girin...",
                browse_folder: "Klasör Seç",
                output_settings: "Çıktı Ayarları",
                output_folder_name: "Çıktı Klasör Adı",
                threshold: "Tanıma Eşiği",
                threshold_tooltip: "Düşük değerler = daha katı eşleşme, Yüksek değerler = daha esnek",
                start_recognition: "Tanımayı Başlat",
                processing: "Görseller işleniyor...",
                results_title: "Tanıma Sonuçları",
                total_scanned: "Taranan Toplam Görsel",
                recognized_count: "Tanınan Yüzlü Görseller",
                output_location: "Çıktı Konumu",
                breakdown: "Kişiye Göre Dağılım",
                images: "görsel",
                warnings: "Uyarılar",
                recognition_complete: "Tanıma tamamlandı! {{count}} görsel bulundu",
                recognition_failed: "Yüz tanıma başarısız oldu",
                error_loading_faces: "Kayıtlı yüzler yüklenemedi",
                error_name_required: "Lütfen bir isim girin",
                error_image_required: "Lütfen bir görsel yükleyin",
                error_input_folder_required: "Lütfen aranacak bir klasör seçin",
                error_select_faces: "Lütfen en az bir yüz seçin",
                register_success: "Yüz başarıyla kaydedildi",
                register_failed: "Yüz kaydedilemedi",
                person_name: "Kişi Adı",
                enter_name: "Kişinin adını girin...",
                face_image: "Yüz Görseli",
                upload_image: "Görsel Yükle",
                cancel: "İptal",
                register: "Kaydet"
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
