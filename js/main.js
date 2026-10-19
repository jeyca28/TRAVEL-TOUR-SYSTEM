// Immediate Role Selection Gateway Redirect on Page Refresh
(function checkReloadRedirect() {
    try {
        var navEntries = (window.performance && typeof window.performance.getEntriesByType === 'function') ? 
                         window.performance.getEntriesByType('navigation') : null;
        var isReload = false;
        if (navEntries && navEntries.length > 0) {
            isReload = (navEntries[0].type === 'reload');
        } else if (window.performance && window.performance.navigation) {
            isReload = (window.performance.navigation.type === 1);
        }
        if (isReload) {
            window.location.replace('index.html');
        }
    } catch (e) {}
})();

// Header Scroll Elevation
        const mainHeader = document.getElementById('main-header');
        if (mainHeader) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 20) {
                    mainHeader.classList.add('shadow-md', 'shadow-gray-200/50', 'border-gray-100');
                    mainHeader.classList.remove('border-transparent');
                } else {
                    mainHeader.classList.remove('shadow-md', 'shadow-gray-200/50', 'border-gray-100');
                    mainHeader.classList.add('border-transparent');
                }
            });
        }

        // Hero Stepper & Carousel Data
        const heroSlides = [
            {
                tag: "ELEVATE YOUR TRAVEL JOURNEY",
                line1: "Experience",
                line2: "The Magic",
                line3: "Of Travel!",
                ctaText: "Book A Trip Now",
                ctaHref: "#services",
                badgeLinkText: "Know More",
                badgeLinkHref: "#destinations",
                badgeTitle: "Awesome Places",
                badgeDesc: "Discover The World<br>One At A Time!",
                badgeBg: "#4a6375",
                badgeAvatars: ["images/place1.jpg", "images/place2.jpg", "images/place3.jpg"],
                planeStyle: { left: "49.5%", top: "5.5%", width: "75%", opacity: "1", filter: "drop-shadow(0 20px 25px rgba(0,0,0,0.35))", transform: "scale(1)" },
                busStyle: { left: "-0.5%", bottom: "4%", width: "26.5%", opacity: "1", filter: "drop-shadow(0 15px 20px rgba(0,0,0,0.45))", transform: "scale(1)" }
            },
            {
                tag: "AUTHENTIC CEBU PACIFIC & DOMESTIC FLIGHTS",
                line1: "Fly High",
                line2: "Above The",
                line3: "Island Skies!",
                ctaText: "Book A Plane Ticket",
                ctaHref: "plane-booking.html",
                badgeLinkText: "View Flights",
                badgeLinkHref: "plane-booking.html",
                badgeTitle: "Island Getaways",
                badgeDesc: "Boracay • Palawan • Siargao<br>Daily Direct Flights!",
                badgeBg: "#1e40af",
                badgeAvatars: ["images/place3.jpg", "images/place1.jpg", "images/place2.jpg"],
                planeStyle: { left: "46%", top: "3%", width: "78%", opacity: "1", filter: "drop-shadow(0 28px 38px rgba(0,0,0,0.45))", transform: "scale(1.06)" },
                busStyle: { left: "-0.5%", bottom: "4%", width: "26.5%", opacity: "0.25", filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.15))", transform: "scale(0.92)" }
            },
            {
                tag: "COMFORTABLE HIGHLAND BUS TRIPS",
                line1: "Ride Across",
                line2: "Scenic Mountain",
                line3: "Highways!",
                ctaText: "Book Bus Ticket",
                ctaHref: "bus-booking.html",
                badgeLinkText: "Book Bus",
                badgeLinkHref: "bus-booking.html",
                badgeTitle: "Highland Express",
                badgeDesc: "Baguio • Sagada • Vigan<br>Luxury Reclining Seats!",
                badgeBg: "#0d9488",
                badgeAvatars: ["images/place2.jpg", "images/place1.jpg", "images/place3.jpg"],
                planeStyle: { left: "54%", top: "7%", width: "66%", opacity: "0.25", filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.15))", transform: "scale(0.9)" },
                busStyle: { left: "1.5%", bottom: "4%", width: "29%", opacity: "1", filter: "drop-shadow(0 22px 32px rgba(0,0,0,0.55))", transform: "scale(1.1)" }
            }
        ];

        let activeSlideIndex = 0;
        let slideTimer = null;
        const SLIDE_DURATION = 5000; // Exactly 5 seconds auto transition

        function updateSlideUI(index) {
            const slide = heroSlides[index];
            const textArea = document.getElementById('hero-text-area');
            const tagEl = document.getElementById('hero-slide-tag');
            const w1El = document.getElementById('hero-word-1');
            const w2El = document.getElementById('hero-word-2');
            const w3El = document.getElementById('hero-word-3');
            const ctaEl = document.getElementById('hero-slide-cta');

            const badgeCard = document.getElementById('hero-cutout-card');
            const badgeLink = document.getElementById('hero-badge-link');
            const badgeLinkText = document.getElementById('hero-badge-link-text');
            const badgeTitle = document.getElementById('hero-badge-title');
            const badgeDesc = document.getElementById('hero-badge-desc');
            const badgeAvatars = document.getElementById('hero-badge-avatars');

            const planeEl = document.getElementById('hero-plane');
            const busEl = document.getElementById('hero-bus');

            // Fade transition on text
            if (textArea) {
                textArea.style.opacity = '0';
                textArea.style.transform = 'translateY(8px)';
            }

            setTimeout(() => {
                if (tagEl) tagEl.textContent = slide.tag;
                if (w1El) w1El.textContent = slide.line1;
                if (w2El) w2El.textContent = slide.line2;
                if (w3El) w3El.textContent = slide.line3;

                if (ctaEl) {
                    ctaEl.textContent = slide.ctaText;
                    ctaEl.href = slide.ctaHref;
                }

                const cutoutPath = document.getElementById('hero-cutout-path');
                if (cutoutPath) cutoutPath.setAttribute('fill', slide.badgeBg);
                if (badgeCard) badgeCard.style.backgroundColor = 'transparent';
                if (badgeLink) badgeLink.href = slide.badgeLinkHref;
                if (badgeLinkText) badgeLinkText.textContent = slide.badgeLinkText;
                if (badgeTitle) badgeTitle.textContent = slide.badgeTitle;
                if (badgeDesc) badgeDesc.innerHTML = slide.badgeDesc;

                if (badgeAvatars && slide.badgeAvatars) {
                    badgeAvatars.innerHTML = slide.badgeAvatars.map((src, i) => `
                        <img class="w-10 h-10 lg:w-11 lg:h-11 rounded-full border-2 border-white object-cover shadow-sm transition-all duration-300" src="${src}" alt="Destination ${i+1}">
                    `).join('');
                }

                if (planeEl) {
                    Object.assign(planeEl.style, slide.planeStyle);
                }
                if (busEl) {
                    Object.assign(busEl.style, slide.busStyle);
                }

                if (textArea) {
                    textArea.style.opacity = '1';
                    textArea.style.transform = 'translateY(0)';
                }
            }, 180);

            // Update Stepper Buttons & Ring Styles
            for (let i = 0; i < 3; i++) {
                const btn = document.getElementById(`step-btn-${i}`);
                if (btn) {
                    if (i === index) {
                        btn.className = "w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-black font-extrabold flex items-center justify-center z-10 text-sm transition-all duration-300 hover:scale-110 focus:outline-none cursor-pointer scale-105";
                        btn.style.boxShadow = "0 0 0 6px rgba(255, 255, 255, 0.35), 0 4px 16px rgba(0, 0, 0, 0.25)";
                        btn.style.border = "none";
                        btn.setAttribute('aria-selected', 'true');
                    } else {
                        btn.className = "w-9 h-9 sm:w-10 sm:h-10 rounded-full border-[1.5px] border-white/85 bg-white/25 text-white font-bold flex items-center justify-center z-10 backdrop-blur-sm shadow-md shadow-black/10 text-sm transition-all duration-300 hover:bg-white/40 hover:scale-110 focus:outline-none cursor-pointer scale-100";
                        btn.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.15)";
                        btn.style.border = "1.5px solid rgba(255, 255, 255, 0.85)";
                        btn.setAttribute('aria-selected', 'false');
                    }
                }
            }

            // Animate continuous linear progress tracks over 5 seconds
            animateProgressTracks(index);
        }

        function animateProgressTracks(index) {
            const track0 = document.getElementById('step-track-0');
            const track1 = document.getElementById('step-track-1');
            if (!track0 || !track1) return;

            if (index === 0) {
                track0.style.transition = 'none';
                track1.style.transition = 'none';
                track0.style.height = '0%';
                track1.style.height = '0%';
                void track0.offsetHeight;
                track0.style.transition = `height ${SLIDE_DURATION}ms linear`;
                track0.style.height = '100%';
            } else if (index === 1) {
                track0.style.transition = 'none';
                track0.style.height = '100%';
                track1.style.transition = 'none';
                track1.style.height = '0%';
                void track1.offsetHeight;
                track1.style.transition = `height ${SLIDE_DURATION}ms linear`;
                track1.style.height = '100%';
            } else if (index === 2) {
                track0.style.transition = 'none';
                track0.style.height = '100%';
                track1.style.transition = 'none';
                track1.style.height = '100%';
            }
        }

        function goToSlide(index) {
            activeSlideIndex = index;
            updateSlideUI(activeSlideIndex);
            resetSlideTimer();
        }

        function nextSlide() {
            activeSlideIndex = (activeSlideIndex + 1) % heroSlides.length;
            updateSlideUI(activeSlideIndex);
        }

        function resetSlideTimer() {
            if (slideTimer) clearInterval(slideTimer);
            slideTimer = setInterval(nextSlide, SLIDE_DURATION);
        }

        // Clean entrance animation classes after 2.1s so 5s slide transforms transition smoothly
        setTimeout(() => {
            const planeEl = document.getElementById('hero-plane');
            if (planeEl) planeEl.classList.remove('anim-hero-plane');
            const busEl = document.getElementById('hero-bus');
            if (busEl) busEl.classList.remove('anim-hero-bus');
        }, 2100);

        // Start 5-second auto movement
        updateSlideUI(0);
        resetSlideTimer();

        // Video Modal Controls
        function openVideoModal() {
            const modal = document.getElementById('video-modal');
            const card = document.getElementById('video-modal-card');
            const iframe = document.getElementById('video-iframe');
            if (modal && card && iframe) {
                iframe.src = "https://www.youtube-nocookie.com/embed/Ad630yV6w2Y?autoplay=1&rel=0";
                modal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
                modal.classList.add('flex', 'opacity-100', 'pointer-events-auto');
                setTimeout(() => {
                    card.classList.remove('scale-95');
                    card.classList.add('scale-100');
                }, 10);
            }
        }

        function closeVideoModal() {
            const modal = document.getElementById('video-modal');
            const card = document.getElementById('video-modal-card');
            const iframe = document.getElementById('video-iframe');
            if (modal && card && iframe) {
                card.classList.remove('scale-100');
                card.classList.add('scale-95');
                modal.classList.remove('opacity-100', 'pointer-events-auto');
                modal.classList.add('opacity-0', 'pointer-events-none');
                setTimeout(() => {
                    modal.classList.remove('flex');
                    modal.classList.add('hidden');
                    iframe.src = "";
                }, 300);
            }
        }

        // ==========================================
        // Popular Destinations Interactive Engine
        // ==========================================
        const POPULAR_DESTINATIONS = [
            {
                id: 'coron',
                name: 'Coron Island',
                location: 'Palawan, Philippines',
                region: 'MIMAROPA',
                rating: '4.9',
                reviews: '840+ reviews',
                tag: 'Island Hopping & Diving',
                category: 'islands',
                desc: 'Crystal clear lagoons, dramatic limestone cliffs, Kayangan Lake, and world-class WWII shipwreck diving await in Coron.',
                image: 'images/coron.jpg',
                season: 'Nov – May (Dry Season)',
                stay: '4 Days / 3 Nights',
                transportType: 'flight',
                transportText: 'Direct Flight Available',
                bookHref: 'plane-booking.html?dest=PPS',
                bookLabel: 'Book Flight to Palawan',
                highlights: [
                    'Kayangan Lake (Cleanest lake in Asia)',
                    'Twin Lagoon limestone passages',
                    'Barracuda Lake thermocline diving',
                    'Malcapuya Island powder beach',
                    'Maquinit saltwater hot spring'
                ],
                itinerary: [
                    'Day 1: Arrival at Busuanga (USU), town tour & Maquinit Hot Springs sunset soak.',
                    'Day 2: Ultimate Coron Island Tour: Kayangan Lake, Twin Lagoon & Coral Garden snorkel.',
                    'Day 3: Island Escapade: Malcapuya Island, Banana Island & Bulog Dos sandbar.',
                    'Day 4: Souvenir shopping, cashew factory visit & departure flight.'
                ]
            },
            {
                id: 'boracay',
                name: 'White Beach',
                location: 'Boracay Island, Aklan',
                region: 'Western Visayas',
                rating: '4.8',
                reviews: '1,250+ reviews',
                tag: 'Powdery Sand & Sunsets',
                category: 'islands',
                desc: 'World-famous 4-kilometer stretch of talcum-soft white sand, crystal azure waters, vibrant beachfront dining, and legendary tropical sunsets.',
                image: 'images/boracay.jpg',
                season: 'Dec – May (Amihan Season)',
                stay: '3 Days / 2 Nights',
                transportType: 'flight',
                transportText: 'Direct Flight to Caticlan',
                bookHref: 'plane-booking.html?dest=MPH',
                bookLabel: 'Book Flight to Boracay',
                highlights: [
                    'White Beach Stations 1, 2 & 3',
                    'Paraw sunset sailing cruise',
                    'Willy\'s Rock volcanic grotto',
                    'Puka Shell secluded beach',
                    'Ariel\'s Point cliff diving excursion'
                ],
                itinerary: [
                    'Day 1: Arrival via Caticlan (MPH), beachfront hotel check-in & sunset cocktail session.',
                    'Day 2: Morning island hopping to Puka Beach, crystal kayak photoshoot & sunset paraw sail.',
                    'Day 3: Stand-up paddleboarding, D\'Mall shopping & scenic departure.'
                ]
            },
            {
                id: 'siquijor',
                name: 'Waterfall Trails',
                location: 'Lazi, Siquijor',
                region: 'Central Visayas',
                rating: '4.7',
                reviews: '620+ reviews',
                tag: 'Mystical Eco-Adventures',
                category: 'nature',
                desc: 'Tarzan rope swings into multi-tiered turquoise pools at Cambugahay Falls, 400-year-old enchanted Balete trees, and pristine marine sanctuaries.',
                image: 'images/waterfall.jpg',
                season: 'Year-Round (Best Nov – June)',
                stay: '3 Days / 2 Nights',
                transportType: 'flight',
                transportText: 'Flight to Visayas / Ferry',
                bookHref: 'plane-booking.html?dest=CEB',
                bookLabel: 'Book Flight to Visayas',
                highlights: [
                    'Cambugahay 3-Tier Waterfall pools',
                    'Tarzan vine rope swing jumps',
                    '400-year-old Old Enchanted Balete Tree',
                    'Salagdoong 10m cliff diving beach',
                    'Paliton Beach coconut palm sunsets'
                ],
                itinerary: [
                    'Day 1: Ferry arrival, coastal motorcycle drive & fish spa at the Enchanted Balete Tree.',
                    'Day 2: Cambugahay Falls morning swim & rope swings, Salagdoong cliff jumping.',
                    'Day 3: Snorkeling at Tubod Marine Sanctuary, Paliton Beach picnic & departure.'
                ]
            },
            {
                id: 'banaue',
                name: 'Cultural Landscapes',
                location: 'Banaue, Ifugao',
                region: 'Cordillera Mountain Range',
                rating: '4.5',
                reviews: '580+ reviews',
                tag: 'UNESCO World Heritage',
                category: 'highlands',
                desc: 'Hand-carved 2,000-year-old mountain rice terraces rising 1,500 meters into the clouds, living Ifugao heritage, and panoramic highland trekking.',
                image: 'images/banaue.jpg',
                season: 'March – June & Oct – Dec',
                stay: '3 Days / 2 Nights',
                transportType: 'bus',
                transportText: 'Highland Bus from Manila',
                bookHref: 'bus-booking.html',
                bookLabel: 'Book Highland Bus',
                highlights: [
                    'Batad Amphitheater Rice Terraces',
                    'Tappiya 70-meter mountain waterfall',
                    'Banaue Main Viewpoint scenic deck',
                    'Traditional native Ifugao thatch village',
                    'Tam-an heritage woodcarving trail'
                ],
                itinerary: [
                    'Day 1: Overnight luxury VIP bus from Manila, dawn arrival in Banaue, viewpoint photo walk.',
                    'Day 2: Jeepney adventure to Batad, mountain trek down to Tappiya Falls for a refreshing dip.',
                    'Day 3: Village cultural immersion, native coffee tasting & evening return coach.'
                ]
            }
        ];

        // All 8 Destinations in Full Directory Modal
        const ALL_DESTINATIONS = [
            ...POPULAR_DESTINATIONS,
            {
                id: 'siargao',
                name: 'Cloud 9 & Lagoons',
                location: 'Siargao, Surigao del Norte',
                region: 'Caraga (Mindanao)',
                rating: '4.9',
                reviews: '910+ reviews',
                tag: 'Surfing Capital & Palm Forests',
                category: 'islands',
                desc: 'Iconic Cloud 9 boardwalk barrel waves, palm tree rope swings at Maasin River, and emerald waters of Sugba Lagoon.',
                image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80',
                season: 'July – Nov (Surf), Dec – May (Calm)',
                stay: '4 Days / 3 Nights',
                transportType: 'flight',
                transportText: 'Direct Flight to Sayak (IAO)',
                bookHref: 'plane-booking.html?dest=IAO',
                bookLabel: 'Book Flight to Siargao',
                highlights: ['Cloud 9 Boardwalk', 'Sugba Lagoon', 'Magpupungko Rock Pools', 'Coconut Mountain Viewpoint'],
                itinerary: ['Day 1: Cloud 9 sunset.', 'Day 2: Sugba Lagoon & Magpupungko.', 'Day 3: Tri-island hopping (Naked, Daku, Guyam).']
            },
            {
                id: 'bohol',
                name: 'Chocolate Hills & Panglao',
                location: 'Carmen & Panglao, Bohol',
                region: 'Central Visayas',
                rating: '4.8',
                reviews: '1,100+ reviews',
                tag: 'Geological Wonders & Tarsiers',
                category: 'nature',
                desc: 'Over 1,200 cone-shaped limestone hills that turn cocoa brown in summer, tiny Philippine tarsiers, and white-sand Panglao reefs.',
                image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=600&q=80',
                season: 'Nov – May',
                stay: '3 Days / 2 Nights',
                transportType: 'flight',
                transportText: 'Flight to Panglao (TAG)',
                bookHref: 'plane-booking.html?dest=CEB',
                bookLabel: 'Book Travel to Bohol',
                highlights: ['Chocolate Hills Complex', 'Philippine Tarsier Sanctuary', 'Loboc River Buffet Cruise', 'Balicasag Dolphin & Turtle Snorkel'],
                itinerary: ['Day 1: Countryside tour (Hills & Tarsiers).', 'Day 2: Balicasag Island marine sanctuary.', 'Day 3: Panglao beach relaxation.']
            },
            {
                id: 'baguio',
                name: 'Pine Haven & Mountain Trails',
                location: 'Baguio City & Sagada',
                region: 'Cordillera Highlands',
                rating: '4.6',
                reviews: '1,420+ reviews',
                tag: 'Summer Capital & Pine Valleys',
                category: 'highlands',
                desc: 'Crisp mountain air, aromatic pine forests, strawberry picking in La Trinidad, Camp John Hay, and mystical Sagada caves.',
                image: 'images/place2.jpg',
                season: 'Nov – Feb (Crisp Cold Air)',
                stay: '3 Days / 2 Nights',
                transportType: 'bus',
                transportText: 'Highland VIP Bus (4-5 hrs from Manila)',
                bookHref: 'bus-booking.html',
                bookLabel: 'Book Bus to Baguio',
                highlights: ['Camp John Hay Pine Trails', 'La Trinidad Strawberry Farm', 'Mines View Park', 'Sagada Sumaguing Cave (Nearby)'],
                itinerary: ['Day 1: Scenic TPLEX bus ascent, Session Road & Burnham Park.', 'Day 2: Camp John Hay, Mines View & Strawberry picking.', 'Day 3: Baguio market coffee & pasalubong shopping.']
            },
            {
                id: 'mayon',
                name: 'Majestic Mayon Volcano',
                location: 'Legazpi, Albay',
                region: 'Bicol Region',
                rating: '4.7',
                reviews: '730+ reviews',
                tag: 'World\'s Most Perfect Cone',
                category: 'nature',
                desc: 'The world-famous symmetrical stratovolcano rising 2,462 meters, ATV black lava wall adventures, and historic Cagsawa Ruins.',
                image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
                season: 'March – May (Clear View)',
                stay: '3 Days / 2 Nights',
                transportType: 'bus',
                transportText: 'Bicol Express Bus or Flight',
                bookHref: 'bus-booking.html',
                bookLabel: 'Book Bus to Bicol',
                highlights: ['Mayon ATV Lava Trail Tour', 'Cagsawa Ruins Belfry', 'Quitinday Green Hills Pocket Terraces', 'Bicol Express Spicy Culinary Tour'],
                itinerary: ['Day 1: Arrival in Legazpi, Cagsawa ruins sunset.', 'Day 2: Thrilling Mayon ATV drive to the 2006 lava front.', 'Day 3: Sumlang Lake balsa cruise & spicy Bicol feast.']
            }
        ];

        let currentActiveDest = 0;

        function selectDestination(index) {
            currentActiveDest = index;
            const dest = POPULAR_DESTINATIONS[index];
            if (!dest) return;

            // Animate Featured Card
            const img = document.getElementById('featured-dest-img');
            const title = document.getElementById('featured-dest-title');
            const loc = document.getElementById('featured-dest-location');
            const rating = document.getElementById('featured-dest-rating');
            const desc = document.getElementById('featured-dest-desc');
            const catText = document.getElementById('featured-dest-category-text');
            const transportText = document.getElementById('featured-dest-transport-text');
            const transportIcon = document.getElementById('featured-dest-transport-icon');
            const bookBtn = document.getElementById('featured-dest-book-btn');
            const bookLabel = document.getElementById('featured-dest-book-label');
            const bookIcon = document.getElementById('featured-dest-book-icon');
            const season = document.getElementById('featured-dest-season');

            if (img) {
                img.style.opacity = '0.3';
                img.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    img.src = dest.image;
                    img.alt = dest.name;
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                }, 150);
            }

            if (title) title.textContent = dest.name;
            if (loc) loc.textContent = dest.location;
            if (rating) rating.querySelector('span').textContent = dest.rating;
            if (desc) desc.textContent = dest.desc;
            if (catText) catText.textContent = dest.tag;
            if (transportText) transportText.textContent = dest.transportText;
            if (season) season.textContent = `Best: ${dest.season.split('(')[0]}`;

            if (transportIcon) {
                transportIcon.className = dest.transportType === 'flight' ? 'fas fa-plane text-xs' : 'fas fa-bus text-xs';
            }

            if (bookBtn && bookLabel) {
                bookBtn.href = dest.bookHref;
                bookLabel.textContent = dest.bookLabel;
                if (bookIcon) {
                    bookIcon.className = dest.transportType === 'flight' ? 'fas fa-plane text-xs text-blue-300' : 'fas fa-bus text-xs text-red-300';
                }
            }

            // Update Quick Filter Pills
            for (let i = 0; i < 4; i++) {
                const pill = document.getElementById(`pill-dest-${i}`);
                if (pill) {
                    if (i === index) {
                        pill.className = "dest-quick-pill px-3.5 py-1.5 rounded-full border border-blue-600 bg-blue-600 text-white font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer";
                    } else {
                        pill.className = "dest-quick-pill px-3.5 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600 transition flex items-center gap-1.5 cursor-pointer";
                    }
                }
            }

            // Update Right Stack Cards Active Highlight
            for (let i = 1; i <= 3; i++) {
                const c = document.getElementById(`dest-card-${i}`);
                const b = document.getElementById(`badge-viewing-${i}`);
                if (c) {
                    if (i === index) {
                        c.className = "dest-item-card flex items-center gap-4 sm:gap-5 group cursor-pointer flex-1 bg-blue-50/70 border-2 border-blue-600 rounded-2xl p-3 sm:p-3.5 transition-all duration-300 shadow-md ring-2 ring-blue-500/20";
                        if (b) b.classList.remove('hidden');
                    } else {
                        c.className = "dest-item-card flex items-center gap-4 sm:gap-5 group cursor-pointer flex-1 bg-white hover:bg-blue-50/40 border-2 border-transparent hover:border-blue-200 rounded-2xl p-3 sm:p-3.5 transition-all duration-300 shadow-sm hover:shadow-md";
                        if (b) b.classList.add('hidden');
                    }
                }
            }
        }

        // Destination Detail Modal Controls
        function openDestinationModal(index) {
            const dest = ALL_DESTINATIONS[index] || POPULAR_DESTINATIONS[index] || POPULAR_DESTINATIONS[0];
            const modal = document.getElementById('destination-modal');
            const card = document.getElementById('destination-modal-card');
            if (!modal || !card) return;

            document.getElementById('dest-modal-img').src = dest.image;
            document.getElementById('dest-modal-title').textContent = dest.name;
            document.getElementById('dest-modal-location').querySelector('span').textContent = dest.location;
            document.getElementById('dest-modal-rating').textContent = dest.rating;
            document.getElementById('dest-modal-tag').textContent = dest.tag;
            document.getElementById('dest-modal-desc').textContent = dest.desc;
            document.getElementById('dest-modal-season').textContent = dest.season;
            document.getElementById('dest-modal-stay').textContent = dest.stay;
            document.getElementById('dest-modal-transport').textContent = dest.transportText;

            // Highlights
            const hList = document.getElementById('dest-modal-highlights');
            if (hList && dest.highlights) {
                hList.innerHTML = dest.highlights.map(h => `
                    <div class="flex items-start gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs text-gray-700">
                        <i class="fas fa-check-circle text-blue-600 text-xs mt-0.5 flex-shrink-0"></i>
                        <span>${h}</span>
                    </div>
                `).join('');
            }

            // Itinerary
            const itinList = document.getElementById('dest-modal-itinerary');
            if (itinList && dest.itinerary) {
                itinList.innerHTML = dest.itinerary.map(item => `
                    <li class="leading-relaxed">${item}</li>
                `).join('');
            }

            // Action Buttons
            const flightBtn = document.getElementById('dest-modal-flight-btn');
            const busBtn = document.getElementById('dest-modal-bus-btn');
            if (flightBtn) flightBtn.href = dest.transportType === 'flight' ? dest.bookHref : 'plane-booking.html';
            if (busBtn) busBtn.href = dest.transportType === 'bus' ? dest.bookHref : 'bus-booking.html';

            modal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
            modal.classList.add('flex', 'opacity-100', 'pointer-events-auto');
            setTimeout(() => {
                card.classList.remove('scale-95');
                card.classList.add('scale-100');
            }, 10);
        }

        function closeDestinationModal() {
            const modal = document.getElementById('destination-modal');
            const card = document.getElementById('destination-modal-card');
            if (!modal || !card) return;

            card.classList.remove('scale-100');
            card.classList.add('scale-95');
            modal.classList.remove('opacity-100', 'pointer-events-auto');
            modal.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }, 300);
        }

        // All Destinations Directory Modal Controls
        function openAllDestinationsModal() {
            const modal = document.getElementById('all-destinations-modal');
            const card = document.getElementById('all-destinations-modal-card');
            if (!modal || !card) return;

            renderDirectoryGrid('all');

            modal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
            modal.classList.add('flex', 'opacity-100', 'pointer-events-auto');
            setTimeout(() => {
                card.classList.remove('scale-95');
                card.classList.add('scale-100');
            }, 10);
        }

        function closeAllDestinationsModal() {
            const modal = document.getElementById('all-destinations-modal');
            const card = document.getElementById('all-destinations-modal-card');
            if (!modal || !card) return;

            card.classList.remove('scale-100');
            card.classList.add('scale-95');
            modal.classList.remove('opacity-100', 'pointer-events-auto');
            modal.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }, 300);
        }

        function filterDirectoryCategory(category, btnEl) {
            document.querySelectorAll('#directory-filter-tabs .dir-tab-btn').forEach(btn => {
                btn.className = "dir-tab-btn bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-xl transition cursor-pointer";
            });
            if (btnEl) {
                btnEl.className = "dir-tab-btn active bg-blue-600 text-white px-4 py-2 rounded-xl shadow-xs transition cursor-pointer";
            }
            renderDirectoryGrid(category);
        }

        function renderDirectoryGrid(category) {
            const container = document.getElementById('directory-cards-grid');
            if (!container) return;

            const list = category === 'all' ? ALL_DESTINATIONS : ALL_DESTINATIONS.filter(d => d.category === category);
            container.innerHTML = list.map((dest, i) => {
                const originalIndex = ALL_DESTINATIONS.findIndex(d => d.id === dest.id);
                return `
                    <div class="bg-white border border-gray-100 hover:border-blue-400 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col justify-between">
                        <div>
                            <div class="h-36 w-full overflow-hidden relative">
                                <img src="${dest.image}" alt="${dest.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                                <span class="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <i class="fas fa-star text-amber-400 text-[9px]"></i> ${dest.rating}
                                </span>
                                <span class="absolute top-2 right-2 ${dest.transportType === 'flight' ? 'bg-blue-600' : 'bg-red-600'} text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                                    ${dest.transportType === 'flight' ? '✈ Flight' : '🚌 Bus'}
                                </span>
                            </div>
                            <div class="p-4">
                                <h4 class="font-extrabold text-sm text-gray-900 group-hover:text-blue-600 transition mb-1">${dest.name}</h4>
                                <p class="text-[11px] text-gray-500 mb-2 flex items-center gap-1">
                                    <i class="fas fa-map-marker-alt text-gray-400 text-[10px]"></i> ${dest.location}
                                </p>
                                <p class="text-[11px] text-gray-600 line-clamp-2 leading-relaxed mb-3">${dest.desc}</p>
                            </div>
                        </div>
                        <div class="p-4 pt-0 flex items-center gap-2">
                            <button type="button" onclick="previewFromDirectory(${originalIndex})" class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold py-2 rounded-xl text-center transition cursor-pointer">
                                Preview
                            </button>
                            <button type="button" onclick="closeAllDestinationsModal(); openDestinationModal(${originalIndex});" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-xl text-center transition shadow-xs cursor-pointer">
                                Details ➔
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function previewFromDirectory(index) {
            closeAllDestinationsModal();
            if (index < 4) {
                selectDestination(index);
            } else {
                openDestinationModal(index);
            }
            const sec = document.getElementById('destinations');
            if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeVideoModal();
                closeDestinationModal();
                closeAllDestinationsModal();
                closePackageModal();
                closeAuthModal();
            }
        });


// ==========================================
// VACATION & TOUR PACKAGES ENGINE
// ==========================================

const VACATION_PACKAGES = [
    {
        "id": "boracay-escape",
        "name": "Boracay Ultimate Tropical Retreat",
        "destination": "Boracay Island, Aklan",
        "region": "Western Visayas",
        "category": "beach",
        "badge": "\ud83d\udd25 Best Seller",
        "badgeColor": "bg-rose-500 text-white",
        "duration": "3 Days / 2 Nights",
        "stayDays": 3,
        "stayNights": 2,
        "transportType": "flight",
        "transportBadge": "\u2708\ufe0f Roundtrip Flights Included",
        "resort": "Henann Crystal Sands 4\u2605 Beachfront Resort",
        "basePrice": 8499,
        "originalPrice": 11999,
        "discount": "Save 29%",
        "rating": "4.9",
        "reviewsCount": 318,
        "image": "images/boracay.jpg",
        "inclusions": [
            "Roundtrip Manila \u2013 Caticlan (MPH) Airfare",
            "3D2N Luxury Beachfront Resort Accommodation",
            "Daily International Buffet Breakfast",
            "Private VIP Speedboat & Caticlan Land Transfers",
            "Signature Island Hopping Tour with Crystal Kayak Photoshoot",
            "Sunset Paraw Sailing Experience along White Beach",
            "All Terminal, Environmental & Jetty Port Fees"
        ],
        "highlights": [
            "White Beach Stations 1, 2 & 3 Leisure",
            "Puka Shell Secluded Beach Visit",
            "Paraw Sunset Sail Cruise",
            "Crystal Kayak Instagram Photoshoot"
        ],
        "itinerary": [
            {
                "day": 1,
                "title": "Island Arrival & Sunset Cocktails",
                "desc": "Direct flight arrival at Caticlan Airport (MPH). Meet and greet by private coordinator. VIP speedboat transfer directly to Boracay Island. Check in at beachfront resort, enjoy welcome chilled coconut drink, and unwind with a sunset stroll along Station 1."
            },
            {
                "day": 2,
                "title": "Island Hopping & Paraw Sunset Sail",
                "desc": "Morning island hopping boat tour visiting Puka Shell Beach and Crocodile Island coral reef. Snorkeling with marine turtles. Seafood barbecue picnic lunch. Afternoon crystal kayak session followed by private Paraw sunset sailing."
            },
            {
                "day": 3,
                "title": "Morning Paddleboarding & Departure",
                "desc": "Hearty buffet breakfast at resort. Stand-up paddleboarding session or D'Mall souvenir shopping for dried mangoes and calamansi muffins. Check-out and private speedboat transfer back to Caticlan Airport for flight home."
            }
        ],
        "roomTiers": [
            {
                "id": "standard",
                "name": "Deluxe Garden View Room",
                "pricePerNight": 0,
                "desc": "Comfortable 36sqm room with private balcony"
            },
            {
                "id": "premier",
                "name": "Premier Beachfront Suite",
                "pricePerNight": 1600,
                "desc": "Direct ocean panorama with private sun deck"
            },
            {
                "id": "pool_villa",
                "name": "Executive Direct Pool Access Villa",
                "pricePerNight": 3200,
                "desc": "Step straight into the lagoon pool from your terrace"
            }
        ],
        "addons": [
            {
                "id": "scuba",
                "name": "Introductory Scuba Diving with Photos & Video",
                "price": 1800,
                "perPax": true
            },
            {
                "id": "ariel",
                "name": "Ariel's Point Cliff Diving & Snorkel Day Excursion",
                "price": 2200,
                "perPax": true
            },
            {
                "id": "insurance",
                "name": "Comprehensive Travel & Medical Baggage Insurance",
                "price": 450,
                "perPax": true
            }
        ]
    },
    {
        "id": "coron-odyssey",
        "name": "Coron & Palawan Island Odyssey",
        "destination": "Coron, Palawan",
        "region": "MIMAROPA",
        "category": "island",
        "badge": "\u2b50 Top Rated",
        "badgeColor": "bg-amber-500 text-white",
        "duration": "4 Days / 3 Nights",
        "stayDays": 4,
        "stayNights": 3,
        "transportType": "flight",
        "transportBadge": "\u2708\ufe0f Roundtrip Flights Included",
        "resort": "Two Seasons Coron Bayside Eco-Resort 4\u2605",
        "basePrice": 11999,
        "originalPrice": 15999,
        "discount": "Save 25%",
        "rating": "4.9",
        "reviewsCount": 285,
        "image": "images/coron.jpg",
        "inclusions": [
            "Roundtrip Manila \u2013 Busuanga (USU) Airfare",
            "4D3N Bayside Eco-Resort Bayview Room",
            "Daily Plated Continental Breakfast",
            "Coron Ultimate Island Hopping Private Tour",
            "Kayangan Lake & Twin Lagoon VIP Eco-Permits",
            "Maquinit Saltwater Hot Springs Sunset Entry",
            "Roundtrip Airport Van Transfers & Tour Life Vests"
        ],
        "highlights": [
            "Kayangan Lake (Cleanest lake in Asia)",
            "Twin Lagoon limestone swimming passage",
            "Skeleton Wreck snorkel reef",
            "Maquinit therapeutic hot spring soak"
        ],
        "itinerary": [
            {
                "day": 1,
                "title": "Touchdown in Paradise & Hot Springs",
                "desc": "Morning flight touchdown at Busuanga Airport (USU). Scenic 35-minute van transfer through pasture lands to Coron town. Check-in and relax. Late afternoon trip to Mount Tapyas 724-step panoramic summit, followed by a warm soak in Maquinit Natural Saltwater Hot Springs."
            },
            {
                "day": 2,
                "title": "Coron Ultimate Island Hopping Expedition",
                "desc": "Board motorized outrigger banca for the world-renowned Coron Island circuit. Hike the wooden steps to view Kayangan Lake, swim beneath the limestone archway of Twin Lagoon, snorkel over the sunken Skeleton Wreck, and feast on a freshly grilled seafood lunch."
            },
            {
                "day": 3,
                "title": "Secluded Island Escapade",
                "desc": "Cruise to the outer Calamian islands: powdery Malcapuya Island, Banana Island, and the shallow turquoise sandbar of Bulog Dos. Relax on hammocks and enjoy peaceful tropical isolation. Free evening to dine at Coron Harbor."
            },
            {
                "day": 4,
                "title": "Cashew Factory & Return Flight",
                "desc": "Breakfast by the bayside pool. Quick visit to Coron Harvest for roasted garlic cashews and souvenirs. Airport shuttle to Busuanga Airport for your scenic flight back to Manila."
            }
        ],
        "roomTiers": [
            {
                "id": "standard",
                "name": "Bayside Deluxe Room",
                "pricePerNight": 0,
                "desc": "Spacious eco-chic room overlooking the gardens"
            },
            {
                "id": "premier",
                "name": "Waterfront Panoramic Suite",
                "pricePerNight": 1900,
                "desc": "Direct balcony overlooking Coron Bay and limestone islands"
            },
            {
                "id": "pool_villa",
                "name": "Overwater Sunset Bungalow",
                "pricePerNight": 4500,
                "desc": "Private overwater stilt bungalow with glass floor viewing panel"
            }
        ],
        "addons": [
            {
                "id": "calauit",
                "name": "Calauit Safari Park Giraffe Feeding Safari",
                "price": 2800,
                "perPax": true
            },
            {
                "id": "barracuda",
                "name": "Barracuda Lake Deep Thermocline Dive Experience",
                "price": 2400,
                "perPax": true
            },
            {
                "id": "insurance",
                "name": "Comprehensive Travel & Medical Baggage Insurance",
                "price": 450,
                "perPax": true
            }
        ]
    },
    {
        "id": "baguio-banaue",
        "name": "Baguio & Banaue Highland Heritage Expedition",
        "destination": "Baguio & Banaue, Northern Luzon",
        "region": "Cordillera",
        "category": "highland",
        "badge": "\ud83c\udf32 Highland Favorite",
        "badgeColor": "bg-emerald-600 text-white",
        "duration": "3 Days / 2 Nights",
        "stayDays": 3,
        "stayNights": 2,
        "transportType": "bus",
        "transportBadge": "\ud83d\ude8c Roundtrip Deluxe Bus Included",
        "resort": "The Manor at Camp John Hay & Banaue Heritage Lodge",
        "basePrice": 5899,
        "originalPrice": 7999,
        "discount": "Save 26%",
        "rating": "4.8",
        "reviewsCount": 190,
        "image": "images/banaue.jpg",
        "inclusions": [
            "Roundtrip Victory Liner Deluxe Bus (Reclining Lazyboy Seats)",
            "3D2N Mountain Forest View Lodge Accommodation",
            "Daily Benguet Farm-to-Table Breakfast",
            "Private Highland Van Tour: Camp John Hay & Mines View",
            "Banaue Rice Terraces UNESCO Heritage Viewpoint Excursion",
            "La Trinidad Organic Strawberry Farm Visit",
            "Licensed Native Ifugao Cultural Tour Guide"
        ],
        "highlights": [
            "Banaue 2,000-Year-Old Rice Terraces",
            "Camp John Hay Pine Tree Nature Trail",
            "Strawberry Picking in La Trinidad",
            "Good Shepherd Ube Jam & Benguet Coffee"
        ],
        "itinerary": [
            {
                "day": 1,
                "title": "Ascent to the City of Pines",
                "desc": "Morning departure from Manila aboard Victory Liner Deluxe Bus with onboard restroom and WiFi. Scenic mountain ascent via Aspiras-Palispis Highway. Check-in at Camp John Hay. Stroll through the Bell Amphitheater and enjoy hearty dinner at Session Road."
            },
            {
                "day": 2,
                "title": "Banaue UNESCO Terraces & Ifugao Village",
                "desc": "Early scenic drive through the Cordillera mountain ridges toward Banaue. Marvel at the 2,000-year-old carved emerald stairways to heaven. Meet traditional weavers and woodcarvers. Afternoon return with photo stop at La Trinidad Strawberry Valley."
            },
            {
                "day": 3,
                "title": "Baguio Market Shopping & Departure",
                "desc": "Highland breakfast with fresh strawberries and mountain coffee. Visit Baguio Public Market and Good Shepherd Convent for authentic ube jam, peanut brittle, and hand-woven blankets. Board late afternoon luxury coach back to Manila."
            }
        ],
        "roomTiers": [
            {
                "id": "standard",
                "name": "Superior Pine View Room",
                "pricePerNight": 0,
                "desc": "Crisp mountain air with panoramic pine forest views"
            },
            {
                "id": "premier",
                "name": "Camp John Hay Forest Suite",
                "pricePerNight": 1400,
                "desc": "Wood-burning fireplace and private sun deck"
            },
            {
                "id": "pool_villa",
                "name": "Traditional Cordillera Mountain Chalet",
                "pricePerNight": 2800,
                "desc": "Authentic pine-timber chalet with sprawling mountain terrace"
            }
        ],
        "addons": [
            {
                "id": "pulag",
                "name": "Mount Pulag Sea of Clouds Sunrise Side-Excursion",
                "price": 2900,
                "perPax": true
            },
            {
                "id": "igorot",
                "name": "Igorot Traditional Costume Cultural Photoshoot",
                "price": 350,
                "perPax": true
            },
            {
                "id": "insurance",
                "name": "Comprehensive Travel & Trip Delay Insurance",
                "price": 350,
                "perPax": true
            }
        ]
    },
    {
        "id": "siargao-adventure",
        "name": "Siargao Surf, Lagoon & Island Explorer",
        "destination": "Siargao Island, Surigao del Norte",
        "region": "Caraga",
        "category": "adventure",
        "badge": "\ud83c\udfc4 Adventure Pick",
        "badgeColor": "bg-teal-600 text-white",
        "duration": "4 Days / 3 Nights",
        "stayDays": 4,
        "stayNights": 3,
        "transportType": "flight",
        "transportBadge": "\u2708\ufe0f Roundtrip Flights Included",
        "resort": "Kermit Siargao Surf Resort & Boutique Villas 4\u2605",
        "basePrice": 13499,
        "originalPrice": 17500,
        "discount": "Save 23%",
        "rating": "4.9",
        "reviewsCount": 215,
        "image": "images/siargao.jpg",
        "inclusions": [
            "Roundtrip Manila \u2013 Sayak Siargao (IAO) Airfare",
            "4D3N Boutique Eco-Resort Villa Stay",
            "Daily Tropical Fruit Bowls & Artisanal Breakfast",
            "Private 2-Hour Surfing Lesson with Certified Instructor & Board",
            "Tri-Island Boat Tour: Naked, Daku & Guyam Islands with Seafood Lunch",
            "Sugba Lagoon Stand-Up Paddleboarding & Diving Board Pass",
            "Airport Roundtrip Transfers & Island Tourism Fees"
        ],
        "highlights": [
            "Cloud 9 Iconic Surfing Boardwalk",
            "Sugba Lagoon Turquoise Diving & Kayak",
            "Magpupungko Natural Tidal Pools",
            "Naked, Daku & Guyam Tri-Island Hopping"
        ],
        "itinerary": [
            {
                "day": 1,
                "title": "Welcome to the Surfing Capital",
                "desc": "Touch down at Sayak Airport (IAO). Enjoy the iconic drive bordered by thousands of coconut palms into General Luna. Check in at your tropical eco-villa. Catch the golden hour at Cloud 9 wooden pier and sample authentic woodfired pizza."
            },
            {
                "day": 2,
                "title": "Tri-Island Hopping & Surfing Lesson",
                "desc": "Morning banca boat tour hopping between Naked Island's pure white sandbar, Daku Island for a fresh grilled seafood boodle fight under palm trees, and Guyam Island. Afternoon 1-on-1 surf coaching on gentle beginner waves."
            },
            {
                "day": 3,
                "title": "Sugba Lagoon & Magpupungko Pools",
                "desc": "Cruise through lush mangrove canals to Sugba Lagoon. Leap off the famous wooden diving board and paddleboard across serene emerald waters. Continue to Magpupungko Rock Pools during low tide for natural cliff swimming."
            },
            {
                "day": 4,
                "title": "Island Cafe Hopping & Departure",
                "desc": "Morning acai bowls along Tourism Road. Pick up handmade coconut crafts and local surf merchandise. Private van shuttle back to Sayak Airport for your flight back to Manila."
            }
        ],
        "roomTiers": [
            {
                "id": "standard",
                "name": "Tropical Garden Bungalow",
                "pricePerNight": 0,
                "desc": "Charming native nipa-style bungalow with open-air rainfall shower"
            },
            {
                "id": "premier",
                "name": "Oceanview Coconut Loft",
                "pricePerNight": 1750,
                "desc": "Second-floor mezzanine overlooking coconut palms and reef"
            },
            {
                "id": "pool_villa",
                "name": "Private Plunge Pool Luxury Villa",
                "pricePerNight": 3800,
                "desc": "Exclusive secluded villa with personal plunge pool and daybed"
            }
        ],
        "addons": [
            {
                "id": "sohoton",
                "name": "Sohoton Cove Stingless Jellyfish Sanctuary Tour",
                "price": 2600,
                "perPax": true
            },
            {
                "id": "surf_rental",
                "name": "3-Day Unlimited Surfboard Rental Package",
                "price": 1200,
                "perPax": true
            },
            {
                "id": "insurance",
                "name": "Comprehensive Travel & Sports Baggage Insurance",
                "price": 450,
                "perPax": true
            }
        ]
    },
    {
        "id": "siquijor-haven",
        "name": "Siquijor Enchanted Waterfalls & Coastal Haven",
        "destination": "Siquijor Island & Dumaguete",
        "region": "Central Visayas",
        "category": "adventure",
        "badge": "\ud83d\udca6 Eco Discovery",
        "badgeColor": "bg-cyan-600 text-white",
        "duration": "3 Days / 2 Nights",
        "stayDays": 3,
        "stayNights": 2,
        "transportType": "flight",
        "transportBadge": "\u2708\ufe0f Flights & Fast Ferry Included",
        "resort": "Coco Grove Beach Resort & Spa 4\u2605",
        "basePrice": 7999,
        "originalPrice": 10500,
        "discount": "Save 24%",
        "rating": "4.8",
        "reviewsCount": 160,
        "image": "images/waterfall.jpg",
        "inclusions": [
            "Roundtrip Flight to Dumaguete (DGT) + OceanJet Ferry to Siquijor",
            "3D2N Tropical Beachfront Resort Accommodation",
            "Daily Seaside Breakfast Buffet",
            "Full Island Coastal Tour: Cambugahay Falls & Balete Tree",
            "Tubod Marine Sanctuary Snorkeling Pass & Gear",
            "Salagdoong Cliff Jump Beach Pass",
            "All Port Transfers, Van Transportation & Entrance Fees"
        ],
        "highlights": [
            "Cambugahay 3-Tiered Turquoise Waterfall",
            "400-Year-Old Old Enchanted Balete Tree",
            "Paliton Beach Fiery Sunsets",
            "Tubod Marine Sanctuary Giant Clam Snorkeling"
        ],
        "itinerary": [
            {
                "day": 1,
                "title": "Ferry Crossing & Paliton Sunset",
                "desc": "Fly into Dumaguete (DGT) and board the 45-minute OceanJet fast craft to Siquijor Island. Check-in at Coco Grove Beach Resort along San Juan coastline. Relax under leaning coconut palms at Paliton Beach as the sun sets over the Visayan Sea."
            },
            {
                "day": 2,
                "title": "Cambugahay Falls & Heritage Circuit",
                "desc": "Cool off at the 3-tiered cascading turquoise waters of Cambugahay Falls with thrilling Tarzan rope swings. Visit the 400-year-old mystical Balete Tree for a natural fish spa, and head to Salagdoong Beach for scenic cliff leaps."
            },
            {
                "day": 3,
                "title": "Marine Sanctuary Snorkel & Return",
                "desc": "Morning snorkel right outside your resort at Tubod Marine Sanctuary among giant clams and vibrant coral fish. Check-out, fast ferry back to Dumaguete, and afternoon flight back to Manila."
            }
        ],
        "roomTiers": [
            {
                "id": "standard",
                "name": "Heritage Garden Room",
                "pricePerNight": 0,
                "desc": "Surrounded by lush orchids and manicured tropical grounds"
            },
            {
                "id": "premier",
                "name": "Sunset Beachfront Suite",
                "pricePerNight": 1500,
                "desc": "Steps away from powdery white sand with direct ocean views"
            },
            {
                "id": "pool_villa",
                "name": "Coco Grove Private Family Villa",
                "pricePerNight": 3100,
                "desc": "Two-bedroom private sanctuary with personal whirlpool jacuzzi"
            }
        ],
        "addons": [
            {
                "id": "apo",
                "name": "Apo Island Wild Sea Turtle Snorkel Expedition",
                "price": 2200,
                "perPax": true
            },
            {
                "id": "healing",
                "name": "Traditional Siquijor Herbal Healing & Hilot Massage",
                "price": 900,
                "perPax": true
            },
            {
                "id": "insurance",
                "name": "Comprehensive Travel & Trip Delay Insurance",
                "price": 350,
                "perPax": true
            }
        ]
    },
    {
        "id": "cebu-bohol",
        "name": "Cebu & Bohol Twin Island Wonder Vacation",
        "destination": "Cebu & Bohol, Central Visayas",
        "region": "Central Visayas",
        "category": "island",
        "badge": "\ud83c\udf1f Twin Island Bundle",
        "badgeColor": "bg-indigo-600 text-white",
        "duration": "4 Days / 3 Nights",
        "stayDays": 4,
        "stayNights": 3,
        "transportType": "flight",
        "transportBadge": "\u2708\ufe0f Flights & Fastcraft Ferry Included",
        "resort": "Mactan Bayside Hotel & Bohol Beach Club 4\u2605",
        "basePrice": 12750,
        "originalPrice": 16900,
        "discount": "Save 25%",
        "rating": "4.9",
        "reviewsCount": 340,
        "image": "images/cebu_bohol.jpg",
        "inclusions": [
            "Roundtrip Manila \u2013 Cebu Mactan (CEB) Airfare",
            "OceanJet Fast Ferry Roundtrip Tickets to Bohol",
            "4D3N 4-Star Resort Accommodation (1N Cebu, 2N Bohol)",
            "Oslob Whale Shark Snorkel & Tumalog Falls Tour",
            "Bohol Countryside Tour: Chocolate Hills & Tarsier Sanctuary",
            "Loboc River Floating Restaurant Buffet Lunch with Live Music",
            "All Private AC Van Transfers & Tour Permits"
        ],
        "highlights": [
            "UNESCO Chocolate Hills 1,268 Conical Mounds",
            "Philippine Tarsier Sanctuary Visit",
            "Oslob Whale Shark Swimming Encounter",
            "Loboc River Rainforest Floating Lunch"
        ],
        "itinerary": [
            {
                "day": 1,
                "title": "Cebu Heritage & Lechon Welcome",
                "desc": "Arrive at Mactan-Cebu International Airport (CEB). Check-in and enjoy authentic Cebu lechon for lunch. Tour Magellan's Cross, Basilica del Santo Ni\u00f1o, and scenic Temple of Leah. Rest early for south tour."
            },
            {
                "day": 2,
                "title": "Whale Shark Encounter & Ferry to Bohol",
                "desc": "Early morning drive to Oslob for an ethical snorkeling encounter with gentle whale sharks. Marvel at the sheer beauty of Tumalog Falls. Return to Cebu port and take the 2-hour fast ferry to Tagbilaran, Bohol. Check-in at Panglao beachfront resort."
            },
            {
                "day": 3,
                "title": "Bohol Countryside & Chocolate Hills",
                "desc": "Ascend to the viewing terrace overlooking the iconic Chocolate Hills. See the world's smallest primates at the Philippine Tarsier Sanctuary. Board a covered riverboat on Loboc River for a traditional Filipino buffet lunch and cultural folk dancing."
            },
            {
                "day": 4,
                "title": "Panglao Beach Morning & Departure",
                "desc": "Morning beach swim on Panglao's famous white sands. Pick up Bohol peanut kisses. Fast ferry back to Cebu City and transfer to Mactan Airport for your flight home."
            }
        ],
        "roomTiers": [
            {
                "id": "standard",
                "name": "Superior Resort Room",
                "pricePerNight": 0,
                "desc": "Contemporary island room with garden views"
            },
            {
                "id": "premier",
                "name": "Panglao Beachfront Suite",
                "pricePerNight": 1850,
                "desc": "Steps from the water with private sea balcony"
            },
            {
                "id": "pool_villa",
                "name": "Private Coral Pool Villa",
                "pricePerNight": 3600,
                "desc": "Exclusive villa with private pool in secluded coconut grove"
            }
        ],
        "addons": [
            {
                "id": "canyoneering",
                "name": "Kawasan Falls Full-Day Canyoneering Adventure",
                "price": 2500,
                "perPax": true
            },
            {
                "id": "balicasag",
                "name": "Balicasag Island Dolphin Watching & Sea Turtle Dive",
                "price": 2100,
                "perPax": true
            },
            {
                "id": "insurance",
                "name": "Comprehensive Travel & Medical Baggage Insurance",
                "price": 450,
                "perPax": true
            }
        ]
    }
];

let activePackageCategory = 'all';
let currentPackage = null;
let packageAdults = 2;
let packageChildren = 0;
let selectedRoomTier = 'standard';
let selectedAddons = new Set();
let lastBookedPackageData = null;

// Real-Time Vacation Packages Integration with Admin Console
function getClientVacationPackages() {
    let adminPackages = null;
    try {
        const stored = localStorage.getItem('mckanes_admin_packages');
        if (stored) adminPackages = JSON.parse(stored);
    } catch (e) {
        console.warn('Error reading admin packages', e);
    }

    if (!Array.isArray(adminPackages) || adminPackages.length === 0) {
        return VACATION_PACKAGES;
    }

    // Map authoritative adminPackages: preserves admin ordering, live additions & removals
    return adminPackages.map(ap => {
        if (!ap) return null;

        // Check if ap corresponds to one of the seed VACATION_PACKAGES
        const basePkg = VACATION_PACKAGES.find(bp => {
            if (bp.id === ap.id || bp.id === ap.altId) return true;
            const apDest = (ap.destination || '').toLowerCase();
            const bpDest = (bp.destination || '').toLowerCase();
            const apId = (ap.id || '').toLowerCase();
            const bpId = (bp.id || '').toLowerCase();

            if (apId.includes('boracay') && (bpId.includes('boracay') || bpDest.includes('boracay'))) return true;
            if (apId.includes('coron') && (bpId.includes('coron') || bpDest.includes('coron'))) return true;
            if ((apId.includes('banaue') || apId.includes('baguio')) && (bpId.includes('banaue') || bpId.includes('baguio') || bpDest.includes('banaue') || bpDest.includes('baguio'))) return true;
            if (apId.includes('siargao') && (bpId.includes('siargao') || bpDest.includes('siargao'))) return true;
            if (apId.includes('siquijor') && (bpId.includes('siquijor') || bpDest.includes('siquijor'))) return true;
            if ((apId.includes('cebu') || apId.includes('bohol')) && (bpId.includes('cebu') || bpId.includes('bohol') || bpDest.includes('cebu') || bpDest.includes('bohol'))) return true;

            return false;
        });

        if (basePkg) {
            const newPrice = Number(ap.price || ap.basePrice || basePkg.basePrice);
            const newOrigPrice = Number(ap.originalPrice || basePkg.originalPrice);
            let discountText = ap.discount || basePkg.discount;
            if (newOrigPrice > newPrice && newOrigPrice > 0) {
                const pct = Math.round(((newOrigPrice - newPrice) / newOrigPrice) * 100);
                discountText = `Save ${pct}%`;
            }

            return {
                ...basePkg,
                ...ap,
                id: ap.id || basePkg.id,
                altId: ap.altId || basePkg.id,
                name: ap.name || basePkg.name,
                destination: ap.destination || basePkg.destination,
                duration: ap.duration || basePkg.duration,
                basePrice: newPrice,
                price: newPrice,
                originalPrice: newOrigPrice,
                discount: discountText,
                status: ap.status || 'Active',
                booked: ap.booked !== undefined ? ap.booked : (basePkg.booked || 0),
                capacity: ap.capacity !== undefined ? ap.capacity : (basePkg.capacity || 30),
                image: ap.image || basePkg.image
            };
        }

        // Custom Destination / Tour Package created by Administrator
        const price = Number(ap.price || ap.basePrice || 7999);
        const origPrice = Number(ap.originalPrice || Math.round(price * 1.35));
        let discount = ap.discount;
        if (!discount && origPrice > price) {
            const pct = Math.round(((origPrice - price) / origPrice) * 100);
            discount = `Save ${pct}%`;
        }

        let category = ap.category || 'beach';
        let badge = ap.badge || '✨ Featured Destination';
        let badgeColor = ap.badgeColor || 'bg-blue-600 text-white';
        if (category === 'beach' && !ap.badgeColor) {
            badgeColor = 'bg-cyan-600 text-white';
            badge = '🏖️ Tropical Beach';
        } else if (category === 'highland' && !ap.badgeColor) {
            badgeColor = 'bg-emerald-600 text-white';
            badge = '⛰️ Mountain Escape';
        } else if (category === 'adventure' && !ap.badgeColor) {
            badgeColor = 'bg-amber-600 text-white';
            badge = '🧭 Heritage Tour';
        }

        const transport = ap.transport || 'Flights Included';
        const isFlight = transport.toLowerCase().includes('flight');
        const stayDays = ap.stayDays || 3;
        const stayNights = ap.stayNights || 2;

        return {
            id: ap.id,
            altId: ap.id,
            name: ap.name,
            destination: ap.destination,
            region: ap.region || 'Philippines',
            category: category,
            badge: badge,
            badgeColor: badgeColor,
            duration: ap.duration || `${stayDays} Days / ${stayNights} Nights`,
            stayDays: stayDays,
            stayNights: stayNights,
            transport: transport,
            transportType: isFlight ? 'flight' : 'bus',
            transportBadge: ap.transportBadge || (isFlight ? '✈️ Roundtrip Flights Included' : '🚌 Deluxe Bus Included'),
            resort: ap.resort || `${ap.destination} Heritage Resort & Suites`,
            basePrice: price,
            price: price,
            originalPrice: origPrice,
            discount: discount || 'Special Promo',
            rating: ap.rating || '4.9',
            reviewsCount: ap.reviewsCount || 48,
            image: ap.image || 'images/place1.jpg',
            inclusions: Array.isArray(ap.inclusions) && ap.inclusions.length > 0 ? ap.inclusions : [
                transport,
                `${stayDays}D${stayNights}N Accommodation at ${ap.resort || ap.destination}`,
                'Daily Complimentary Breakfast',
                'Airport / Terminal Land Transfers',
                'Full Itinerary Guided Sightseeing & Eco-Tours',
                'All Environmental, Terminal & Entry Fees'
            ],
            highlights: Array.isArray(ap.highlights) && ap.highlights.length > 0 ? ap.highlights : [
                `${ap.destination} Scenic Highlights`,
                'Curated Local Culture & Heritage Tour',
                'Scenic Photo Opportunities & Viewpoints',
                'Dedicated Mckanes Tour Guide & Assistance'
            ],
            itinerary: Array.isArray(ap.itinerary) && ap.itinerary.length > 0 ? ap.itinerary : [
                {
                    day: 1,
                    title: `Arrival & Welcome to ${ap.destination}`,
                    desc: `Arrival via ${transport}. Welcome greeting by Mckanes tour coordinator, private transfer to resort, check-in, welcome refreshments, and relaxed leisure evening.`
                },
                {
                    day: 2,
                    title: `Full-Day Highlights & Guided Expedition`,
                    desc: `Comprehensive guided day tour exploring iconic viewpoints, scenic landmarks, and local artisan shops with lunch included.`
                },
                {
                    day: 3,
                    title: `Leisure Morning & Return Transit`,
                    desc: `Enjoy breakfast at the resort, free leisure time for souvenir shopping and photography, followed by scheduled transfer for your return journey.`
                }
            ],
            roomTiers: Array.isArray(ap.roomTiers) && ap.roomTiers.length > 0 ? ap.roomTiers : [
                { id: 'standard', name: 'Deluxe Room', pricePerNight: 0, desc: 'King or Twin beds with balcony & pool view' },
                { id: 'suite', name: 'Executive Suite', pricePerNight: 2800, desc: 'Spacious suite with panoramic views & lounge access' },
                { id: 'villa', name: 'Private Pool Villa', pricePerNight: 5500, desc: 'Exclusive private plunge pool & dedicated butler' }
            ],
            addons: Array.isArray(ap.addons) && ap.addons.length > 0 ? ap.addons : [
                { id: 'travel_insurance', name: 'Comprehensive Travel Insurance', price: 450 },
                { id: 'airport_vip', name: 'VIP Fast-Track & Private Van', price: 1200 },
                { id: 'photo_package', name: 'Drone & DSLR Photography Pass', price: 1800 }
            ],
            status: ap.status || 'Active',
            booked: ap.booked !== undefined ? ap.booked : 0,
            capacity: ap.capacity !== undefined ? ap.capacity : 25
        };
    }).filter(Boolean);
}

function renderPackageCards(category = 'all') {
    const grid = document.getElementById('packages-cards-grid');
    if (!grid) return;

    activePackageCategory = category;
    const allPackages = getClientVacationPackages();

    // Dynamically update the count on the All Packages filter button
    const allBtn = document.querySelector(".pkg-filter-btn[onclick*=\"'all'\"]");
    if (allBtn) {
        allBtn.innerHTML = `All Packages (${allPackages.length})`;
    }

    const filtered = category === 'all' 
        ? allPackages 
        : allPackages.filter(p => p.category === category);

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner">
                    <i class="fas fa-map-location-dot"></i>
                </div>
                <h4 class="font-extrabold text-base text-gray-900 mb-1">No Vacation Packages Found</h4>
                <p class="text-xs text-gray-500 max-w-sm mx-auto">There are currently no tour packages in this category. Check back soon for new destinations!</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(pkg => {
        const isPaused = pkg.status === 'Paused';
        return `
            <div class="package-card bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col justify-between group">
                <div>
                    <!-- Image Container with Badges -->
                    <div class="relative h-52 sm:h-56 w-full overflow-hidden">
                        <img src="${pkg.image}" alt="${pkg.name}" class="package-img w-full h-full object-cover">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
                        
                        <!-- Top Badges -->
                        <div class="absolute top-3 left-3 right-3 flex items-center justify-between">
                            <span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm ${isPaused ? 'bg-amber-500 text-white' : pkg.badgeColor}">
                                ${isPaused ? '⏸ Temporarily Paused' : pkg.badge}
                            </span>
                            <span class="bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                <i class="fas fa-clock text-amber-400 text-[10px]"></i> ${pkg.duration.split('/')[0].trim()}
                            </span>
                        </div>

                        <!-- Bottom Image Info Bar -->
                        <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                            <span class="bg-blue-600/90 backdrop-blur-xs text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                                ${pkg.transportBadge}
                            </span>
                            <span class="bg-white/20 backdrop-blur-md text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                <i class="fas fa-star text-amber-300"></i> ${pkg.rating} (${pkg.reviewsCount})
                            </span>
                        </div>
                    </div>

                    <!-- Card Body -->
                    <div class="p-5 sm:p-6">
                        <span class="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                            <i class="fas fa-map-marker-alt text-blue-500 mr-1"></i> ${pkg.destination}
                        </span>
                        <h3 class="text-lg font-black text-gray-900 group-hover:text-blue-600 transition leading-snug mb-2">
                            ${pkg.name}
                        </h3>
                        <p class="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
                            <i class="fas fa-hotel text-gray-400"></i> ${pkg.resort}
                        </p>

                        <!-- Highlights Pills -->
                        <div class="space-y-1.5 mb-5 pb-4 border-b border-gray-100">
                            ${pkg.highlights.slice(0, 3).map(h => `
                                <div class="flex items-center gap-2 text-xs text-gray-600">
                                    <i class="fas fa-check text-emerald-500 text-[10px] flex-shrink-0"></i>
                                    <span class="truncate">${h}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Card Footer / Pricing & Actions -->
                <div class="p-5 sm:p-6 pt-0">
                    <div class="flex items-end justify-between mb-4">
                        <div>
                            <div class="flex items-center gap-2 text-[11px] text-gray-400">
                                <span class="line-through">₱${pkg.originalPrice.toLocaleString()}</span>
                                <span class="bg-emerald-50 text-emerald-700 font-black px-1.5 py-0.5 rounded text-[10px]">${pkg.discount}</span>
                            </div>
                            <div class="flex items-baseline gap-1">
                                <span class="text-2xl font-black text-gray-900">₱${pkg.basePrice.toLocaleString()}</span>
                                <span class="text-[11px] font-medium text-gray-500">/ person</span>
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="text-[10px] text-emerald-600 font-bold block bg-emerald-50/80 px-2 py-0.5 rounded-full">
                                Inclusions Guaranteed
                            </span>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                        <button type="button" onclick="openPackageModal('${pkg.id}', 'itinerary')" class="bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs py-2.5 rounded-xl transition text-center border border-gray-200/80 cursor-pointer">
                            View Itinerary
                        </button>
                        ${isPaused ? `
                        <button type="button" onclick="showAuthToast('Notice: This package is temporarily paused for seasonal reservations.', 'info'); openPackageModal('${pkg.id}', 'itinerary');" class="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2.5 rounded-xl transition text-center shadow-md shadow-amber-500/20 cursor-pointer">
                            Paused
                        </button>
                        ` : `
                        <button type="button" onclick="requireAuthToBook('package:${pkg.id}', event)" class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition text-center shadow-md shadow-blue-500/20 cursor-pointer">
                            Book Package ➔
                        </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterPackages(category, btn) {
    document.querySelectorAll('.pkg-filter-btn').forEach(b => {
        b.className = 'pkg-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer whitespace-nowrap bg-white text-gray-700 hover:bg-gray-100 border border-gray-200';
    });
    if (btn) {
        btn.className = 'pkg-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer whitespace-nowrap bg-blue-600 text-white';
    }
    renderPackageCards(category);
}

// =============================================================================
// PACKAGE BOOKING & TRAVELER ACCOUNT SYNCHRONIZATION ENGINE
// =============================================================================
function getSignedInTravelerForPackage() {
    // 1. Check active client session
    try {
        const rawUser = localStorage.getItem('mckanes_user');
        if (rawUser) {
            const u = JSON.parse(rawUser);
            if (u && (u.email || u.name)) {
                return u;
            }
        }
    } catch (e) {}

    // 2. Check active admin session
    try {
        const rawAdmin = localStorage.getItem('mckanes_admin_session');
        if (rawAdmin) {
            const a = JSON.parse(rawAdmin);
            if (a && a.email) {
                return {
                    name: a.name || 'Chibiba Mckanes',
                    email: a.email,
                    phone: a.phone || '+63 917 123 4567',
                    isAdmin: true
                };
            }
        }
    } catch (e) {}

    // 3. Check registered accounts repository
    try {
        const rawReg = localStorage.getItem('mckanes_registered_accounts');
        if (rawReg) {
            const list = JSON.parse(rawReg);
            if (Array.isArray(list) && list.length > 0) {
                const onlineUser = list.find(acc => acc && acc.isOnline && acc.email) || list[0];
                if (onlineUser) return onlineUser;
            }
        }
    } catch (e) {}

    // 4. Check admin customers directory
    try {
        const rawCust = localStorage.getItem('mckanes_admin_customers');
        if (rawCust) {
            const list = JSON.parse(rawCust);
            if (Array.isArray(list) && list.length > 0) {
                const real = list.find(c => c && c.email && !c.email.includes('juan.delacruz'));
                if (real) return real;
            }
        }
    } catch (e) {}

    return null;
}

function populatePackageTravelerFromAccount() {
    const user = getSignedInTravelerForPackage();
    const firstInput = document.getElementById('pkg-cust-first');
    const lastInput = document.getElementById('pkg-cust-last');
    const emailInput = document.getElementById('pkg-cust-email');
    const phoneInput = document.getElementById('pkg-cust-phone');
    const banner = document.getElementById('pkg-account-sync-banner');
    const badge = document.getElementById('pkg-account-badge');
    const avatarEl = document.getElementById('pkg-account-sync-avatar');
    const nameEl = document.getElementById('pkg-account-sync-name');
    const contactEl = document.getElementById('pkg-account-sync-contact');

    if (user) {
        let fName = user.firstName || '';
        let lName = user.lastName || '';
        if (!fName && user.name) {
            const parts = user.name.trim().split(/\s+/);
            fName = parts[0] || '';
            lName = parts.slice(1).join(' ') || '';
        }
        const email = user.email || '';
        const phone = user.phone || '+63 917 123 4567';

        if (firstInput && !firstInput.value) firstInput.value = fName;
        if (lastInput && !lastInput.value) lastInput.value = lName;
        if (emailInput && !emailInput.value) emailInput.value = email;
        if (phoneInput && !phoneInput.value) phoneInput.value = phone;

        if (banner) {
            banner.classList.remove('hidden');
            const fullName = user.name || `${fName} ${lName}`.trim() || 'Traveler';
            if (nameEl) nameEl.textContent = fullName;
            if (contactEl) contactEl.textContent = `${email} • ${phone}`;
            if (avatarEl) {
                const initials = fullName.split(/\s+/).map(p => p[0]).join('').slice(0, 2).toUpperCase() || 'TR';
                avatarEl.textContent = initials;
            }
        }
        if (badge) badge.classList.remove('hidden');
    } else {
        if (banner) banner.classList.add('hidden');
        if (badge) badge.classList.add('hidden');
    }
}

function openPackageModal(packageId, targetTab = 'itinerary') {
    const packagesList = getClientVacationPackages();
    const pkg = packagesList.find(p => p.id === packageId) || packagesList[0];
    currentPackage = pkg;
    packageAdults = 2;
    packageChildren = 0;
    selectedRoomTier = 'standard';
    selectedAddons.clear();

    const modal = document.getElementById('package-booking-modal');
    const card = document.getElementById('package-modal-card');
    if (!modal || !card) return;

    // Reset confirmation state
    document.getElementById('pkg-form-container').classList.remove('hidden');
    document.getElementById('pkg-confirmation-container').classList.add('hidden');

    // Populate Left Overview
    document.getElementById('pkg-modal-badge').textContent = pkg.badge;
    document.getElementById('pkg-modal-badge').className = `px-3 py-1 rounded-full text-xs font-bold ${pkg.badgeColor}`;
    document.getElementById('pkg-modal-title').textContent = pkg.name;
    document.getElementById('pkg-modal-subname').textContent = pkg.name;
    document.getElementById('pkg-modal-img').src = pkg.image;
    document.getElementById('pkg-modal-transport').textContent = pkg.transportBadge;
    document.getElementById('pkg-modal-duration').textContent = pkg.duration;
    document.getElementById('pkg-modal-resort').innerHTML = `<i class="fas fa-hotel"></i> ${pkg.resort}`;

    // Inclusions List
    document.getElementById('pkg-modal-inclusions').innerHTML = pkg.inclusions.map(inc => `
        <li class="flex items-start gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <i class="fas fa-check-circle text-emerald-500 mt-0.5 text-xs flex-shrink-0"></i>
            <span class="leading-tight">${inc}</span>
        </li>
    `).join('');

    // Itinerary Timeline
    document.getElementById('pkg-modal-itinerary').innerHTML = pkg.itinerary.map(item => `
        <div class="relative pl-6 pb-2">
            <div class="absolute -left-[25px] top-0 w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center shadow-sm">
                ${item.day}
            </div>
            <h6 class="font-extrabold text-sm text-gray-900 mb-1">${item.title}</h6>
            <p class="text-xs text-gray-600 leading-relaxed">${item.desc}</p>
        </div>
    `).join('');

    // Default Date to 7 days from now
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const dateInput = document.getElementById('pkg-input-date');
    if (dateInput) {
        dateInput.value = d.toISOString().split('T')[0];
        dateInput.min = new Date().toISOString().split('T')[0];
    }

    // Counters
    document.getElementById('pkg-adult-count').textContent = '2';
    document.getElementById('pkg-child-count').textContent = '0';

    // Room Tiers
    document.getElementById('pkg-room-tiers-container').innerHTML = pkg.roomTiers.map(tier => `
        <label class="block p-3 rounded-xl border ${tier.id === selectedRoomTier ? 'border-blue-600 bg-blue-50/60' : 'border-gray-200 bg-white hover:bg-gray-50'} cursor-pointer transition shadow-xs">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                    <input type="radio" name="pkg_room" value="${tier.id}" ${tier.id === selectedRoomTier ? 'checked' : ''} onchange="selectRoomTier('${tier.id}')" class="text-blue-600 focus:ring-blue-500">
                    <div>
                        <span class="text-xs font-bold text-gray-900 block">${tier.name}</span>
                        <span class="text-[10px] text-gray-500 block">${tier.desc}</span>
                    </div>
                </div>
                <span class="text-xs font-black text-gray-800">
                    ${tier.pricePerNight === 0 ? 'Included' : `+₱${tier.pricePerNight.toLocaleString()}/nt`}
                </span>
            </div>
        </label>
    `).join('');

    // Addons
    document.getElementById('pkg-addons-container').innerHTML = pkg.addons.map(addon => `
        <label class="block p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition shadow-xs">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                    <input type="checkbox" value="${addon.id}" onchange="toggleAddon('${addon.id}')" class="rounded text-blue-600 focus:ring-blue-500">
                    <span class="text-xs font-semibold text-gray-800">${addon.name}</span>
                </div>
                <span class="text-xs font-bold text-blue-600">
                    +₱${addon.price.toLocaleString()} ${addon.perPax ? '/pax' : ''}
                </span>
            </div>
        </label>
    `).join('');

    recalculatePackageTotal();
    populatePackageTravelerFromAccount();

    modal.classList.remove('hidden', 'opacity-0');
    setTimeout(() => {
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closePackageModal() {
    const modal = document.getElementById('package-booking-modal');
    const card = document.getElementById('package-modal-card');
    if (!modal || !card) return;

    card.classList.remove('scale-100');
    card.classList.add('scale-95');
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 200);
}

function changePax(type, delta) {
    if (type === 'adult') {
        packageAdults = Math.max(1, Math.min(12, packageAdults + delta));
        document.getElementById('pkg-adult-count').textContent = packageAdults;
    } else {
        packageChildren = Math.max(0, Math.min(10, packageChildren + delta));
        document.getElementById('pkg-child-count').textContent = packageChildren;
    }
    recalculatePackageTotal();
}

function selectRoomTier(tierId) {
    selectedRoomTier = tierId;
    if (!currentPackage) return;
    document.querySelectorAll('#pkg-room-tiers-container label').forEach(lbl => {
        const rad = lbl.querySelector('input[type="radio"]');
        if (rad && rad.value === tierId) {
            lbl.className = 'block p-3 rounded-xl border border-blue-600 bg-blue-50/60 cursor-pointer transition shadow-xs';
            rad.checked = true;
        } else {
            lbl.className = 'block p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition shadow-xs';
        }
    });
    recalculatePackageTotal();
}

function toggleAddon(addonId) {
    if (selectedAddons.has(addonId)) {
        selectedAddons.delete(addonId);
    } else {
        selectedAddons.add(addonId);
    }
    recalculatePackageTotal();
}

function recalculatePackageTotal() {
    if (!currentPackage) return;

    const baseAdult = currentPackage.basePrice * packageAdults;
    const baseChild = Math.round(currentPackage.basePrice * 0.70) * packageChildren;
    const baseTotal = baseAdult + baseChild;

    const tier = currentPackage.roomTiers.find(t => t.id === selectedRoomTier) || currentPackage.roomTiers[0];
    const roomCost = tier.pricePerNight * currentPackage.stayNights;

    let addonsCost = 0;
    currentPackage.addons.forEach(a => {
        if (selectedAddons.has(a.id)) {
            addonsCost += a.price * (a.perPax ? (packageAdults + packageChildren) : 1);
        }
    });

    const taxesFees = 300 * (packageAdults + packageChildren);
    const grandTotal = baseTotal + roomCost + addonsCost + taxesFees;

    const paxLabel = packageChildren > 0 
        ? `${packageAdults} Adult${packageAdults > 1 ? 's' : ''}, ${packageChildren} Child${packageChildren > 1 ? 'ren' : ''}`
        : `${packageAdults} Adult${packageAdults > 1 ? 's' : ''}`;

    const labelEl = document.getElementById('pkg-calc-pax-label');
    const baseEl = document.getElementById('pkg-calc-base');
    const roomEl = document.getElementById('pkg-calc-room');
    const addonsEl = document.getElementById('pkg-calc-addons');
    const feesEl = document.getElementById('pkg-calc-fees');
    const totalEl = document.getElementById('pkg-calc-total');

    if (labelEl) labelEl.textContent = paxLabel;
    if (baseEl) baseEl.textContent = `₱${baseTotal.toLocaleString()}`;
    if (roomEl) roomEl.textContent = roomCost > 0 ? `+₱${roomCost.toLocaleString()}` : '+₱0';
    if (addonsEl) addonsEl.textContent = addonsCost > 0 ? `+₱${addonsCost.toLocaleString()}` : '+₱0';
    if (feesEl) feesEl.textContent = `₱${taxesFees.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `₱${grandTotal.toLocaleString()}`;
}

function handlePackageBookingSubmit(e) {
    e.preventDefault();
    if (!currentPackage) return;

    const first = (document.getElementById('pkg-cust-first').value || '').trim();
    const last = (document.getElementById('pkg-cust-last').value || '').trim();
    const email = (document.getElementById('pkg-cust-email').value || '').trim();
    const phone = (document.getElementById('pkg-cust-phone').value || '').trim();
    const dateVal = document.getElementById('pkg-input-date').value;

    if (!first || !last || !email) {
        showAuthToast('Please enter your lead traveler name and email address.', 'error');
        return;
    }

    // Auto-establish traveler account session if guest
    let user = getStoredUser();
    if (!user) {
        user = {
            id: 'USER-' + Date.now(),
            name: `${first} ${last}`.trim(),
            firstName: first,
            lastName: last,
            email: email,
            phone: phone || '+63 917 123 4567',
            isAdmin: false,
            isOnline: true,
            createdAt: new Date().toISOString()
        };
        try {
            localStorage.setItem('mckanes_user', JSON.stringify(user));
            const rawReg = localStorage.getItem('mckanes_registered_accounts');
            let accounts = rawReg ? JSON.parse(rawReg) : [];
            const exists = accounts.find(a => a.email && a.email.toLowerCase() === email.toLowerCase());
            if (!exists) {
                accounts.unshift(user);
                localStorage.setItem('mckanes_registered_accounts', JSON.stringify(accounts));
            }
        } catch (err) {}
        renderAuthNav();
    }

    const tier = currentPackage.roomTiers.find(t => t.id === selectedRoomTier) || currentPackage.roomTiers[0];
    const totalText = document.getElementById('pkg-calc-total').textContent;
    const pnr = `BK-PKG-${Math.floor(100000 + Math.random() * 900000)}`;
    const numericAmount = Number(totalText.replace(/[^0-9]/g, '')) || currentPackage.price;

    const paxSummary = packageChildren > 0 
        ? `${packageAdults} Adults, ${packageChildren} Children`
        : `${packageAdults} Adults`;

    const nowIso = new Date().toISOString();

    const newBooking = {
        id: pnr,
        type: "package",
        title: currentPackage.name,
        customer: `${first} ${last}`.trim(),
        email: email,
        phone: phone || '+63 917 123 4567',
        date: dateVal,
        operator: `${currentPackage.resort} • ${tier.name}`,
        pax: packageAdults + packageChildren,
        amount: numericAmount,
        paymentMethod: "GCash / Online",
        status: "Confirmed",
        seat: `${paxSummary} • ${tier.name}`,
        cabin: "Guided Vacation",
        baggage: "All-Inclusive Tour Baggage + Transfers",
        notes: `Selected Room: ${tier.name}. Add-ons: ${Array.from(selectedAddons).join(', ') || 'None'}. Booked via main web portal.`,
        createdAt: nowIso
    };

    lastBookedPackageData = {
        pnr,
        leadName: `${first} ${last}`.trim(),
        email,
        phone: phone || '+63 917 123 4567',
        packageName: currentPackage.name,
        resort: `${currentPackage.resort} (${tier.name})`,
        travelDate: dateVal,
        guests: paxSummary,
        totalFare: totalText
    };

    // 1. Record booking in central admin database
    try {
        let bookings = [];
        const rawB = localStorage.getItem('mckanes_admin_bookings');
        if (rawB) {
            try { bookings = JSON.parse(rawB); } catch (err) {}
        }
        bookings.unshift(newBooking);
        localStorage.setItem('mckanes_admin_bookings', JSON.stringify(bookings));
    } catch (err) {
        console.error('Error saving package booking:', err);
    }

    // 2. Update booked slots in packages catalog
    try {
        const rawPkgs = localStorage.getItem('mckanes_admin_packages');
        let pkgs = rawPkgs ? JSON.parse(rawPkgs) : null;
        if (!pkgs) {
            pkgs = typeof DEFAULT_PACKAGES !== 'undefined' ? [...DEFAULT_PACKAGES] : [];
        }
        const targetPkg = pkgs.find(p => p.id === currentPackage.id || p.altId === currentPackage.id);
        if (targetPkg) {
            const currentBooked = Number(targetPkg.booked !== undefined ? targetPkg.booked : (targetPkg.bookedSlots || 0));
            const newBooked = currentBooked + (packageAdults + packageChildren);
            targetPkg.booked = newBooked;
            targetPkg.bookedSlots = newBooked;
            localStorage.setItem('mckanes_admin_packages', JSON.stringify(pkgs));
            window.dispatchEvent(new CustomEvent('packageDataUpdated', { detail: { packages: pkgs } }));
        }
    } catch (err) {}

    // 3. Update / Create Customer Record in Central Directory
    try {
        const rawC = localStorage.getItem('mckanes_admin_customers');
        let customers = rawC ? JSON.parse(rawC) : [];
        const bEmail = email.toLowerCase().trim();
        const bName = `${first} ${last}`.trim().toLowerCase();
        let cIdx = customers.findIndex(c => 
            (bEmail && c.email && c.email.toLowerCase().trim() === bEmail) ||
            (bName && c.name && c.name.toLowerCase().trim() === bName)
        );

        if (cIdx >= 0) {
            customers[cIdx].trips = (Number(customers[cIdx].trips) || 0) + 1;
            customers[cIdx].totalSpend = (Number(customers[cIdx].totalSpend) || 0) + numericAmount;
            customers[cIdx].lastActive = nowIso;
            customers[cIdx].isOnline = true;
            if (customers[cIdx].totalSpend >= 60000) customers[cIdx].tier = "Platinum VIP";
            else if (customers[cIdx].totalSpend >= 25000) customers[cIdx].tier = "Gold VIP";
            else if (customers[cIdx].totalSpend >= 10000) customers[cIdx].tier = "Silver";
        } else {
            customers.unshift({
                id: 'CUST-' + Math.floor(1000 + Math.random() * 9000),
                name: `${first} ${last}`.trim(),
                email: email,
                phone: phone || '+63 917 123 4567',
                trips: 1,
                totalSpend: numericAmount,
                tier: numericAmount >= 25000 ? 'Gold VIP' : numericAmount >= 10000 ? 'Silver' : 'Bronze',
                status: 'Active',
                lastActive: nowIso,
                isOnline: true
            });
        }
        localStorage.setItem('mckanes_admin_customers', JSON.stringify(customers));
    } catch (err) {}

    // 4. Record Admin Notification
    try {
        const rawN = localStorage.getItem('mckanes_admin_notifications');
        let notifs = rawN ? JSON.parse(rawN) : [];
        notifs.unshift({
            id: 'NOTIF-' + Date.now(),
            title: 'New Tour Package Booked',
            desc: `${first} ${last} confirmed ${currentPackage.name} (₱${numericAmount.toLocaleString()})`,
            time: 'Just now',
            type: 'booking',
            unread: true
        });
        localStorage.setItem('mckanes_admin_notifications', JSON.stringify(notifs.slice(0, 25)));
    } catch (err) {}

    // 5. Trigger cross-tab/window storage synchronization event
    try {
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'mckanes_admin_bookings',
            newValue: localStorage.getItem('mckanes_admin_bookings')
        }));
    } catch (err) {}

    showAuthToast(`🎉 Vacation Package Reserved! Ref: ${pnr}`, 'success');

    // Populate Voucher Card
    document.getElementById('voucher-ref-code').textContent = pnr;
    document.getElementById('voucher-pkg-name').textContent = currentPackage.name;
    document.getElementById('voucher-resort-name').textContent = `${currentPackage.resort} • ${tier.name}`;
    document.getElementById('voucher-lead-name').textContent = `${first} ${last}`.trim();
    try {
        document.getElementById('voucher-travel-date').textContent = new Date(dateVal + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (err) {
        document.getElementById('voucher-travel-date').textContent = dateVal;
    }
    document.getElementById('voucher-guests').textContent = paxSummary;
    document.getElementById('voucher-total-fare').textContent = totalText;

    document.getElementById('pkg-form-container').classList.add('hidden');
    document.getElementById('pkg-confirmation-container').classList.remove('hidden');
}

function resetPackageBookingForm() {
    closePackageModal();
    setTimeout(() => {
        const fc = document.getElementById('pkg-form-container');
        const cc = document.getElementById('pkg-confirmation-container');
        if (fc) fc.classList.remove('hidden');
        if (cc) cc.classList.add('hidden');
    }, 250);
}

function downloadPackageVoucher() {
    if (!lastBookedPackageData) return;
    const d = lastBookedPackageData;
    const text = `=====================================================
MCKANES TRAVEL AND TOURS - VACATION PACKAGE VOUCHER
=====================================================
Booking Reference : ${d.pnr}
Booking Status    : CONFIRMED & RESERVED
Issue Date        : ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

PACKAGE DETAILS
-----------------------------------------------------
Package Name      : ${d.packageName}
Resort / Stay     : ${d.resort}
Departure Date    : ${d.travelDate}
Party Size        : ${d.guests}

LEAD TRAVELER
-----------------------------------------------------
Passenger Name    : ${d.leadName}
Email Address     : ${d.email}
Phone Number      : ${d.phone}

PAYMENT SUMMARY
-----------------------------------------------------
Total Package Fare: ${d.totalFare}
Payment Status    : Verified / Reservation Deposit Logged

IMPORTANT NOTICE:
Please present this voucher or provide booking code ${d.pnr}
to your airport van coordinator and hotel front desk.
Hotline: +63 (02) 8888-MCKANES • Email: support@mckanestravel.ph
=====================================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mckanes_Package_${d.pnr}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize package cards on page load
renderPackageCards('all');


// ==========================================
// BOOKING GATE & AUTH POP-UP ENGINE
// ==========================================
let pendingBookingRedirect = null;

function requireAuthToBook(target, e) {
    if (e && e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
    }

    const user = getStoredUser();
    if (user) {
        if (target === 'plane') {
            window.location.href = 'plane-booking.html';
        } else if (target === 'bus') {
            window.location.href = 'bus-booking.html';
        } else if (target.startsWith('package:')) {
            const pkgId = target.replace('package:', '');
            openPackageModal(pkgId, 'book');
        } else if (target === 'packages') {
            const el = document.getElementById('packages');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
        return;
    }

    openAuthRequiredModal(target);
}

function openAuthRequiredModal(target = 'general') {
    pendingBookingRedirect = target;
    const modal = document.getElementById('auth-required-modal');
    const card = document.getElementById('auth-required-modal-card');
    const titleEl = document.getElementById('auth-required-target-title');
    const descEl = document.getElementById('auth-required-target-desc');

    if (titleEl && descEl) {
        if (target === 'plane') {
            titleEl.textContent = 'Flight Reservation Requires Sign In';
            descEl.textContent = 'Please sign in to your Mckanes account to search airline schedules, choose seats, and book your flight ticket.';
        } else if (target === 'bus') {
            titleEl.textContent = 'Bus Ticket Booking Requires Sign In';
            descEl.textContent = 'Please sign in to select provincial bus routes, view departure bays, pick your seats, and confirm your ticket.';
        } else if (target.startsWith('package:')) {
            const pkgId = target.replace('package:', '');
            const clientPkgs = (typeof getClientVacationPackages === 'function') ? getClientVacationPackages() : VACATION_PACKAGES;
            const pkg = clientPkgs.find(p => p.id === pkgId);
            const pkgName = pkg ? pkg.name : 'Vacation Package';
            titleEl.textContent = `Sign In Required: ${pkgName}`;
            descEl.textContent = 'Please sign in to lock in your discounted tour rates, reserve resort accommodations, and issue your official travel voucher.';
        } else {
            titleEl.textContent = 'Sign In Required to Book Your Journey';
            descEl.textContent = 'You must be signed in to your Mckanes account before booking tickets or vacation packages.';
        }
    }

    if (!modal || !card) return;

    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
    });
    document.body.style.overflow = 'hidden';
}

function closeAuthRequiredModal() {
    const modal = document.getElementById('auth-required-modal');
    const card = document.getElementById('auth-required-modal-card');
    if (!modal || !card) return;

    modal.classList.add('opacity-0');
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 250);
}

function proceedToSignInFromGate() {
    closeAuthRequiredModal();
    setTimeout(() => {
        openAuthModal('signin');
    }, 200);
}

function proceedToSignUpFromGate() {
    closeAuthRequiredModal();
    setTimeout(() => {
        openAuthModal('signup');
    }, 200);
}

// ==========================================
// USER AUTHENTICATION & SESSION ENGINE
// ==========================================

let activeAuthTab = 'signin';

function handleRememberMeToggle(checkbox) {
    const cb = checkbox || document.getElementById('signin-remember');
    if (!cb) return;

    const emailEl = document.getElementById('signin-email');
    const passEl = document.getElementById('signin-password');

    if (cb.checked) {
        const savedEmail = localStorage.getItem('mckanes_saved_client_email') || 'julie@gmail.com';
        const savedPass = localStorage.getItem('mckanes_saved_client_pass') || 'password123';
        if (emailEl) {
            emailEl.value = savedEmail;
            emailEl.classList.add('bg-blue-50/60');
            setTimeout(() => emailEl.classList.remove('bg-blue-50/60'), 400);
        }
        if (passEl && (!passEl.value || passEl.value === 'password123')) {
            passEl.value = savedPass;
        }
        localStorage.setItem('mckanes_client_remember', 'true');
        localStorage.setItem('mckanes_saved_client_email', savedEmail);
        showAuthToast('Saved Gmail filled in textbox! (' + savedEmail + ')', 'info');
    } else {
        if (emailEl) emailEl.value = '';
        if (passEl) passEl.value = '';
        localStorage.removeItem('mckanes_client_remember');
        localStorage.removeItem('mckanes_saved_client_email');
        localStorage.removeItem('mckanes_saved_client_pass');
    }
}

function openAuthModal(mode = 'signin') {
    const modal = document.getElementById('auth-modal');
    const card = document.getElementById('auth-modal-card');
    if (!modal || !card) return;

    switchAuthTab(mode);

    if (mode === 'signin') {
        const rememberCb = document.getElementById('signin-remember');
        const emailEl = document.getElementById('signin-email');
        const passEl = document.getElementById('signin-password');
        const isRemembered = localStorage.getItem('mckanes_client_remember') !== 'false';
        if (rememberCb) {
            rememberCb.checked = isRemembered;
        }
        if (isRemembered && emailEl && (!emailEl.value || emailEl.value.trim() === '')) {
            const savedEmail = localStorage.getItem('mckanes_saved_client_email') || 'julie@gmail.com';
            const savedPass = localStorage.getItem('mckanes_saved_client_pass') || 'password123';
            emailEl.value = savedEmail;
            if (passEl && !passEl.value) {
                passEl.value = savedPass;
            }
        }
    }

    modal.classList.remove('hidden', 'opacity-0');
    setTimeout(() => {
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    const card = document.getElementById('auth-modal-card');
    if (!modal || !card) return;

    card.classList.remove('scale-100');
    card.classList.add('scale-95');
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 200);
}

function switchAuthTab(tab) {
    activeAuthTab = tab;
    const tabSignIn = document.getElementById('tab-auth-signin');
    const tabSignUp = document.getElementById('tab-auth-signup');
    const formSignIn = document.getElementById('form-auth-signin');
    const formSignUp = document.getElementById('form-auth-signup');

    if (!tabSignIn || !tabSignUp || !formSignIn || !formSignUp) return;

    if (tab === 'signin') {
        tabSignIn.className = 'flex-1 py-2.5 rounded-xl transition cursor-pointer text-center bg-blue-600 text-white shadow-xs';
        tabSignUp.className = 'flex-1 py-2.5 rounded-xl transition cursor-pointer text-center text-gray-600 hover:text-gray-900';
        formSignIn.classList.remove('hidden');
        formSignUp.classList.add('hidden');

        const rememberCb = document.getElementById('signin-remember');
        const emailEl = document.getElementById('signin-email');
        const passEl = document.getElementById('signin-password');
        if (rememberCb && rememberCb.checked && emailEl && (!emailEl.value || emailEl.value.trim() === '')) {
            const savedEmail = localStorage.getItem('mckanes_saved_client_email') || 'julie@gmail.com';
            const savedPass = localStorage.getItem('mckanes_saved_client_pass') || 'password123';
            emailEl.value = savedEmail;
            if (passEl && !passEl.value) {
                passEl.value = savedPass;
            }
        }
    } else {
        tabSignUp.className = 'flex-1 py-2.5 rounded-xl transition cursor-pointer text-center bg-blue-600 text-white shadow-xs';
        tabSignIn.className = 'flex-1 py-2.5 rounded-xl transition cursor-pointer text-center text-gray-600 hover:text-gray-900';
        formSignUp.classList.remove('hidden');
        formSignIn.classList.add('hidden');
    }
}

function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash text-xs text-blue-600';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye text-xs text-gray-400';
    }
}

function getStoredUser() {
    try {
        const raw = localStorage.getItem('mckanes_user');
        if (!raw) return null;
        const u = JSON.parse(raw);
        if (u) {
            const isAdminAccount = Boolean(u.email && (
                u.email.toLowerCase() === 'mckanes@123' || 
                u.email.toLowerCase() === 'admin@mckanes.com' || 
                u.email.toLowerCase() === 'chibiba@mckanes.com'
            ));
            u.isAdmin = isAdminAccount;
        }
        return u;
    } catch (e) {
        return null;
    }
}

function saveUserSession(user) {
    try {
        localStorage.setItem('mckanes_user', JSON.stringify(user));
    } catch (e) {}
}

function clearUserSession() {
    try {
        localStorage.removeItem('mckanes_user');
    } catch (e) {}
}

// =============================================================================
// REGISTERED CLIENT ACCOUNTS & AUTHENTICATION REPOSITORY
// =============================================================================
function getRegisteredAccounts() {
    try {
        const raw = localStorage.getItem('mckanes_registered_accounts');
        if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list) && list.length > 0) return list;
        }
        const defaultAccounts = [
            {
                id: "CUST-08",
                name: "Julie Mckanes",
                email: "julie@gmail.com",
                phone: "+63 917 888 9999",
                password: "password123",
                city: "Cebu City",
                tier: "Gold VIP",
                status: "Offline",
                trips: 3,
                totalSpend: 24800,
                joinedAt: "2026-10-18"
            }
        ];
        localStorage.setItem('mckanes_registered_accounts', JSON.stringify(defaultAccounts));
        return defaultAccounts;
    } catch (e) {
        return [];
    }
}

function saveRegisteredAccounts(accounts) {
    try {
        localStorage.setItem('mckanes_registered_accounts', JSON.stringify(accounts));
    } catch (e) {
        console.error('Error saving registered accounts:', e);
    }
}

function autofillClientCredentials(email = 'julie@gmail.com', password = 'password123') {
    const emailEl = document.getElementById('signin-email');
    const passEl = document.getElementById('signin-password');
    if (emailEl) emailEl.value = email;
    if (passEl) passEl.value = password;
    showAuthToast('Demo traveler credentials filled! Click Sign In to continue.', 'info');
}

// =============================================================================
// ADMIN CUSTOMER DIRECTORY REAL-TIME SYNCHRONIZATION
// =============================================================================
function syncClientToAdminCustomers(user) {
    if (!user || !user.email) return;
    try {
        let customers = [];
        const raw = localStorage.getItem('mckanes_admin_customers');
        if (raw) {
            customers = JSON.parse(raw);
            if (Array.isArray(customers) && customers.some(c => c.id === 'CUST-01' || c.name === 'Juan Dela Cruz')) {
                customers = customers.filter(c => c.id !== 'CUST-01' && c.id !== 'CUST-02' && c.id !== 'CUST-03' && c.id !== 'CUST-04' && c.id !== 'CUST-05' && c.id !== 'CUST-06' && c.id !== 'CUST-07' && c.name !== 'Juan Dela Cruz');
                if (!customers.some(c => c.id === 'ADMIN-01' || c.email === 'Mckanes@123')) {
                    customers.unshift({
                        id: "ADMIN-01",
                        name: "Mckanes Admin (Chibiba)",
                        email: "Mckanes@123",
                        phone: "+63 917 123 4567",
                        tier: "Platinum VIP (Staff)",
                        trips: 0,
                        totalSpend: 0,
                        city: "Operations HQ",
                        status: "Online",
                        joinedAt: "2026-10-18",
                        lastActive: new Date().toISOString(),
                        loginCount: 1,
                        notes: "Primary Administrator Account (User: Mckanes@123, Password: chibiba)."
                    });
                }
            }
        } else {
            customers = [
                {
                    id: "ADMIN-01",
                    name: "Mckanes Admin (Chibiba)",
                    email: "Mckanes@123",
                    phone: "+63 917 123 4567",
                    tier: "Platinum VIP (Staff)",
                    trips: 0,
                    totalSpend: 0,
                    city: "Operations HQ",
                    status: "Online",
                    joinedAt: "2026-10-18",
                    lastActive: new Date().toISOString(),
                    loginCount: 1,
                    notes: "Primary Administrator Account (User: Mckanes@123, Password: chibiba)."
                }
            ];
        }

        const nowIso = new Date().toISOString();
        const userEmail = user.email.toLowerCase().trim();
        const index = customers.findIndex(c => c.email && c.email.toLowerCase().trim() === userEmail);

        if (index >= 0) {
            customers[index].lastActive = nowIso;
            customers[index].status = "Online";
            customers[index].loginCount = (customers[index].loginCount || 1) + 1;
            if (user.name && (!customers[index].name || customers[index].name === 'Valued Traveler')) {
                customers[index].name = user.name;
            }
            if (user.phone && !customers[index].phone) {
                customers[index].phone = user.phone;
            }
            if (user.city && !customers[index].city) {
                customers[index].city = user.city;
            }
        } else {
            const nextNum = customers.length + 1;
            const newId = 'CUST-' + String(nextNum).padStart(2, '0');
            const newCust = {
                id: user.id || newId,
                name: user.name || 'Valued Traveler',
                email: user.email,
                phone: user.phone || '+63 917 ' + Math.floor(100 + Math.random() * 900) + ' ' + Math.floor(1000 + Math.random() * 9000),
                city: user.city || 'Metro Manila',
                tier: user.tier || 'Bronze',
                trips: user.trips || 0,
                totalSpend: user.totalSpend || 0,
                status: 'Online',
                password: user.password || 'MckanesTravel2026!',
                joinedAt: nowIso,
                lastActive: nowIso,
                loginCount: 1,
                notes: 'Registered online via public website portal.'
            };
            customers.unshift(newCust);
        }

        localStorage.setItem('mckanes_admin_customers', JSON.stringify(customers));

        // Create Admin Notification
        let notifs = [];
        try {
            const rawN = localStorage.getItem('mckanes_admin_notifications');
            notifs = rawN ? JSON.parse(rawN) : [];
        } catch (e) {}

        notifs.unshift({
            id: 'NOTIF-' + Date.now(),
            title: 'Client Active / Signed In',
            desc: `${user.name || 'Traveler'} (${user.email}) just signed into their traveler account`,
            time: 'Just now',
            type: 'login',
            unread: true
        });
        localStorage.setItem('mckanes_admin_notifications', JSON.stringify(notifs.slice(0, 25)));
    } catch (e) {
        console.error('Error syncing client to admin:', e);
    }
}

function updateClientSignOutStatus(email) {
    if (!email) return;
    try {
        const raw = localStorage.getItem('mckanes_admin_customers');
        if (raw) {
            const customers = JSON.parse(raw);
            const index = customers.findIndex(c => c.email && c.email.toLowerCase().trim() === email.toLowerCase().trim());
            if (index >= 0) {
                customers[index].status = 'Offline';
                customers[index].lastActive = new Date().toISOString();
                localStorage.setItem('mckanes_admin_customers', JSON.stringify(customers));
            }
        }
        const accounts = getRegisteredAccounts();
        const accIdx = accounts.findIndex(a => a.email && a.email.toLowerCase().trim() === email.toLowerCase().trim());
        if (accIdx >= 0) {
            accounts[accIdx].status = 'Offline';
            accounts[accIdx].lastActive = new Date().toISOString();
            saveRegisteredAccounts(accounts);
        }
    } catch (e) {}
}

function recordBookingToAdmin(booking) {
    if (!booking) return;
    try {
        let bookings = [];
        const rawB = localStorage.getItem('mckanes_admin_bookings');
        if (rawB) {
            bookings = JSON.parse(rawB);
        }
        bookings.unshift(booking);
        localStorage.setItem('mckanes_admin_bookings', JSON.stringify(bookings));

        // Update customer total trips and total spend
        if (booking.email || booking.customer) {
            const rawC = localStorage.getItem('mckanes_admin_customers');
            let customers = rawC ? JSON.parse(rawC) : [];
            const bEmail = (booking.email || '').toLowerCase().trim();
            const bCust = (booking.customer || '').toLowerCase().trim();
            const cIdx = customers.findIndex(c => 
                (bEmail && c.email && c.email.toLowerCase().trim() === bEmail) ||
                (bCust && c.name && c.name.toLowerCase().trim() === bCust)
            );

            if (cIdx >= 0) {
                customers[cIdx].trips = (Number(customers[cIdx].trips) || 0) + 1;
                customers[cIdx].totalSpend = (Number(customers[cIdx].totalSpend) || 0) + (Number(booking.amount) || 0);
                customers[cIdx].lastActive = new Date().toISOString();
                if (customers[cIdx].totalSpend >= 60000) {
                    customers[cIdx].tier = "Platinum VIP";
                } else if (customers[cIdx].totalSpend >= 25000) {
                    customers[cIdx].tier = "Gold VIP";
                } else if (customers[cIdx].totalSpend >= 10000) {
                    customers[cIdx].tier = "Silver";
                }
                localStorage.setItem('mckanes_admin_customers', JSON.stringify(customers));
            }
        }

        // Add notification
        let notifs = [];
        try {
            const rawN = localStorage.getItem('mckanes_admin_notifications');
            notifs = rawN ? JSON.parse(rawN) : [];
        } catch (e) {}
        notifs.unshift({
            id: 'NOTIF-' + Date.now(),
            title: 'New Reservation Placed',
            desc: `${booking.customer} confirmed ${booking.title} (₱${(Number(booking.amount) || 0).toLocaleString()})`,
            time: 'Just now',
            type: 'booking',
            unread: true
        });
        localStorage.setItem('mckanes_admin_notifications', JSON.stringify(notifs.slice(0, 25)));
    } catch (e) {
        console.error('Error recording booking to admin:', e);
    }
}

function handleSignInSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;

    if (!email || !password) return;

    // Admin Credentials Recognition (User: Mckanes@123, chibiba, admin@mckanes.com, Password: chibiba)
    const isUserAdmin = email.toLowerCase() === 'mckanes@123' || 
                        email.toLowerCase() === 'chibiba' || 
                        email.toLowerCase() === 'admin@mckanes.com' ||
                        email.toLowerCase() === 'chibiba@mckanes.com';
    const isPassAdmin = password === 'chibiba' || password.toLowerCase() === 'chibiba';

    if (isUserAdmin && isPassAdmin) {
        const adminUser = {
            name: 'Mckanes Admin (Chibiba)',
            email: 'Mckanes@123',
            avatarInitials: 'CH',
            isAdmin: true,
            role: 'Operations Director',
            signedInAt: new Date().toISOString()
        };

        saveUserSession(adminUser);
        localStorage.setItem('mckanes_admin_logged_in', 'true');
        localStorage.setItem('mckanes_admin_session', JSON.stringify({
            username: 'Mckanes@123',
            name: 'Mckanes Admin (Chibiba)',
            role: 'Operations Director',
            loggedInAt: new Date().toISOString()
        }));

        renderAuthNav();
        closeAuthModal();
        showAuthToast('Admin authenticated! Launching Admin Operations Console...', 'success');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 900);
        return;
    }

    // Client Authentication against Registered Accounts Database
    const accounts = getRegisteredAccounts();
    const normalizedEmail = email.toLowerCase().trim();
    let matchedAcc = accounts.find(a => (a.email && a.email.toLowerCase().trim() === normalizedEmail) || (a.name && a.name.toLowerCase().trim() === normalizedEmail));

    // Fallback: Check central customers directory if registered via Admin Console
    if (!matchedAcc) {
        try {
            const rawC = localStorage.getItem('mckanes_admin_customers');
            if (rawC) {
                const custs = JSON.parse(rawC);
                const c = custs.find(item => (item.email && item.email.toLowerCase().trim() === normalizedEmail) || (item.name && item.name.toLowerCase().trim() === normalizedEmail));
                if (c && c.id !== 'ADMIN-01') {
                    matchedAcc = {
                        id: c.id,
                        name: c.name,
                        email: c.email,
                        phone: c.phone || '',
                        password: c.password || 'MckanesTravel2026!',
                        city: c.city || 'Metro Manila',
                        tier: c.tier || 'Bronze',
                        status: 'Online',
                        trips: c.trips || 0,
                        totalSpend: c.totalSpend || 0,
                        joinedAt: c.joinedAt || new Date().toISOString(),
                        lastActive: new Date().toISOString(),
                        loginCount: (c.loginCount || 1) + 1,
                        notes: c.notes || ''
                    };
                    accounts.unshift(matchedAcc);
                    saveRegisteredAccounts(accounts);
                }
            }
        } catch (err) {}
    }

    if (!matchedAcc) {
        showAuthToast('No registered client account found with this email. Please click Create Account to register.', 'error');
        return;
    }

    if (matchedAcc.password && matchedAcc.password !== password) {
        showAuthToast('Incorrect account password. Please verify your credentials and try again.', 'error');
        return;
    }

    // Update account metrics and set Online status
    matchedAcc.status = "Online";
    matchedAcc.lastActive = new Date().toISOString();
    matchedAcc.loginCount = (matchedAcc.loginCount || 1) + 1;
    saveRegisteredAccounts(accounts);

    const parts = (matchedAcc.name || 'Valued Traveler').split(' ');
    const initials = parts.length > 1 
        ? (parts[0][0] + parts[1][0]).toUpperCase() 
        : ((matchedAcc.name || 'TR').slice(0, 2)).toUpperCase();

    const user = {
        id: matchedAcc.id,
        name: matchedAcc.name,
        email: matchedAcc.email,
        phone: matchedAcc.phone,
        avatarInitials: initials,
        isAdmin: false,
        signedInAt: new Date().toISOString()
    };

    saveUserSession(user);
    syncClientToAdminCustomers(user);

    // Persist or clear Keep Me Signed In preference
    const rememberCb = document.getElementById('signin-remember');
    if (rememberCb && rememberCb.checked) {
        localStorage.setItem('mckanes_client_remember', 'true');
        localStorage.setItem('mckanes_saved_client_email', user.email);
        localStorage.setItem('mckanes_saved_client_pass', password);
    } else {
        localStorage.removeItem('mckanes_client_remember');
        localStorage.removeItem('mckanes_saved_client_email');
        localStorage.removeItem('mckanes_saved_client_pass');
    }

    renderAuthNav();
    closeAuthModal();

    if (pendingBookingRedirect) {
        const dest = pendingBookingRedirect;
        pendingBookingRedirect = null;
        if (dest === 'plane') {
            showAuthToast(`Welcome back, ${user.name}! Continuing to Flight Reservation...`, 'success');
            setTimeout(() => { window.location.href = 'plane-booking.html'; }, 700);
            return;
        } else if (dest === 'bus') {
            showAuthToast(`Welcome back, ${user.name}! Continuing to Bus Reservation...`, 'success');
            setTimeout(() => { window.location.href = 'bus-booking.html'; }, 700);
            return;
        } else if (dest.startsWith('package:')) {
            const pkgId = dest.replace('package:', '');
            showAuthToast(`Welcome back, ${user.name}! Opening your tour package...`, 'success');
            setTimeout(() => { openPackageModal(pkgId, 'book'); }, 600);
            return;
        }
    }

    showAuthToast(`Welcome back, ${user.name}! Ready for your next journey?`, 'success');
}

function handleSignUpSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const pass = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;

    if (pass !== confirm) {
        showAuthToast('Passwords do not match. Please verify and retype.', 'error');
        return;
    }

    if (pass.length < 4) {
        showAuthToast('Password must be at least 4 characters long.', 'error');
        return;
    }

    // Check if account already exists
    const accounts = getRegisteredAccounts();
    const normalizedEmail = email.toLowerCase().trim();
    if (accounts.some(a => a.email && a.email.toLowerCase().trim() === normalizedEmail)) {
        showAuthToast('An account with this email already exists. Please Sign In.', 'error');
        return;
    }

    const parts = name.split(' ');
    const initials = parts.length > 1 
        ? (parts[0][0] + parts[1][0]).toUpperCase() 
        : (name.slice(0, 2) || 'TR').toUpperCase();

    // Determine ID from existing customers
    let rawC = [];
    try {
        const rc = localStorage.getItem('mckanes_admin_customers');
        rawC = rc ? JSON.parse(rc) : [];
    } catch (err) {}
    const nextId = 'CUST-' + String(Math.max(rawC.length, accounts.length) + 1).padStart(2, '0');
    const nowIso = new Date().toISOString();

    const newAccount = {
        id: nextId,
        name: name,
        email: email,
        phone: phone,
        password: pass,
        city: 'Metro Manila',
        tier: 'Bronze',
        trips: 0,
        totalSpend: 0,
        status: 'Online',
        joinedAt: nowIso,
        lastActive: nowIso,
        loginCount: 1,
        notes: 'Registered online via public website portal.'
    };
    accounts.unshift(newAccount);
    saveRegisteredAccounts(accounts);

    const user = {
        id: nextId,
        name: name,
        email: email,
        phone: phone,
        password: pass,
        avatarInitials: initials,
        isAdmin: false,
        status: 'Online',
        signedInAt: nowIso
    };

    saveUserSession(user);
    syncClientToAdminCustomers(user);
    renderAuthNav();
    closeAuthModal();

    if (pendingBookingRedirect) {
        const dest = pendingBookingRedirect;
        pendingBookingRedirect = null;
        if (dest === 'plane') {
            showAuthToast(`Account created! Continuing to Flight Reservation...`, 'success');
            setTimeout(() => { window.location.href = 'plane-booking.html'; }, 700);
            return;
        } else if (dest === 'bus') {
            showAuthToast(`Account created! Continuing to Bus Reservation...`, 'success');
            setTimeout(() => { window.location.href = 'bus-booking.html'; }, 700);
            return;
        } else if (dest.startsWith('package:')) {
            const pkgId = dest.replace('package:', '');
            showAuthToast(`Account created! Opening your tour package...`, 'success');
            setTimeout(() => { openPackageModal(pkgId, 'book'); }, 600);
            return;
        }
    }

    showAuthToast(`Account created! Welcome to Mckanes Travel, ${name}!`, 'success');
}

