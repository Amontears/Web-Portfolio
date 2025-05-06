$(function () {
    "use strict";
    
    // Кэшируем часто используемые селекторы для повышения производительности
    const $body = $('body');
    const $preloader = $("#preloader");
    const $preloaderBg = $(".preloader-bg");
    const $borderTop = $(".border-top");
    const $borderBottom = $(".border-bottom-menu, .border-bottom");
    const $leftElement = $(".left-element");
    const $fadeInElement = $(".fadeIn-element");
    const $overlay = $("#overlay");
    const $liftingPanels = $("#about-lifting, #services-lifting, #gallery-lifting, #news-lifting");
    const $menuItems = $("#menu li a, #menu-mobile li a");
    const $contactPanels = $(".panel-left-contact, .panel-right-contact");
    const $instagramPanels = $(".panel-left-instagram-feed, .panel-right-instagram-feed");
    
    // Объединяем все таймауты в один метод для лучшей организации и производительности
    function initPageAnimations() {
        $preloader.fadeOut(600);
        $preloaderBg.delay(400).fadeOut(600);
        
        // Оптимизированные начальные анимации с меньшим количеством таймаутов
        setTimeout(function() {
            $fadeInElement.delay(1200).css({ display: "none" }).fadeIn(1200);
            
            // Группируем удаление классов для лучшей оптимизации
            setTimeout(function() {
                $borderTop.removeClass("top-position");
                $borderBottom.removeClass("bottom-position");
                $leftElement.removeClass("left-position");
            }, 800);
        }, 0);
    }
    
    // Улучшенная функция для анимации слайдера
    function animateSlider(hash) {
        const $targetPanel = $(hash + "-lifting");
        const isPanelOpen = $targetPanel.hasClass("open");
        
        // Закрыть все открытые панели
        function closeOpenPanels(callback) {
            const $openPanels = $liftingPanels.filter(".open");
            if ($openPanels.length) {
                $openPanels.slideUp(600, function() {
                    $(this).removeClass("open");
                    if (typeof callback === 'function') callback();
                });
                $overlay.fadeOut(600);
            } else if (typeof callback === 'function') {
                callback();
            }
        }
        
        if (hash === "#home") {
            closeOpenPanels();
        } else if (["#about", "#services", "#gallery", "#news"].includes(hash)) {
            if (isPanelOpen) {
                closeOpenPanels();
            } else {
                closeOpenPanels(function() {
                    $targetPanel.slideDown(600, function() {
                        $(this).addClass("open");
                    });
                    $overlay.fadeIn(600);
                });
            }
        }
    }
    
    // Оптимизированные обработчики панелей
    function setupPanelHandlers() {
        // Обработчик для меню с делегированием событий
        $menuItems.on("click", function(e) {
            e.preventDefault();
            const hash = this.hash;
            
            // Закрываем все открытые панели контактов и инстаграм
            $contactPanels.add($instagramPanels).removeClass("open").addClass("close");
            
            // Анимируем слайдер
            animateSlider(hash);
        });
        
        // Закрытие панелей по клику на оверлей - используем один обработчик
        $overlay.on("click", function() {
            $liftingPanels.filter(".open").slideUp(600, function() {
                $(this).removeClass("open");
            });
            $overlay.fadeOut(600);
        });
        
        // Оптимизированный обработчик закрытия с делегированием
        $("#containerOT").on("click", ".close-lifting", function(e) {
            e.preventDefault();
            $liftingPanels.filter(".open").slideUp(600, function() {
                $(this).removeClass("open");
            });
            $overlay.fadeOut(600);
        });
        
        // Оптимизированные переключатели контактов и инстаграм
        $(".toggle-contact-content").on("click", function() {
            if ($contactPanels.hasClass("open")) {
                $contactPanels.removeClass("open").addClass("close");
            } else {
                $contactPanels.removeClass("close").addClass("open");
                $instagramPanels.removeClass("open").addClass("close");
            }
        });
        
        $(".toggle-instagram-feed-content").on("click", function() {
            if ($instagramPanels.hasClass("open")) {
                $instagramPanels.removeClass("open").addClass("close");
            } else {
                $instagramPanels.removeClass("close").addClass("open");
                $contactPanels.removeClass("open").addClass("close");
            }
        });
    }
    
    // Ленивая инициализация карусели для лучшей производительности
    function initCarousels() {
        // Оптимизированные общие настройки для всех каруселей
        const commonOptions = {
            items: 1,
            margin: 20,
            autoplay: false,
            autoplaySpeed: 1000,
            autoplayTimeout: 4000,
            smartSpeed: 450,
            nav: true,
            navText: ["<i class='owl-custom ion-chevron-left'></i>", "<i class='owl-custom ion-chevron-right'></i>"],
            autoplayHoverPause: false,
            responsiveClass: true,
            responsive: { 0: { items: 1 }, 600: { items: 1 }, 1000: { items: 1 } }
        };
        
        // Инициализация с дифференцированными параметрами
        $("#about-carousel").owlCarousel({
            ...commonOptions,
            loop: true,
            navContainer: '.owl-nav-custom-about'
        });
        
        $("#services-carousel").owlCarousel({
            ...commonOptions,
            loop: true,
            navContainer: '.owl-nav-custom-services'
        });
        
        $("#gallery-carousel").owlCarousel({
            ...commonOptions,
            loop: false,
            navContainer: '.owl-nav-custom-gallery'
        });
        
        $("#news-carousel").owlCarousel({
            ...commonOptions,
            loop: false,
            navContainer: '.owl-nav-custom-news'
        });
    }
    
    // Оптимизированная инициализация всплывающих окон
    function initPopups() {
        $(".popup-photo-single").magnificPopup({
            type: "image",
            gallery: { enabled: false },
            removalDelay: 100,
            mainClass: "mfp-fade"
        });
        
        $(".popup-photo-gallery").each(function() {
            $(this).magnificPopup({
                delegate: "a",
                type: "image",
                gallery: { enabled: true },
                removalDelay: 100,
                mainClass: "mfp-fade"
            });
        });
    }
    
    // Оптимизированная инициализация slick слайдера
    function initSlickSlider() {
        $(".slick-fullscreen-slideshow-zoom-fade").slick({
            arrows: false,
            initialSlide: 0,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            fade: true,
            autoplay: true,
            autoplaySpeed: 4000,
            cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
            speed: 1600,
            draggable: true,
            dots: false,
            pauseOnDotsHover: true,
            pauseOnFocus: false,
            pauseOnHover: false
        });
    }
    
    // Оптимизированная обработка формы контактов
    function setupContactForm() {
        $("form#form").on("submit", function() {
            const $form = $(this);
            $form.find(".error").remove();
            
            let hasError = false;
            $form.find(".requiredField").each(function() {
                const $field = $(this);
                const value = $.trim($field.val());
                
                if (value === "") {
                    $field.parent().append('<span class="error">This field is required</span>');
                    $field.addClass("inputError");
                    hasError = true;
                } else if ($field.hasClass("email")) {
                    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                    if (!emailRegex.test(value)) {
                        $field.parent().append('<span class="error">Invalid email address</span>');
                        $field.addClass("inputError");
                        hasError = true;
                    }
                }
            });
            
            if (!hasError) {
                $form.find("input.submit").fadeOut("normal", function() {
                    $(this).parent().append("");
                });
                
                const formData = $form.serialize();
                $.post($form.attr("action"), formData, function() {
                    $form.slideUp("fast", function() {
                        $(this).before('<div class="success">Your email was sent successfully.</div>');
                    });
                });
            }
            
            return false;
        });
    }
    
    // Оптимизированная инициализация Swiper с улучшенной анимацией фона
    function initSwiper() {
        // Добавляем оптимизированную CSS-анимацию заранее
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes smoothBackgroundPan {
                0% { transform: translate3d(-1.5%, 0, 0) scale(1.08); }
                25% { transform: translate3d(-0.5%, -0.5%, 0) scale(1.1); }
                50% { transform: translate3d(1.5%, 0, 0) scale(1.12); }
                75% { transform: translate3d(0.5%, 0.5%, 0) scale(1.1); }
                100% { transform: translate3d(-1.5%, 0, 0) scale(1.08); }
            }
            
            .parallax .swiper-slide {
                overflow: hidden;
            }
            
            .parallax .swiper-slide-bg,
            .parallax .slide-bg,
            .parallax .swiper-slide > div {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-size: cover;
                background-position: center;
                will-change: transform;
                backface-visibility: hidden;
                perspective: 1000px;
                transform-style: preserve-3d;
                animation: smoothBackgroundPan 30s infinite linear;
            }
        `;
        document.head.appendChild(styleElement);
        
        // Инициализация Swiper с оптимизированными параметрами
        var swiper = new Swiper(".parallax .swiper-container", {
            autoplay: {
                delay: 7000,
                disableOnInteraction: false
            },
            speed: 1800,
            parallax: true,
            effect: "fade",
            fadeEffect: {
                crossFade: true
            },
            lazy: {
                loadPrevNext: true,
                loadPrevNextAmount: 2
            },
            grabCursor: false,
            mousewheelControl: false,
            keyboardControl: false,
            navigation: false,
            paginationClickable: true,
            watchSlidesProgress: true,
            on: {
                init: applyBackgroundAnimation
            }
        });
    }
    
    // Применение анимации фона к элементам
    function applyBackgroundAnimation() {
        const backgrounds = document.querySelectorAll('.parallax .swiper-slide-bg, .parallax .slide-bg, .parallax .swiper-slide > div');
        
        backgrounds.forEach((bg, index) => {
            // Настраиваем свойства для лучшей производительности
            bg.style.willChange = 'transform';
            bg.style.backfaceVisibility = 'hidden';
            bg.style.transformStyle = 'preserve-3d';
            
            // Добавляем небольшую случайную задержку для более естественного эффекта
            const delay = Math.random() * 5;
            bg.style.animationDelay = `-${delay}s`;
        });
    }
    
    // Оптимизированный прелоадер
    function setupPreloader() {
        let percent = 0;
        const loadingText = document.getElementById("loading-text");
        
        if (!loadingText) return;
        
        // Блокируем прокрутку во время загрузки
        $body.css('overflow', 'hidden');
        
        function updateLoading() {
            if (percent < 100) {
                percent++;
                loadingText.innerText = percent + "%";
                
                // Используем requestAnimationFrame для лучшей производительности
                if (percent < 100) {
                    setTimeout(updateLoading, 10);
                } else {
                    setTimeout(() => {
                        $preloader.css('display', 'none');
                        $body.css('overflow', 'auto');
                    }, 500);
                }
            }
        }
        
        // Запускаем анимацию загрузки
        updateLoading();
    }
    
    // Оптимизированная инициализация оверлеев
    function setupOverlays() {
        const openButtons = document.querySelectorAll('.open-overlay');
        
        // Используем делегирование событий вместо привязки к каждой кнопке
        document.addEventListener('click', (event) => {
            const target = event.target;
            
            // Открытие оверлея
            if (target.classList.contains('open-overlay') || target.closest('.open-overlay')) {
                event.preventDefault();
                
                const button = target.classList.contains('open-overlay') ? target : target.closest('.open-overlay');
                const overlayId = button.getAttribute('data-overlay');
                const overlay = document.getElementById(overlayId);
                
                if (overlay) {
                    overlay.classList.add('show');
                }
            }
            
            // Закрытие оверлея
            if (target.id === 'about') {
                target.classList.remove('show');
                target.classList.add('hide');
                
                setTimeout(() => {
                    target.classList.remove('hide');
                }, 500);
            }
        });
    }
    
    // Инициализация Instafeed более эффективным способом
    function initInstafeed() {
        const userFeed = new Instafeed({
            get: "user",
            userId: "5975086331",
            accessToken: "5975086331.1677ed0.5c991b59366a426fadf3e868310cc56b",
            limit: 10,
            resolution: "standard_resolution",
            template: '<a href="{{link}}" target="_blank"><img src="{{image}}" /></a>'
        });
        userFeed.run();
    }
    
    // YouTube player инициализация
    function initYouTubePlayer() {
        const ytPlayer = $("#bgndVideo");
        if (ytPlayer.length) {
            ytPlayer.YTPlayer();
        }
    }
    
    // Умная инициализация компонентов по мере необходимости
    function initLazyComponents() {
        // Компоненты, которые нужны сразу
        setupPanelHandlers();
        setupPreloader();
        setupOverlays();
        
        // Инициализация компонентов с задержкой для лучшей производительности
        setTimeout(() => {
            initCarousels();
            initPopups();
            initSlickSlider();
            initSwiper();
            initYouTubePlayer();
            setupContactForm();
            initInstafeed();
        }, 100);
    }
    
    // Основные обработчики загрузки страницы
    $(window).on("load", initPageAnimations);
    
    // Запускаем инициализацию сразу после загрузки DOM
    initLazyComponents();
});