export const DEFAULT_LOCALE = 'fr';
export const LOCALE_STORAGE_KEY = 'azursystech.locale';
export const LOCALE_COOKIE_KEY = LOCALE_STORAGE_KEY;

const SUPPORTED_LOCALES = ['fr', 'ru', 'en'];

export const AVAILABLE_LOCALES = SUPPORTED_LOCALES.map((code) => ({
    code,
    label: code.toUpperCase(),
}));

const dictionaries = {
    fr: {
        meta: {
            home: {
                title: 'AzurSysTech | Support informatique à Nice',
                description: 'Support informatique et mise en place d\'infrastructure pour petites entreprises et particuliers à Nice et dans les environs.',
            },
            legal: {
                title: 'Mentions légales | AzurSysTech',
                description: 'Informations légales sur AzurSysTech : éditeur du site, coordonnées et hébergement.',
            },
            privacy: {
                title: 'Politique de confidentialité | AzurSysTech',
                description: 'Comment AzurSysTech traite les données du formulaire, du chat et du consentement analytics sur le site.',
            },
        },
        common: {
            location: 'Nice + 30 km',
            privacyPolicy: 'politique de confidentialité',
            legalInformation: 'mentions légales',
            cookieSettings: 'Paramètres cookies',
            whatsapp: 'WhatsApp',
        },
        consent: {
            eyebrow: 'Cookies et consentement analytics',
            title: 'Analytics désactivée par défaut',
            descriptionPrefix: 'Nous utilisons Google Analytics uniquement après votre consentement explicite. Avant votre choix, analytics ne se charge pas et le site reste pleinement fonctionnel sans trackers non essentiels. En savoir plus — ',
            descriptionSuffix: '.',
            rejectButton: 'Refuser le non essentiel',
            acceptButton: 'Accepter analytics',
        },
        navbar: {
            homeAriaLabel: 'AzurSysTech — Accueil',
            menuButtonLabel: 'Ouvrir le menu',
            languageSwitcherLabel: 'Changer de langue',
            links: [
                { hash: '#hero', label: 'Accueil' },
                { hash: '#services', label: 'Services' },
                { hash: '#pricing', label: 'Tarifs' },
                { hash: '#faq', label: 'FAQ' },
                { hash: '#contact', label: 'Contact' },
            ],
            cta: 'Demander un devis',
        },
        hero: {
            titlePrefix: 'Support informatique et mise en place',
            titleAccent: 'pour les petites entreprises',
            subtitle: 'Installation de postes de travail, Wi-Fi, réseau local et imprimantes. Intervention à Nice et dans un rayon de 30 km. Nous aidons aussi les particuliers.',
            primaryCta: 'Demander un devis',
            secondaryCta: 'Décrire la demande',
            supportLine: 'Pour les petites entreprises, commerces, cabinets et particuliers.',
            imageAlt: 'Poste de travail moderne dans un bureau lumineux',
            trustCardTitle: 'Environnement IT fiable',
            trustCardSubtitle: 'Intervention sur site',
        },
        businessValue: {
            title: 'Nous aidons les petites entreprises à lancer et structurer rapidement leur environnement IT',
            intro: 'Pour un bureau, un commerce, un cabinet ou une petite structure professionnelle. Nous mettons en place une infrastructure claire et fonctionnelle, sans complexité inutile.',
            cta: 'Demander un devis pro',
            imageAlt: 'Petit bureau avec équipement réseau discret',
            features: [
                'Postes de travail',
                'Wi-Fi et réseau',
                'Imprimantes',
                'Dossiers partagés',
                'Intervention sur site',
                'Environnement IT de base',
            ],
        },
        services: {
            title: 'Services AzurSysTech',
            businessLabel: 'Pour les petites entreprises',
            homeLabel: 'Pour les particuliers',
            businessCards: [
                {
                    title: 'Postes de travail',
                    desc: 'Installation et préparation des ordinateurs, réglages système de base et configuration des logiciels.',
                },
                {
                    title: 'Réseau local et Wi-Fi',
                    desc: 'Configuration du Wi-Fi, organisation simple du réseau et connexion des appareils.',
                },
                {
                    title: 'Imprimantes et dossiers partagés',
                    desc: 'Accès réseau aux imprimantes et organisation simple du partage de fichiers.',
                },
                {
                    title: 'Assistance IT sur site',
                    desc: 'Diagnostic sur place et résolution des problèmes matériels ou de configuration les plus courants.',
                },
            ],
            homeCards: [
                {
                    title: 'Réparation et configuration d’ordinateur',
                    desc: 'Résolution des lenteurs, des problèmes de démarrage et réinstallation de base si nécessaire.',
                },
                {
                    title: 'Nouveau PC prêt à l’emploi',
                    desc: 'Configuration initiale, mises à jour et transfert des données de base.',
                },
                {
                    title: 'Wi-Fi et imprimante à domicile',
                    desc: 'Configuration du réseau domestique, connexion du matériel et vérification de la stabilité.',
                },
                {
                    title: 'Optimisation (SSD / RAM)',
                    desc: 'Amélioration des performances d’un ordinateur ancien avec une approche pragmatique.',
                },
            ],
        },
        whyUs: {
            title: 'Pourquoi AzurSysTech',
            intro: 'Un service informatique local et pratique pour celles et ceux qui veulent un résultat concret plutôt qu’un discours compliqué. Particulièrement adapté si vous n’avez pas de responsable IT dédié.',
            reasons: [
                'Intervention à Nice et dans un rayon de 30 km',
                'Pour petites entreprises et particuliers',
                'Couverture large : PC, réseau, Wi-Fi et imprimantes',
                'Communication simple, sans complexité corporate',
                'Vous pouvez commencer par une seule demande',
            ],
        },
        howItWorks: {
            title: 'Comment se passe l’intervention',
            steps: [
                { title: 'Vous envoyez une demande', desc: 'Via le formulaire ou WhatsApp' },
                { title: 'Nous clarifions le besoin', desc: 'Nombre d’appareils et adresse' },
                { title: 'Nous évaluons le format', desc: 'Pour savoir si une intervention sur site est nécessaire' },
                { title: 'Nous réalisons le travail', desc: 'Nous résolvons la demande sur place' },
                { title: 'Vous obtenez un résultat clair', desc: 'Le système fonctionne et la suite est compréhensible' },
            ],
        },
        pricing: {
            title: 'Tarifs à partir de',
            intro: 'Le prix exact dépend de la demande, mais voici quelques repères de départ.',
            cards: [
                { title: 'Assistance IT sur site', value: '50 €' },
                { title: 'Configuration d’un nouveau PC', value: '80 €' },
                { title: 'Wi-Fi / imprimante', value: '70 €' },
                { title: 'Poste de travail', value: '90 €' },
            ],
            fromLabel: 'à partir de',
            highlightTitle: 'Mise en place d’un environnement IT pour petite entreprise',
            highlightDesc: 'Tarif précisé après description du projet (sur demande).',
            cta: 'Demander une estimation',
        },
        faq: {
            title: 'Questions fréquentes',
            items: [
                {
                    q: 'Intervenez-vous uniquement à Nice ?',
                    a: 'Nous intervenons à Nice et dans un rayon d’environ 30 km.',
                },
                {
                    q: 'Aidez-vous seulement les entreprises ?',
                    a: 'Non. Nous travaillons avec les petites entreprises et aussi avec les particuliers.',
                },
                {
                    q: 'Peut-on vous appeler pour le Wi-Fi et une imprimante ?',
                    a: 'Oui, c’est l’une des demandes les plus fréquentes.',
                },
                {
                    q: 'Puis-je d’abord décrire le besoin par message ?',
                    a: 'Oui. C’est même le format le plus pratique pour une première estimation : via WhatsApp ou le formulaire.',
                },
            ],
        },
        contact: {
            title: 'Contacter AzurSysTech',
            intro: 'Décrivez votre besoin par le canal qui vous convient, nous vous indiquerons par où commencer.',
            phoneLabel: 'Téléphone',
            whatsappLabel: 'WhatsApp',
            locationLabel: 'Zone d’intervention',
            assistantTitle: 'Assistant automatique de préqualification',
            assistantText: 'Vous ne savez pas encore comment formuler le besoin ? L’assistant de chat aide à préparer une courte description avant l’envoi de la demande.',
            successTitle: 'Demande envoyée',
            successText: 'Merci. Nous avons bien reçu votre demande et nous reviendrons vers vous pour préciser les détails.',
            submitAnother: 'Envoyer une nouvelle demande',
            form: {
                title: 'Laisser une demande',
                intro: 'Décrivez brièvement le besoin et nous vous recontacterons.',
                labels: {
                    name: 'Nom',
                    phone: 'Téléphone',
                    email: 'Email',
                    city: 'Ville',
                    segment: 'Vous nous contactez en tant que',
                    service: 'Type de demande',
                    description: 'Courte description du besoin',
                    companyName: 'Nom de l’entreprise',
                    siteType: 'Type de site',
                },
                placeholders: {
                    name: 'Votre nom',
                    phone: 'Numéro pour vous joindre',
                    email: 'Email (facultatif)',
                    city: 'Par exemple : Nice',
                    description: 'Que faut-il faire ou quel problème rencontrez-vous ?',
                    companyName: 'Nom de l’entreprise',
                },
                segmentOptions: {
                    tpe: 'Entreprise / TPE',
                    particulier: 'Particulier',
                },
                businessInfoTitle: 'Informations pour les professionnels',
                siteTypeOptions: [
                    { value: '', label: 'Type de site' },
                    { value: 'office', label: 'Bureau' },
                    { value: 'shop', label: 'Commerce' },
                    { value: 'cabinet', label: 'Cabinet' },
                    { value: 'other', label: 'Autre' },
                ],
                serviceOptions: [
                    { value: '', label: 'Choisissez un type de demande' },
                    { value: 'depannage_pc', label: 'Dépannage / diagnostic PC' },
                    { value: 'installation_pc', label: 'Configuration d’un nouveau PC' },
                    { value: 'wifi', label: 'Configuration Wi-Fi' },
                    { value: 'imprimante', label: 'Configuration imprimante' },
                    { value: 'reseau_local', label: 'Réseau local' },
                    { value: 'partage_fichiers', label: 'Dossiers partagés / accès aux fichiers' },
                    { value: 'poste_travail', label: 'Poste de travail / périphériques' },
                    { value: 'petite_infra_tpe', label: 'Environnement IT pour entreprise' },
                    { value: 'autre', label: 'Autre' },
                ],
                submitIdle: 'Envoyer la demande',
                submitLoading: 'Envoi en cours...',
                privacyNoticePrefix: 'En envoyant la demande, vous acceptez le traitement des données pour la réponse à votre demande, la qualification initiale et le suivi de contact. En savoir plus — ',
                privacyNoticeSuffix: '.',
                errors: {
                    tooManyRequests: 'Trop de demandes en peu de temps. Merci de réessayer plus tard.',
                    submitError: 'Une erreur est survenue lors de l’envoi. Merci de nous écrire sur WhatsApp.',
                    networkError: 'Impossible de joindre le serveur. Réessayez ou contactez-nous via WhatsApp.',
                },
            },
        },
        footer: {
            about: 'Assistance informatique locale pour petites entreprises et particuliers à Nice et dans les environs.',
            navigationTitle: 'Navigation',
            documentsTitle: 'Documents',
            contactTitle: 'Contact',
            navigationLinks: [
                { hash: '#services', label: 'Services' },
                { hash: '#pricing', label: 'Tarifs' },
                { hash: '#faq', label: 'FAQ' },
                { hash: '#contact', label: 'Contact' },
            ],
            legalLink: 'Mentions légales',
            privacyLink: 'Politique de confidentialité',
            consentSettings: 'Paramètres cookies',
            copyright: 'Tous droits réservés.',
            legalNoticePrefix: 'En utilisant ce site, vous pouvez consulter les ',
            legalNoticeMiddle: ' et la ',
            legalNoticeSuffix: '.',
        },
        chat: {
            openButtonAriaLabel: 'Ouvrir le chat',
            closeButtonAriaLabel: 'Fermer le chat',
            title: 'Assistant automatique',
            welcome: 'Bonjour ! Je suis l’assistant automatique d’AzurSysTech pour la préqualification initiale. Décrivez votre besoin et je vous aiderai à préparer une courte demande avant l’envoi.',
            tooManyRequests: 'Trop de messages envoyés à la suite. Merci d’attendre une minute.',
            unavailable: 'Le service est temporairement indisponible. Merci d’utiliser le formulaire ou WhatsApp.',
            wrapUp: 'Passer au formulaire',
            handoffHint: 'Si l’essentiel est déjà clair, vous pouvez passer directement au formulaire de demande.',
            summaryIncluded: 'Si vous avez déjà décrit le besoin dans le chat, ce résumé sera joint à la demande.',
            fallbackTitle: 'Autres moyens de contact',
            fallbackTooManyRequests: 'Le chat est temporairement limité. Vous pouvez continuer via le formulaire, par téléphone ou sur WhatsApp.',
            fallbackUnavailable: 'Le chat ne répond pas pour le moment. Vous pouvez continuer via le formulaire, par téléphone ou sur WhatsApp.',
            handoffFallbackTitle: 'Continuer par un autre canal',
            handoffFallbackTooManyRequests: 'L’envoi depuis le widget est temporairement limité. Vous pouvez utiliser le formulaire principal, le téléphone ou WhatsApp.',
            handoffFallbackUnavailable: 'L’envoi depuis le widget n’a pas abouti. Vous pouvez utiliser le formulaire principal, le téléphone ou WhatsApp.',
            contactFormCta: 'Ouvrir le formulaire de demande',
            contactSectionCta: 'Ouvrir la section contact',
            phoneCta: 'Appeler',
            whatsappCta: 'Écrire sur WhatsApp',
            inputPlaceholder: 'Écrivez votre message...',
            privacyNoticePrefix: 'Les informations du chat sont utilisées pour préparer et traiter votre demande. En savoir plus — ',
            privacyNoticeSuffix: '.',
        },
        legal: {
            docLinks: {
                legal: 'Mentions légales',
                privacy: 'Politique de confidentialité',
            },
            legalPage: {
                title: 'Mentions légales',
                intro: 'Cette page contient les informations sur l’éditeur du site AzurSysTech, les coordonnées, l’hébergement et les conditions juridiques de base d’utilisation du site.',
                siteIdentificationTitle: 'Identification du site',
                sitePurpose: 'Assistance informatique locale pour petites entreprises et particuliers à Nice et dans les communes voisines.',
                ownerTitle: 'Informations sur le propriétaire du site',
                hostingTitle: 'Hébergement',
                intellectualPropertyTitle: 'Propriété intellectuelle',
                intellectualPropertyBody: 'Les textes, la structure du site, les éléments visuels, le logo, les graphismes et les autres contenus d’AzurSysTech sont protégés dans le cadre du droit applicable. Toute copie, reproduction ou utilisation sans autorisation préalable est interdite, sauf si la loi l’autorise expressément.',
                liabilityTitle: 'Limitation de responsabilité',
                liabilityBody: 'AzurSysTech s’efforce de fournir sur le site des informations actuelles et exactes. Les informations sont publiées à titre indicatif et peuvent être mises à jour. Le propriétaire du site n’est pas responsable des conséquences directes ou indirectes liées à l’utilisation des informations du site sans confirmation complémentaire, sauf disposition légale contraire.',
                externalLinksTitle: 'Liens externes',
                externalLinksBody: 'Le site peut contenir des liens vers des ressources externes. AzurSysTech n’est pas responsable du contenu des sites tiers accessibles via ces liens.',
                applicableLawTitle: 'Droit applicable',
                applicableLawBody: 'Le site est régi par le droit applicable en France. L’utilisation du site implique l’acceptation de la structure actuelle des mentions légales et de la politique de confidentialité.',
            },
            privacyPage: {
                title: 'Politique de confidentialité',
                intro: 'Cette page explique quelles données peuvent être transmises via le site AzurSysTech, comment elles sont utilisées pour traiter les demandes et contacter l’utilisateur, ainsi que les outils externes impliqués, y compris analytics uniquement après consentement.',
                collectedDataTitle: 'Quelles données peuvent être collectées',
                collectedDataItems: [
                    'nom',
                    'téléphone',
                    'email, si l’utilisateur le renseigne volontairement',
                    'ville',
                    'type de demande : particulier ou entreprise',
                    'type de besoin et description',
                    'informations supplémentaires transmises volontairement via le formulaire ou le chat',
                ],
                channelsTitle: 'Par quels canaux les données sont transmises',
                channelsItems: [
                    'le formulaire de contact du site',
                    'l’assistant chat du site',
                    'le contact direct par téléphone ou WhatsApp si l’utilisateur choisit lui-même ce canal',
                ],
                usageTitle: 'À quoi servent ces données',
                usageItems: [
                    'répondre à la demande',
                    'clarifier le besoin et le format d’intervention',
                    'organiser une intervention ou un suivi de contact',
                    'suivre la demande et l’historique de communication',
                ],
                legalBasisTitle: 'Base de traitement',
                legalBasisBody: 'Les données sont traitées dans la mesure nécessaire pour répondre à la demande de l’utilisateur, organiser la communication, gérer le dossier et fournir les services AzurSysTech, dans le respect du droit applicable.',
                formAndChatTitle: 'Comment les données du formulaire et du chat sont utilisées',
                formAndChatBody: 'Les données du formulaire sont transmises via n8n vers une feuille Google Sheets de travail pour une qualification initiale et le suivi de contact par email, téléphone ou WhatsApp, selon les informations fournies par l’utilisateur. Les informations transmises via le chat servent à préparer un résumé du besoin et à aider l’utilisateur avant l’envoi de la demande. Le chat ne constitue pas un mécanisme autonome de conclusion de vente et ne fournit pas d’engagement tarifaire ou juridique définitif.',
                retentionTitle: 'Durée de conservation',
                retentionBody: 'Les données sont conservées pendant la durée nécessaire au traitement de la demande, à la communication ultérieure, à la réalisation des services et au respect des obligations applicables de conservation.',
                toolsTitle: 'Outils utilisés',
                toolsItems: [
                    'Hetzner Online GmbH — hébergement du site',
                    'n8n — traitement technique des formulaires envoyés',
                    'Google Sheets — stockage et traitement opérationnel des leads issus du formulaire',
                    'Google Analytics — mesure de fréquentation et d’usage basique du site uniquement après consentement explicite',
                    'AI chat provider — génération des réponses dans l’assistant chat du site',
                ],
                cookiesTitle: 'Cookies et analytics',
                cookiesIntro: 'Le site utilise Google Analytics pour une mesure basique de la fréquentation et de l’usage des pages uniquement après le consentement explicite de l’utilisateur aux cookies analytics. Avant ce consentement, analytics est bloquée par défaut : le script Google Analytics ne se charge pas et l’initialisation de la propriété n’est pas exécutée.',
                cookiesGaPropertyLabel: 'Propriété Google Analytics',
                cookiesHighlights: [
                    'Après consentement, des informations de haut niveau peuvent être collectées : vues de pages, données techniques approximatives sur l’appareil et le navigateur, localisation approximative dérivée de l’IP, referrer et événements de visite généraux',
                    'Le choix de consentement est enregistré localement dans le navigateur via la clé localStorage',
                    'Si l’utilisateur refuse le non essentiel, le site reste pleinement fonctionnel sans analytics : formulaire, chat, navigation et pages légales restent disponibles',
                ],
                cookiesOutro: 'L’utilisateur peut modifier ou retirer son choix à tout moment via le bouton « Paramètres cookies » dans le footer ou avec le bouton ci-dessous. En cas de retrait du consentement, les nouveaux événements analytics sont bloqués pour les visites suivantes et les cookies Google Analytics existants sur ce site sont supprimés du navigateur autant que possible.',
                rightsTitle: 'Droits de l’utilisateur',
                rightsBody: 'L’utilisateur peut contacter AzurSysTech pour toute question relative au traitement de ses données ou demander des précisions sur les informations transmises via les coordonnées publiées sur le site.',
                contactTitle: 'Contact pour les questions relatives aux données',
                labels: {
                    site: 'Site',
                    brand: 'Marque',
                    purpose: 'Objet',
                    owner: 'Propriétaire',
                    status: 'Statut',
                    siren: 'SIREN',
                    siret: 'SIRET',
                    ape: 'APE / NAF',
                    address: 'Adresse',
                    email: 'Email',
                    phone: 'Téléphone',
                    provider: 'Hébergeur',
                    website: 'Site web',
                    whatsapp: 'WhatsApp',
                },
            },
        },
    },
    ru: {
        meta: {
            home: {
                title: 'AzurSysTech | IT-поддержка в Ницце',
                description: 'IT-поддержка и настройка инфраструктуры для малого бизнеса и частных клиентов в Ницце и соседних городах.',
            },
            legal: {
                title: 'Правовая информация | AzurSysTech',
                description: 'Правовая информация об AzurSysTech: владелец сайта, контакты и данные о хостинге.',
            },
            privacy: {
                title: 'Политика конфиденциальности | AzurSysTech',
                description: 'Как AzurSysTech обрабатывает данные формы, чата и analytics consent на сайте.',
            },
        },
        common: {
            location: 'Nice + 30 km',
            privacyPolicy: 'политика конфиденциальности',
            legalInformation: 'правовая информация',
            cookieSettings: 'Настройки cookies',
            whatsapp: 'WhatsApp',
        },
        consent: {
            eyebrow: 'Cookies и analytics consent',
            title: 'Analytics отключена по умолчанию',
            descriptionPrefix: 'Мы используем Google Analytics только после вашего явного согласия. До выбора analytics не загружается, а сайт продолжает полноценно работать без non-essential trackers. Подробнее — ',
            descriptionSuffix: '.',
            rejectButton: 'Отклонить non-essential',
            acceptButton: 'Принять analytics',
        },
        navbar: {
            homeAriaLabel: 'AzurSysTech — Главная',
            menuButtonLabel: 'Открыть меню',
            languageSwitcherLabel: 'Сменить язык',
            links: [
                { hash: '#hero', label: 'Главная' },
                { hash: '#services', label: 'Услуги' },
                { hash: '#pricing', label: 'Цены' },
                { hash: '#faq', label: 'FAQ' },
                { hash: '#contact', label: 'Контакты' },
            ],
            cta: 'Оставить заявку',
        },
        hero: {
            titlePrefix: 'IT-поддержка и настройка инфраструктуры',
            titleAccent: 'для малого бизнеса',
            subtitle: 'Настройка рабочих станций, Wi-Fi, локальной сети и принтеров. Выезд по Ницце и в радиусе до 30 км. Также помогаем частным клиентам.',
            primaryCta: 'Оставить заявку',
            secondaryCta: 'Обсудить задачу',
            supportLine: 'Для малого бизнеса, магазинов, кабинетов и частных клиентов.',
            imageAlt: 'Современное рабочее место в офисе',
            trustCardTitle: 'Надежная IT-среда',
            trustCardSubtitle: 'Поддержка на месте',
        },
        businessValue: {
            title: 'Помогаем малому бизнесу быстро запустить и наладить IT-среду',
            intro: 'Для офиса, магазина, кабинета или небольшой профессиональной команды. Настраиваем понятную и рабочую IT-инфраструктуру без лишней сложности.',
            cta: 'Оставить заявку для бизнеса',
            imageAlt: 'Небольшой офис с сетевым оборудованием',
            features: [
                'Рабочие места',
                'Wi‑Fi и сеть',
                'Принтеры',
                'Общие папки',
                'Выезд на месте',
                'Базовая IT-среда',
            ],
        },
        services: {
            title: 'Все услуги AzurSysTech',
            businessLabel: 'Для малого бизнеса',
            homeLabel: 'Для частных клиентов',
            businessCards: [
                {
                    title: 'Настройка рабочих мест',
                    desc: 'Установка и подготовка компьютеров, базовая настройка систем и программ.',
                },
                {
                    title: 'Локальная сеть и Wi‑Fi',
                    desc: 'Настройка Wi‑Fi, организация сети и подключение устройств.',
                },
                {
                    title: 'Принтеры и общие папки',
                    desc: 'Сетевой доступ к принтерам и базовая организация обмена файлами.',
                },
                {
                    title: 'Выездная IT-помощь',
                    desc: 'Диагностика на месте и исправление типовых аппаратных и конфигурационных проблем.',
                },
            ],
            homeCards: [
                {
                    title: 'Ремонт и настройка компьютеров',
                    desc: 'Решение проблем с медленным запуском, диагностикой и базовой переустановкой при необходимости.',
                },
                {
                    title: 'Новый компьютер «под ключ»',
                    desc: 'Первичная настройка, обновления и перенос базовых данных.',
                },
                {
                    title: 'Домашний Wi‑Fi и принтер',
                    desc: 'Настройка домашней сети, подключение периферии и проверка стабильности.',
                },
                {
                    title: 'Модернизация (SSD / RAM)',
                    desc: 'Практичное ускорение работы старого компьютера.',
                },
            ],
        },
        whyUs: {
            title: 'Почему AzurSysTech',
            intro: 'Практичный локальный IT-сервис для тех, кому нужен рабочий результат, а не сложный технический жаргон. Особенно полезно, если у вас нет своего системного администратора.',
            reasons: [
                'Выезд по Ницце и в радиусе до 30 км',
                'Помощь малому бизнесу и частным клиентам',
                'Широкий охват: ПК, сеть, Wi‑Fi и принтеры',
                'Понятная коммуникация без корпоративной сложности',
                'Можно начать с одной задачи',
            ],
        },
        howItWorks: {
            title: 'Как проходит работа',
            steps: [
                { title: 'Оставляете заявку', desc: 'Через форму или WhatsApp' },
                { title: 'Уточняем задачу', desc: 'Количество устройств и адрес' },
                { title: 'Оцениваем формат', desc: 'Понимаем, нужен ли выезд' },
                { title: 'Выполняем работу', desc: 'Решаем задачу на месте' },
                { title: 'Даём понятный результат', desc: 'Всё работает, и следующий шаг ясен' },
            ],
        },
        pricing: {
            title: 'Цены от',
            intro: 'Точная стоимость зависит от задачи, но для ориентира показываем стартовые варианты.',
            cards: [
                { title: 'Выездная IT-помощь', value: '50 €' },
                { title: 'Настройка нового ПК', value: '80 €' },
                { title: 'Wi‑Fi / принтер', value: '70 €' },
                { title: 'Рабочее место', value: '90 €' },
            ],
            fromLabel: 'от',
            highlightTitle: 'Настройка среды для малого бизнеса',
            highlightDesc: 'Стоимость уточняется после описания проекта (по запросу).',
            cta: 'Запросить оценку',
        },
        faq: {
            title: 'Частые вопросы',
            items: [
                { q: 'Вы работаете только по Ницце?', a: 'Работаем в Ницце и примерно в радиусе до 30 км.' },
                { q: 'Вы помогаете только бизнесу?', a: 'Нет. Работаем и с малым бизнесом, и с частными клиентами.' },
                { q: 'Можно ли вызвать вас для настройки Wi‑Fi и принтера?', a: 'Да, это одна из типовых задач.' },
                { q: 'Можно ли сначала описать задачу в сообщении?', a: 'Да, это удобный стартовый формат для оценки через WhatsApp или форму.' },
            ],
        },
        contact: {
            title: 'Связаться с AzurSysTech',
            intro: 'Опишите задачу удобным способом — мы подскажем, с чего начать.',
            phoneLabel: 'Телефон',
            whatsappLabel: 'WhatsApp',
            locationLabel: 'Локация',
            assistantTitle: 'Автоматический помощник',
            assistantText: 'Не знаете, как лучше описать задачу? Чат-помощник помогает подготовить короткое описание перед отправкой заявки.',
            successTitle: 'Заявка отправлена',
            successText: 'Спасибо. Мы получили вашу заявку и свяжемся с вами для уточнения деталей.',
            submitAnother: 'Отправить новую',
            form: {
                title: 'Оставить заявку',
                intro: 'Коротко опишите задачу, и мы свяжемся с вами.',
                labels: {
                    name: 'Имя',
                    phone: 'Телефон',
                    email: 'Email',
                    city: 'Город',
                    segment: 'Вы обращаетесь как',
                    service: 'Что нужно сделать',
                    description: 'Краткое описание задачи',
                    companyName: 'Название компании',
                    siteType: 'Тип объекта',
                },
                placeholders: {
                    name: 'Ваше имя',
                    phone: 'Телефон для связи',
                    email: 'Email (необязательно)',
                    city: 'Например: Nice',
                    description: 'Что нужно сделать или какая проблема возникла?',
                    companyName: 'Название компании',
                },
                segmentOptions: {
                    tpe: 'Бизнес / TPE',
                    particulier: 'Частный клиент',
                },
                businessInfoTitle: 'Информация для бизнеса',
                siteTypeOptions: [
                    { value: '', label: 'Тип объекта' },
                    { value: 'office', label: 'Офис' },
                    { value: 'shop', label: 'Магазин' },
                    { value: 'cabinet', label: 'Кабинет' },
                    { value: 'other', label: 'Другое' },
                ],
                serviceOptions: [
                    { value: '', label: 'Выберите тип задачи' },
                    { value: 'depannage_pc', label: 'Ремонт / диагностика ПК' },
                    { value: 'installation_pc', label: 'Настройка нового ПК' },
                    { value: 'wifi', label: 'Настройка Wi‑Fi' },
                    { value: 'imprimante', label: 'Настройка принтера' },
                    { value: 'reseau_local', label: 'Локальная сеть' },
                    { value: 'partage_fichiers', label: 'Общие папки / доступ к файлам' },
                    { value: 'poste_travail', label: 'Рабочее место / устройства' },
                    { value: 'petite_infra_tpe', label: 'IT-среда для бизнеса' },
                    { value: 'autre', label: 'Другое' },
                ],
                submitIdle: 'Отправить заявку',
                submitLoading: 'Отправка...',
                privacyNoticePrefix: 'Отправляя заявку, вы соглашаетесь с обработкой данных для ответа на запрос, первичной квалификации и последующей связи по заявке. Подробнее — ',
                privacyNoticeSuffix: '.',
                errors: {
                    tooManyRequests: 'Слишком много запросов. Попробуйте отправить заявку позже.',
                    submitError: 'Возникла ошибка при отправке заявки. Пожалуйста, напишите нам в WhatsApp.',
                    networkError: 'Не удалось подключиться к серверу. Попробуйте ещё раз или напишите в WhatsApp.',
                },
            },
        },
        footer: {
            about: 'Локальная IT-помощь для малого бизнеса и частных клиентов в Ницце и рядом.',
            navigationTitle: 'Навигация',
            documentsTitle: 'Документы',
            contactTitle: 'Контакты',
            navigationLinks: [
                { hash: '#services', label: 'Услуги' },
                { hash: '#pricing', label: 'Цены' },
                { hash: '#faq', label: 'FAQ' },
                { hash: '#contact', label: 'Контакты' },
            ],
            legalLink: 'Правовая информация',
            privacyLink: 'Политика конфиденциальности',
            consentSettings: 'Настройки cookies',
            copyright: 'Все права защищены.',
            legalNoticePrefix: 'Используя сайт, вы можете ознакомиться с ',
            legalNoticeMiddle: ' и ',
            legalNoticeSuffix: '.',
        },
        chat: {
            openButtonAriaLabel: 'Открыть чат',
            closeButtonAriaLabel: 'Закрыть чат',
            title: 'Автоматический помощник',
            welcome: 'Здравствуйте! Я автоматический помощник AzurSysTech для первичного описания задачи. Опишите, что нужно сделать, и я помогу подготовить короткую заявку.',
            tooManyRequests: 'Слишком много обращений подряд, пожалуйста, подождите минуту.',
            unavailable: 'Сервис временно недоступен. Пожалуйста, воспользуйтесь формой заявки или WhatsApp.',
            wrapUp: 'Перейти к форме заявки',
            handoffHint: 'Если основная информация уже есть, можно сразу перейти к короткой форме заявки.',
            summaryIncluded: 'Если вы уже описали задачу в чате, это описание будет добавлено к заявке.',
            fallbackTitle: 'Другие способы связи',
            fallbackTooManyRequests: 'Чат временно ограничен по количеству сообщений. Можно продолжить через форму, по телефону или в WhatsApp.',
            fallbackUnavailable: 'Чат сейчас недоступен. Можно продолжить через форму, по телефону или в WhatsApp.',
            handoffFallbackTitle: 'Продолжить другим способом',
            handoffFallbackTooManyRequests: 'Отправка из виджета временно ограничена. Можно использовать основную форму, телефон или WhatsApp.',
            handoffFallbackUnavailable: 'Не удалось отправить заявку из виджета. Можно использовать основную форму, телефон или WhatsApp.',
            contactFormCta: 'Открыть форму заявки',
            contactSectionCta: 'Открыть раздел контактов',
            phoneCta: 'Позвонить',
            whatsappCta: 'Написать в WhatsApp',
            inputPlaceholder: 'Напишите сообщение...',
            privacyNoticePrefix: 'Информация из чата используется для подготовки и обработки вашего обращения. Подробнее — ',
            privacyNoticeSuffix: '.',
        },
        legal: {
            docLinks: {
                legal: 'Правовая информация',
                privacy: 'Политика конфиденциальности',
            },
            legalPage: {
                title: 'Правовая информация',
                intro: 'Эта страница содержит сведения о владельце сайта AzurSysTech, контактные данные, данные о хостинге и базовые правовые условия использования сайта.',
                siteIdentificationTitle: 'Идентификация сайта',
                sitePurpose: 'Локальная IT-поддержка для малого бизнеса и частных клиентов в Ницце и соседних городах.',
                ownerTitle: 'Информация о владельце сайта',
                hostingTitle: 'Хостинг',
                intellectualPropertyTitle: 'Интеллектуальная собственность',
                intellectualPropertyBody: 'Все тексты, структура сайта, визуальные элементы, логотип, графика и иные материалы сайта AzurSysTech защищены в рамках применимого права. Любое копирование, воспроизведение или использование материалов без предварительного разрешения запрещено, кроме случаев, прямо допускаемых законом.',
                liabilityTitle: 'Ограничение ответственности',
                liabilityBody: 'AzurSysTech стремится предоставлять актуальную и точную информацию на сайте. Информация размещается в ознакомительных целях и может обновляться. Владелец сайта не несет ответственности за прямые или косвенные последствия использования информации сайта без дополнительного подтверждения, если иное не предусмотрено законом.',
                externalLinksTitle: 'Внешние ссылки',
                externalLinksBody: 'Сайт может содержать ссылки на внешние ресурсы. AzurSysTech не несет ответственности за содержание внешних сайтов, доступных по этим ссылкам.',
                applicableLawTitle: 'Применимое право',
                applicableLawBody: 'Сайт регулируется применимым правом Франции. Использование сайта означает согласие пользователя с действующей структурой правовой информации и политикой конфиденциальности.',
            },
            privacyPage: {
                title: 'Политика конфиденциальности',
                intro: 'Здесь описано, какие данные могут передаваться через сайт AzurSysTech, как они используются для обработки заявок и связи с пользователем, а также какие внешние инструменты участвуют в этом процессе, включая analytics только по consent.',
                collectedDataTitle: 'Какие данные могут собираться',
                collectedDataItems: [
                    'имя',
                    'телефон',
                    'email, если пользователь указывает его добровольно',
                    'город',
                    'тип обращения: частный клиент или бизнес',
                    'тип задачи и ее описание',
                    'дополнительные сведения, которые пользователь сам сообщает через форму или чат',
                ],
                channelsTitle: 'Через какие каналы поступают данные',
                channelsItems: [
                    'форма заявки на сайте',
                    'чат-помощник на сайте',
                    'прямой контакт по телефону или WhatsApp, если пользователь сам выбирает этот канал',
                ],
                usageTitle: 'Для чего используются данные',
                usageItems: [
                    'для ответа на заявку',
                    'для уточнения задачи и формата работ',
                    'для организации выезда или дальнейшей связи',
                    'для ведения заявки и истории коммуникации',
                ],
                legalBasisTitle: 'Основание обработки',
                legalBasisBody: 'Данные обрабатываются в объеме, необходимом для ответа на запрос пользователя, организации связи, ведения заявки и выполнения услуг AzurSysTech, в пределах, допустимых применимым правом.',
                formAndChatTitle: 'Как используются данные формы и чата',
                formAndChatBody: 'Данные из формы передаются через n8n в рабочую таблицу Google Sheets для первичной квалификации обращения и последующей связи по заявке по email, телефону или WhatsApp, в зависимости от данных, которые пользователь сам оставляет. Информация, переданная через чат-помощник, используется для подготовки краткого описания обращения и помощи пользователю перед отправкой заявки. Чат не является самостоятельным механизмом заключения сделки и не дает окончательных ценовых или юридических обещаний.',
                retentionTitle: 'Срок хранения данных',
                retentionBody: 'Данные хранятся столько, сколько это необходимо для обработки обращения, дальнейшей коммуникации, выполнения услуг и соблюдения применимых требований по хранению информации.',
                toolsTitle: 'Используемые инструменты',
                toolsItems: [
                    'Hetzner Online GmbH — хостинг сайта',
                    'n8n — техническая обработка отправленных форм',
                    'Google Sheets — хранение и рабочая обработка лидов из формы',
                    'Google Analytics — посещаемость сайта и базовые usage metrics только после явного согласия пользователя',
                    'AI chat provider — генерация ответов в чат-помощнике на сайте',
                ],
                cookiesTitle: 'Cookies и аналитика',
                cookiesIntro: 'Сайт использует Google Analytics для базовой оценки посещаемости и использования страниц только после явного согласия пользователя на analytics cookies. До такого согласия analytics заблокирована по умолчанию: скрипт Google Analytics не загружается, а инициализация свойства не выполняется.',
                cookiesGaPropertyLabel: 'Google Analytics property',
                cookiesHighlights: [
                    'Что может собираться на high level после consent: просмотры страниц, примерные технические данные об устройстве и браузере, IP-derived approximate location, referrer и общие события посещения',
                    'Решение о consent сохраняется локально в браузере пользователя через localStorage key',
                    'При выборе Reject non-essential сайт продолжает работать без analytics: форма, чат, навигация и legal pages остаются доступными',
                ],
                cookiesOutro: 'Пользователь может в любой момент изменить или отозвать выбор через кнопку «Настройки cookies» в footer или через кнопку ниже. Если вы отзываетe согласие, новые analytics events блокируются для последующих визитов, а существующие Google Analytics cookies на этом сайте пытаются быть удалены из браузера.',
                rightsTitle: 'Права пользователя',
                rightsBody: 'Пользователь может обратиться по вопросам, связанным с обработкой своих данных, а также запросить уточнение по переданной информации через контактные данные, указанные на сайте.',
                contactTitle: 'Контакт по вопросам данных',
                labels: {
                    site: 'Сайт',
                    brand: 'Бренд',
                    purpose: 'Назначение',
                    owner: 'Владелец',
                    status: 'Статус',
                    siren: 'SIREN',
                    siret: 'SIRET',
                    ape: 'APE / NAF',
                    address: 'Адрес',
                    email: 'Email',
                    phone: 'Телефон',
                    provider: 'Провайдер',
                    website: 'Сайт',
                    whatsapp: 'WhatsApp',
                },
            },
        },
    },
    en: {
        meta: {
            home: {
                title: 'AzurSysTech | IT support in Nice',
                description: 'IT support and practical infrastructure setup for small businesses and home users in Nice and nearby towns.',
            },
            legal: {
                title: 'Legal information | AzurSysTech',
                description: 'Legal information about AzurSysTech: site owner, contact details and hosting information.',
            },
            privacy: {
                title: 'Privacy policy | AzurSysTech',
                description: 'How AzurSysTech handles contact-form data, chat data and analytics consent on the website.',
            },
        },
        common: {
            location: 'Nice + 30 km',
            privacyPolicy: 'privacy policy',
            legalInformation: 'legal information',
            cookieSettings: 'Cookie settings',
            whatsapp: 'WhatsApp',
        },
        consent: {
            eyebrow: 'Cookies and analytics consent',
            title: 'Analytics is off by default',
            descriptionPrefix: 'We use Google Analytics only after your explicit consent. Before you choose, analytics does not load and the site remains fully usable without non-essential trackers. Learn more in the ',
            descriptionSuffix: '.',
            rejectButton: 'Reject non-essential',
            acceptButton: 'Accept analytics',
        },
        navbar: {
            homeAriaLabel: 'AzurSysTech — Home',
            menuButtonLabel: 'Open menu',
            languageSwitcherLabel: 'Change language',
            links: [
                { hash: '#hero', label: 'Home' },
                { hash: '#services', label: 'Services' },
                { hash: '#pricing', label: 'Pricing' },
                { hash: '#faq', label: 'FAQ' },
                { hash: '#contact', label: 'Contact' },
            ],
            cta: 'Request a quote',
        },
        hero: {
            titlePrefix: 'IT support and infrastructure setup',
            titleAccent: 'for small businesses',
            subtitle: 'Workstation setup, Wi-Fi, local network and printer configuration. On-site support in Nice and within 30 km. We also help home users.',
            primaryCta: 'Request a quote',
            secondaryCta: 'Discuss your need',
            supportLine: 'For small businesses, shops, offices, practices and home users.',
            imageAlt: 'Modern office workstation',
            trustCardTitle: 'Reliable IT environment',
            trustCardSubtitle: 'On-site support',
        },
        businessValue: {
            title: 'We help small businesses launch and stabilize their IT environment quickly',
            intro: 'For offices, shops, practices and small professional spaces. We set up a clear and workable IT baseline without unnecessary complexity.',
            cta: 'Request a business quote',
            imageAlt: 'Small office with modern networking equipment',
            features: [
                'Workstations',
                'Wi-Fi and network',
                'Printers',
                'Shared folders',
                'On-site support',
                'Basic IT environment',
            ],
        },
        services: {
            title: 'AzurSysTech services',
            businessLabel: 'For small businesses',
            homeLabel: 'For home users',
            businessCards: [
                {
                    title: 'Workstation setup',
                    desc: 'Computer preparation, basic system configuration and software setup.',
                },
                {
                    title: 'Local network and Wi-Fi',
                    desc: 'Wi-Fi setup, simple network organization and device connection.',
                },
                {
                    title: 'Printers and shared folders',
                    desc: 'Network printer access and basic file-sharing organization.',
                },
                {
                    title: 'On-site IT support',
                    desc: 'On-site diagnosis and resolution of common hardware and configuration issues.',
                },
            ],
            homeCards: [
                {
                    title: 'Computer repair and setup',
                    desc: 'Help with slow startup, diagnosis and basic reinstall scenarios if needed.',
                },
                {
                    title: 'New computer setup',
                    desc: 'Initial configuration, updates and basic data transfer.',
                },
                {
                    title: 'Home Wi-Fi and printer',
                    desc: 'Home network setup, peripheral connection and stability checks.',
                },
                {
                    title: 'Upgrade (SSD / RAM)',
                    desc: 'Practical performance improvement for older computers.',
                },
            ],
        },
        whyUs: {
            title: 'Why AzurSysTech',
            intro: 'A practical local IT service for people who need a working result, not complicated technical language. Especially useful if you do not have your own IT administrator.',
            reasons: [
                'On-site support in Nice and within 30 km',
                'Help for small businesses and home users',
                'Wide coverage: PCs, networks, Wi-Fi and printers',
                'Clear communication without corporate complexity',
                'You can start with one task',
            ],
        },
        howItWorks: {
            title: 'How the process works',
            steps: [
                { title: 'You send a request', desc: 'Via the form or WhatsApp' },
                { title: 'We clarify the task', desc: 'Number of devices and address' },
                { title: 'We assess the format', desc: 'We decide whether an on-site visit is needed' },
                { title: 'We do the work', desc: 'We solve the task on site' },
                { title: 'You get a clear result', desc: 'Everything works and the next step is understandable' },
            ],
        },
        pricing: {
            title: 'Pricing from',
            intro: 'The exact price depends on the task, but these are useful starting-point references.',
            cards: [
                { title: 'On-site IT support', value: '50 €' },
                { title: 'New PC setup', value: '80 €' },
                { title: 'Wi-Fi / printer', value: '70 €' },
                { title: 'Workstation setup', value: '90 €' },
            ],
            fromLabel: 'from',
            highlightTitle: 'IT environment setup for a small business',
            highlightDesc: 'Pricing is confirmed after a short project description (on request).',
            cta: 'Request an estimate',
        },
        faq: {
            title: 'Frequently asked questions',
            items: [
                { q: 'Do you work only in Nice?', a: 'We work in Nice and roughly within a 30 km radius.' },
                { q: 'Do you help only businesses?', a: 'No. We work with both small businesses and home users.' },
                { q: 'Can I call you for Wi-Fi and printer setup?', a: 'Yes, that is one of the most common request types.' },
                { q: 'Can I describe the task by message first?', a: 'Yes. That is usually the preferred format for an initial estimate through WhatsApp or the form.' },
            ],
        },
        contact: {
            title: 'Contact AzurSysTech',
            intro: 'Describe your task through the channel that works best for you, and we will suggest the next step.',
            phoneLabel: 'Phone',
            whatsappLabel: 'WhatsApp',
            locationLabel: 'Service area',
            assistantTitle: 'Automatic intake assistant',
            assistantText: 'Not sure how to describe the issue yet? The chat assistant helps you prepare a short request before you submit it.',
            successTitle: 'Request sent',
            successText: 'Thank you. We received your request and will contact you to clarify the details.',
            submitAnother: 'Send another request',
            form: {
                title: 'Send a request',
                intro: 'Briefly describe the task and we will get back to you.',
                labels: {
                    name: 'Name',
                    phone: 'Phone',
                    email: 'Email',
                    city: 'City',
                    segment: 'You are contacting us as',
                    service: 'What needs to be done',
                    description: 'Short description of the task',
                    companyName: 'Company name',
                    siteType: 'Site type',
                },
                placeholders: {
                    name: 'Your name',
                    phone: 'Best phone number',
                    email: 'Email (optional)',
                    city: 'For example: Nice',
                    description: 'What needs to be done or what problem are you facing?',
                    companyName: 'Company name',
                },
                segmentOptions: {
                    tpe: 'Business / TPE',
                    particulier: 'Home user',
                },
                businessInfoTitle: 'Business information',
                siteTypeOptions: [
                    { value: '', label: 'Site type' },
                    { value: 'office', label: 'Office' },
                    { value: 'shop', label: 'Shop' },
                    { value: 'cabinet', label: 'Practice' },
                    { value: 'other', label: 'Other' },
                ],
                serviceOptions: [
                    { value: '', label: 'Choose a task type' },
                    { value: 'depannage_pc', label: 'PC repair / diagnosis' },
                    { value: 'installation_pc', label: 'New PC setup' },
                    { value: 'wifi', label: 'Wi-Fi setup' },
                    { value: 'imprimante', label: 'Printer setup' },
                    { value: 'reseau_local', label: 'Local network' },
                    { value: 'partage_fichiers', label: 'Shared folders / file access' },
                    { value: 'poste_travail', label: 'Workstation / devices' },
                    { value: 'petite_infra_tpe', label: 'Business IT environment' },
                    { value: 'autre', label: 'Other' },
                ],
                submitIdle: 'Send request',
                submitLoading: 'Sending...',
                privacyNoticePrefix: 'By sending a request, you agree to data processing for response handling, initial qualification and follow-up contact. Learn more in the ',
                privacyNoticeSuffix: '.',
                errors: {
                    tooManyRequests: 'Too many requests in a short time. Please try again later.',
                    submitError: 'There was an error sending the request. Please contact us on WhatsApp.',
                    networkError: 'Could not reach the server. Please try again or contact us on WhatsApp.',
                },
            },
        },
        footer: {
            about: 'Local IT support for small businesses and home users in Nice and nearby areas.',
            navigationTitle: 'Navigation',
            documentsTitle: 'Documents',
            contactTitle: 'Contact',
            navigationLinks: [
                { hash: '#services', label: 'Services' },
                { hash: '#pricing', label: 'Pricing' },
                { hash: '#faq', label: 'FAQ' },
                { hash: '#contact', label: 'Contact' },
            ],
            legalLink: 'Legal information',
            privacyLink: 'Privacy policy',
            consentSettings: 'Cookie settings',
            copyright: 'All rights reserved.',
            legalNoticePrefix: 'By using this site, you can review the ',
            legalNoticeMiddle: ' and the ',
            legalNoticeSuffix: '.',
        },
        chat: {
            openButtonAriaLabel: 'Open chat',
            closeButtonAriaLabel: 'Close chat',
            title: 'Automatic assistant',
            welcome: 'Hello! I’m the automatic AzurSysTech assistant for initial intake. Describe your task and I’ll help you prepare a short request before you submit it.',
            tooManyRequests: 'Too many messages in a row. Please wait a minute.',
            unavailable: 'The service is temporarily unavailable. Please use the contact form or WhatsApp.',
            wrapUp: 'Go to the request form',
            handoffHint: 'If the main details are already clear, you can move straight to the request form.',
            summaryIncluded: 'If you already described the task in chat, that summary will be attached to the request.',
            fallbackTitle: 'Other contact options',
            fallbackTooManyRequests: 'The chat is temporarily rate-limited. You can continue via the form, by phone, or on WhatsApp.',
            fallbackUnavailable: 'The chat is not responding right now. You can continue via the form, by phone, or on WhatsApp.',
            handoffFallbackTitle: 'Continue through another channel',
            handoffFallbackTooManyRequests: 'Submission from the widget is temporarily rate-limited. You can use the main form, phone, or WhatsApp.',
            handoffFallbackUnavailable: 'The widget could not submit the request. You can use the main form, phone, or WhatsApp.',
            contactFormCta: 'Open the request form',
            contactSectionCta: 'Open the contact section',
            phoneCta: 'Call',
            whatsappCta: 'Write on WhatsApp',
            inputPlaceholder: 'Write a message...',
            privacyNoticePrefix: 'Information from the chat is used to prepare and process your request. Learn more in the ',
            privacyNoticeSuffix: '.',
        },
        legal: {
            docLinks: {
                legal: 'Legal information',
                privacy: 'Privacy policy',
            },
            legalPage: {
                title: 'Legal information',
                intro: 'This page contains information about the AzurSysTech website owner, contact details, hosting data and the basic legal terms for using the website.',
                siteIdentificationTitle: 'Website identification',
                sitePurpose: 'Local IT support for small businesses and home users in Nice and nearby towns.',
                ownerTitle: 'Website owner information',
                hostingTitle: 'Hosting',
                intellectualPropertyTitle: 'Intellectual property',
                intellectualPropertyBody: 'All texts, site structure, visual elements, logo, graphics and other materials of the AzurSysTech website are protected under applicable law. Any copying, reproduction or use without prior permission is prohibited unless expressly allowed by law.',
                liabilityTitle: 'Limitation of liability',
                liabilityBody: 'AzurSysTech aims to provide current and accurate information on the website. The information is published for guidance purposes and may be updated. The site owner is not responsible for direct or indirect consequences arising from the use of website information without additional confirmation, unless otherwise required by law.',
                externalLinksTitle: 'External links',
                externalLinksBody: 'The website may contain links to external resources. AzurSysTech is not responsible for the content of third-party websites accessible through those links.',
                applicableLawTitle: 'Applicable law',
                applicableLawBody: 'The website is governed by the applicable laws of France. Using the website means accepting the current legal-information structure and privacy policy.',
            },
            privacyPage: {
                title: 'Privacy policy',
                intro: 'This page explains what data can be sent through the AzurSysTech website, how it is used to process requests and contact the user, and which external tools are involved, including analytics only after consent.',
                collectedDataTitle: 'What data may be collected',
                collectedDataItems: [
                    'name',
                    'phone number',
                    'email, if the user provides it voluntarily',
                    'city',
                    'request type: home user or business',
                    'task type and description',
                    'additional information voluntarily provided through the form or chat',
                ],
                channelsTitle: 'Through which channels data is received',
                channelsItems: [
                    'the website contact form',
                    'the website chat assistant',
                    'direct contact by phone or WhatsApp if the user chooses that channel',
                ],
                usageTitle: 'How the data is used',
                usageItems: [
                    'to respond to the request',
                    'to clarify the task and service format',
                    'to organize an on-site visit or follow-up communication',
                    'to manage the request and communication history',
                ],
                legalBasisTitle: 'Processing basis',
                legalBasisBody: 'Data is processed to the extent necessary to respond to the user’s request, organize communication, manage the request and deliver AzurSysTech services within the limits allowed by applicable law.',
                formAndChatTitle: 'How form and chat data is used',
                formAndChatBody: 'Data from the form is sent through n8n to a working Google Sheets table for initial qualification and follow-up by email, phone or WhatsApp depending on the information provided by the user. Information sent through the chat assistant is used to prepare a short request summary and help the user before the form is submitted. The chat is not an autonomous sales mechanism and does not provide final pricing or legal commitments.',
                retentionTitle: 'Data retention period',
                retentionBody: 'Data is stored for as long as needed to process the request, continue communication, deliver services and comply with applicable record-keeping requirements.',
                toolsTitle: 'Tools used',
                toolsItems: [
                    'Hetzner Online GmbH — website hosting',
                    'n8n — technical processing of submitted forms',
                    'Google Sheets — storage and operational handling of leads from the form',
                    'Google Analytics — website traffic and basic usage metrics only after explicit user consent',
                    'AI chat provider — generation of responses in the website chat assistant',
                ],
                cookiesTitle: 'Cookies and analytics',
                cookiesIntro: 'The website uses Google Analytics for basic traffic and page-usage measurement only after the user explicitly consents to analytics cookies. Before consent, analytics is blocked by default: the Google Analytics script does not load and the property is not initialized.',
                cookiesGaPropertyLabel: 'Google Analytics property',
                cookiesHighlights: [
                    'After consent, high-level data may be collected: page views, approximate device and browser information, IP-derived approximate location, referrer data and general visit events',
                    'The consent choice is stored locally in the browser through the localStorage key',
                    'If the user rejects non-essential tracking, the site continues to work without analytics: form, chat, navigation and legal pages remain available',
                ],
                cookiesOutro: 'The user can change or withdraw the choice at any time through the “Cookie settings” button in the footer or through the button below. If consent is withdrawn, new analytics events are blocked for later visits and existing Google Analytics cookies on this website are removed from the browser where possible.',
                rightsTitle: 'User rights',
                rightsBody: 'The user may contact AzurSysTech regarding questions about personal-data processing and request clarification about the information shared through the contact details published on the website.',
                contactTitle: 'Contact for data-related questions',
                labels: {
                    site: 'Website',
                    brand: 'Brand',
                    purpose: 'Purpose',
                    owner: 'Owner',
                    status: 'Status',
                    siren: 'SIREN',
                    siret: 'SIRET',
                    ape: 'APE / NAF',
                    address: 'Address',
                    email: 'Email',
                    phone: 'Phone',
                    provider: 'Provider',
                    website: 'Website',
                    whatsapp: 'WhatsApp',
                },
            },
        },
    },
};