function handleSocialAuth(provider) {
    const demoNames = {
        'Google': 'Juan Dela Cruz',
        'Facebook': 'Maria Santos',
        'Apple': 'Alexander Reyes'
    };
    const name = demoNames[provider] || 'Valued Traveler';
    const parts = name.split(' ');
    const initials = (parts[0][0] + parts[1][0]).toUpperCase();

    const user = {
        name: name,
        email: `${name.toLowerCase().replace(/ /g, '.')}@${provider.toLowerCase()}.com`,
        provider: provider,
        avatarInitials: initials,
        signedInAt: new Date().toISOString()
    };

    saveUserSession(user);
    syncClientToAdminCustomers(user);
    renderAuthNav();
    closeAuthModal();

    if (pendingBookingRedirect) {
        const dest = pendingBookingRedirect;
        pendingBookingRedirect = null;
        if (dest === 'plane') {
            showAuthToast(`Signed in with ${provider}! Continuing to Flight Reservation...`, 'success');
            setTimeout(() => { window.location.href = 'plane-booking.html'; }, 700);
            return;
        } else if (dest === 'bus') {
            showAuthToast(`Signed in with ${provider}! Continuing to Bus Reservation...`, 'success');
            setTimeout(() => { window.location.href = 'bus-booking.html'; }, 700);
            return;
        } else if (dest.startsWith('package:')) {
            const pkgId = dest.replace('package:', '');
            showAuthToast(`Signed in with ${provider}! Opening your tour package...`, 'success');
            setTimeout(() => { openPackageModal(pkgId, 'book'); }, 600);
            return;
        }
    }

    showAuthToast(`Signed in with ${provider}! Welcome to Mckanes Travel.`, 'success');
}

