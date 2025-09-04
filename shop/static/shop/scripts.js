// scripts.js - Enhanced Label System JavaScript
document.addEventListener('DOMContentLoaded', function() {

    // -------------------------------
    // 1️⃣ Butonlara loading animasyonu
    // -------------------------------
    function addLoadingState(button, originalText) {
        button.disabled = true;
        button.innerHTML = `<span class="spinner"></span> ${originalText}`;

        // Spinner CSS ekle (yalnızca bir kez)
        if (!document.querySelector('#spinner-style')) {
            const style = document.createElement('style');
            style.id = 'spinner-style';
            style.textContent = `
                .spinner {
                    width: 12px;
                    height: 12px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    display: inline-block;
                    margin-right: 5px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // -------------------------------
    // 2️⃣ Arama fonksiyonelliği
    // -------------------------------
    const searchForm = document.querySelector('.search-box');
    const searchInput = document.querySelector('input[name="q"]');
    const searchButton = document.querySelector('.search-box .btn-primary');

    if (searchForm && searchInput && searchButton) {

        // Enter tuşuna basınca form submit
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addLoadingState(searchButton, '🔍 Ara');
                searchForm.submit();
            }
        });

        // Butona tıklayınca loading state
        searchButton.addEventListener('click', function(e) {
            if (searchInput.value.trim()) {
                addLoadingState(this, '🔍 Ara');
            }
        });

        // Arama inputuna otomatik odak
        searchInput.focus();

        // -------------------------------
        // 3️⃣ Arama temizleme butonu
        // -------------------------------
        if (searchInput.value) {
            const clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.className = 'btn-clear';
            clearBtn.innerHTML = '❌';
            clearBtn.title = 'Temizle';
            clearBtn.style.cssText = `
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: #6c757d;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.2s ease;
            `;

            // Arama inputu için relative container oluştur
            const inputContainer = document.createElement('div');
            inputContainer.style.position = 'relative';
            inputContainer.style.display = 'inline-block';
            inputContainer.style.width = '100%';

            searchInput.parentNode.insertBefore(inputContainer, searchInput);
            inputContainer.appendChild(searchInput);
            inputContainer.appendChild(clearBtn);

            // Temizleme butonuna tıklayınca
            clearBtn.addEventListener('click', function() {
                searchInput.value = '';
                searchInput.focus();
                window.location.href = window.location.pathname; // Sayfayı yenile
            });

            // Hover efektleri
            clearBtn.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f8f9fa';
                this.style.color = '#dc3545';
            });

            clearBtn.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
                this.style.color = '#6c757d';
            });
        }
    }

});