function isSupportedLocale(value) {
    return SUPPORTED_LOCALES.includes(value);
}

export function resolveLocale(value) {
    return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}

function getNestedValue(object, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], object);
}

export function readStoredLocale() {
    try {
        const storedValue = window.localStorage.getItem(LOCALE_STORAGE_KEY);
        return resolveLocale(storedValue);
    } catch {
        return DEFAULT_LOCALE;
    }
}

export function persistLocale(locale) {
    if (!isSupportedLocale(locale)) {
        return;
    }

    try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
        // Ignore storage errors and keep runtime behavior functional.
    }
}

export function createTranslator(locale) {
    const activeDictionary = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];

    return (path) => {
        const value = getNestedValue(activeDictionary, path);

        if (value !== undefined) {
            return value;
        }

        const fallbackValue = getNestedValue(dictionaries[DEFAULT_LOCALE], path);
        return fallbackValue !== undefined ? fallbackValue : path;
    };
}

export function getPageMeta(locale, pathname) {
    const dictionary = dictionaries[resolveLocale(locale)] ?? dictionaries[DEFAULT_LOCALE];

    if (pathname === '/legal') {
        return dictionary.meta.legal;
    }

    if (pathname === '/privacy') {
        return dictionary.meta.privacy;
    }

    return dictionary.meta.home;
}