function handleForgotPassword() {
    const email = document.getElementById('signin-email').value.trim();
    if (email) {
        showAuthToast(`Password reset link sent to ${email}!`, 'info');
    } else {
        showAuthToast('Please enter your email above to receive a reset link.', 'info');
    }
}

function handleSignOut() {
    const user = getStoredUser();
    if (user && user.email) {
        updateClientSignOutStatus(user.email);
    }
    clearUserSession();
    try {
        localStorage.removeItem('mckanes_admin_logged_in');
        localStorage.removeItem('mckanes_admin_session');
    } catch (e) {}
    renderAuthNav();
    showAuthToast('You have signed out successfully.', 'info');
}

function toggleUserDropdown() {
    const panel = document.getElementById('user-dropdown-panel');
    if (panel) {
        panel.classList.toggle('hidden');
    }
}

// Close dropdown on click outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('user-profile-menu');
    const panel = document.getElementById('user-dropdown-panel');
    if (menu && panel && !menu.contains(e.target)) {
        panel.classList.add('hidden');
    }
});

function renderAuthNav() {
    const container = document.getElementById('nav-auth-container');
    if (!container) return;

    const user = getStoredUser();

    if (user) {
        container.innerHTML = `
            <div class="relative" id="user-profile-menu">
                <button type="button" onclick="toggleUserDropdown()" class="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200/90 px-3 py-1.5 rounded-full shadow-xs transition cursor-pointer">
                    <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        ${user.avatarInitials || 'TR'}
                    </div>
                    <span class="text-xs font-bold text-gray-800 hidden sm:inline max-w-[100px] truncate">${user.name}</span>
                    <i class="fas fa-chevron-down text-[10px] text-gray-400"></i>
                </button>
                <div id="user-dropdown-panel" class="hidden absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div class="px-4 py-2 border-b border-gray-100">
                        <span class="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Signed In As</span>
                        <div class="flex items-center gap-1.5">
                            <span class="text-xs font-extrabold text-gray-900 truncate">${user.name}</span>
                        </div>
                        <span class="text-[11px] text-gray-500 block truncate">${user.email || ''}</span>
                    </div>
                    <a href="#packages" onclick="toggleUserDropdown()" class="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition">
                        <i class="fas fa-suitcase-rolling text-blue-600 w-4"></i>
                        <span>Vacation Packages</span>
                    </a>
                    <a href="plane-booking.html" class="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition">
                        <i class="fas fa-plane text-blue-600 w-4"></i>
                        <span>Flight Tickets</span>
                    </a>
                    <a href="bus-booking.html" class="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition">
                        <i class="fas fa-bus text-blue-600 w-4"></i>
                        <span>Bus Tickets</span>
                    </a>
                    <div class="border-t border-gray-100 mt-1 pt-1">
                        <button type="button" onclick="handleSignOut()" class="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition cursor-pointer text-left font-semibold">
                            <i class="fas fa-sign-out-alt w-4"></i>
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <button type="button" onclick="openAuthModal('signin')" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full transition shadow-md shadow-blue-600/20 cursor-pointer">
                <i class="fas fa-user-circle text-sm sm:text-base"></i>
                <span>Sign In</span>
            </button>
        `;
    }
}

let toastTimer = null;
function showAuthToast(message, type = 'success') {
    const toast = document.getElementById('auth-toast');
    const msg = document.getElementById('auth-toast-message');
    const icon = document.getElementById('auth-toast-icon');
    if (!toast || !msg || !icon) return;

    msg.textContent = message;

    if (type === 'success') {
        icon.className = 'fas fa-check-circle text-emerald-400 text-base';
    } else if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle text-rose-400 text-base';
    } else {
        icon.className = 'fas fa-info-circle text-blue-400 text-base';
    }

    toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
    }, 3800);
}

// Purge legacy mock accounts from localStorage if present
(function purgeLegacyMockAccounts() {
    try {
        const rawCust = localStorage.getItem('mckanes_admin_customers');
        if (rawCust) {
            let custs = JSON.parse(rawCust);
            if (Array.isArray(custs) && custs.some(c => c.id === 'CUST-01' || c.name === 'Juan Dela Cruz')) {
                custs = custs.filter(c => c.id !== 'CUST-01' && c.id !== 'CUST-02' && c.id !== 'CUST-03' && c.id !== 'CUST-04' && c.id !== 'CUST-05' && c.id !== 'CUST-06' && c.id !== 'CUST-07' && c.name !== 'Juan Dela Cruz');
                if (!custs.some(c => c.id === 'ADMIN-01' || c.email === 'Mckanes@123')) {
                    custs.unshift({
                        id: "ADMIN-01",
                        name: "Mckanes Admin (Chibiba)",
                        email: "Mckanes@123",
                        phone: "+63 917 123 4567",
                        tier: "Platinum VIP (Staff)",
                        trips: 0,
                        totalSpend: 0,
                        city: "Operations HQ",
                        status: "Online",
                        joinedAt: "2026-10-18",
                        lastActive: new Date().toISOString(),
                        loginCount: 1,
                        notes: "Primary Administrator Account (User: Mckanes@123, Password: chibiba)."
                    });
                }
                localStorage.setItem('mckanes_admin_customers', JSON.stringify(custs));
            }
        }
        const rawBookings = localStorage.getItem('mckanes_admin_bookings');
        if (rawBookings) {
            let bks = JSON.parse(rawBookings);
            if (Array.isArray(bks)) {
                const legacyMockIds = new Set(['MCK-FL-2891', 'MCK-BUS-8492', 'MCK-PKG-4819', 'MCK-FL-3301', 'MCK-BUS-9102', 'MCK-PKG-5521', 'MCK-FL-4102', 'MCK-BUS-7210', 'MCK-PKG-6119', 'MCK-FL-5509', 'MCK-BUS-6612', 'MCK-BUS-5501']);
                const cleaned = bks.filter(b => b && b.id && !legacyMockIds.has(b.id) && b.email !== 'juan.delacruz@gmail.com' && b.email !== 'maria.santos@gmail.com' && b.email !== 'angela.reyes@stlukes.com.ph' && b.email !== 'grace.d@techstartup.ph');
                if (cleaned.length !== bks.length) {
                    localStorage.setItem('mckanes_admin_bookings', JSON.stringify(cleaned));
                }
            }
        }
        const rawInq = localStorage.getItem('mckanes_admin_inquiries');
        if (rawInq) {
            let inqs = JSON.parse(rawInq);
            if (Array.isArray(inqs)) {
                const legacyMockInqIds = new Set(['INQ-101', 'INQ-102', 'INQ-103', 'INQ-104']);
                const cleanedInq = inqs.filter(q => q && q.id && !legacyMockInqIds.has(q.id) && q.email !== 'carmela.s@gmail.com' && q.email !== 'mcheng@asiaventures.com');
                if (cleanedInq.length !== inqs.length) {
                    localStorage.setItem('mckanes_admin_inquiries', JSON.stringify(cleanedInq));
                }
            }
        }
        const rawUser = localStorage.getItem('mckanes_user');
        if (rawUser) {
            const u = JSON.parse(rawUser);
            if (!u.isAdmin && (u.name === 'Juan Dela Cruz' || u.name === 'Maria Santos' || u.email === 'juan.delacruz@gmail.com' || u.email === 'maria.santos@yahoo.com')) {
                localStorage.removeItem('mckanes_user');
            }
        }
    } catch (e) {}
})();

// Initial check on load
renderAuthNav();

// Enforce client authentication when arriving from Role Gateway or via action=login
(function checkClientAuthTrigger() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const forceLogin = urlParams.get('action') === 'login' || 
                           urlParams.get('auth') === 'signin' || 
                           urlParams.has('login') || 
                           urlParams.has('signin');
        const arrivedFromGateway = document.referrer && (
            document.referrer.endsWith('/index.html') || 
            document.referrer.endsWith('/') || 
            document.referrer.includes('index.html')
        );

        if (forceLogin || arrivedFromGateway) {
            localStorage.removeItem('mckanes_user');
            sessionStorage.removeItem('mckanes_user');
            renderAuthNav();
            setTimeout(() => {
                openAuthModal('signin');
            }, 350);
        }
    } catch (e) {}
})();

// =============================================================================
// CLIENT PRESENCE & REAL-TIME HEARTBEAT
// =============================================================================
function initClientPresenceHeartbeat() {
    function sendHeartbeat() {
        const user = getStoredUser();
        if (!user || !user.email) return;

        try {
            const raw = localStorage.getItem('mckanes_admin_customers');
            if (raw) {
                const customers = JSON.parse(raw);
                const userEmail = user.email.toLowerCase().trim();
                const idx = customers.findIndex(c => c.email && c.email.toLowerCase().trim() === userEmail);
                if (idx >= 0) {
                    customers[idx].lastActive = new Date().toISOString();
                    customers[idx].status = 'Online';
                    localStorage.setItem('mckanes_admin_customers', JSON.stringify(customers));
                }
            }
        } catch (e) {}
    }

    // Initial heartbeat on page load
    sendHeartbeat();

    // Heartbeat every 45 seconds while tab is active and visible
    setInterval(() => {
        if (!document.hidden) {
            sendHeartbeat();
        }
    }, 45000);

    // Update on user interactions (throttled to at most once per 30 seconds)
    let lastPulse = 0;
    const pulse = () => {
        const now = Date.now();
        if (now - lastPulse > 30000) {
            lastPulse = now;
            sendHeartbeat();
        }
    };
    window.addEventListener('click', pulse, { passive: true });
    window.addEventListener('scroll', pulse, { passive: true });
    window.addEventListener('keydown', pulse, { passive: true });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            sendHeartbeat();
        }
    });
}

initClientPresenceHeartbeat();

// =============================================================================
// REAL-TIME VACATION PACKAGE SYNCHRONIZATION WITH ADMIN CONSOLE
// =============================================================================
window.addEventListener('storage', (e) => {
    if (e.key === 'mckanes_admin_packages') {
        if (typeof renderPackageCards === 'function') {
            renderPackageCards(activePackageCategory || 'all');
        }
        if (currentPackage) {
            const updatedList = getClientVacationPackages();
            const reloaded = updatedList.find(p => p.id === currentPackage.id);
            if (reloaded) {
                currentPackage = reloaded;
                if (typeof recalculatePackageTotal === 'function') recalculatePackageTotal();
            }
        }
    }
});

window.addEventListener('packageDataUpdated', () => {
    if (typeof renderPackageCards === 'function') {
        renderPackageCards(activePackageCategory || 'all');
    }
    if (currentPackage) {
        const updatedList = getClientVacationPackages();
        const reloaded = updatedList.find(p => p.id === currentPackage.id);
        if (reloaded) {
            currentPackage = reloaded;
            if (typeof recalculatePackageTotal === 'function') recalculatePackageTotal();
        }
    }
});

// Bind Keep Me Signed In change listener
(function initRememberMeListener() {
    const attach = () => {
        const rememberCb = document.getElementById('signin-remember');
        if (rememberCb) {
            rememberCb.addEventListener('change', function() {
                handleRememberMeToggle(this);
            });
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attach);
    } else {
        attach();
    }
})();
