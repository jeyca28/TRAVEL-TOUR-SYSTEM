// Airport Names & Terminal Mappings
        const AIRPORTS = {
            'MNL': { name: 'Manila', airport: 'Ninoy Aquino International Airport', terminal: 'Terminal 3', city: 'Manila' },
            'CEB': { name: 'Cebu', airport: 'Mactan-Cebu International Airport', terminal: 'Terminal 1', city: 'Cebu' },
            'DVO': { name: 'Davao', airport: 'Francisco Bangoy International Airport', terminal: 'Main Terminal', city: 'Davao' },
            'MPH': { name: 'Boracay / Caticlan', airport: 'Godofredo P. Ramos Airport', terminal: 'Passenger Terminal', city: 'Boracay' },
            'IAO': { name: 'Siargao', airport: 'Sayak Airport', terminal: 'Domestic Terminal', city: 'Siargao' },
            'PPS': { name: 'Puerto Princesa', airport: 'Puerto Princesa International Airport', terminal: 'Main Terminal', city: 'Palawan' },
            'ILO': { name: 'Iloilo', airport: 'Iloilo International Airport', terminal: 'Main Terminal', city: 'Iloilo' }
        };

        // Destination Scenic Photo Mappings (Authentic, place-accurate photos for each destination)
        const DEST_IMAGES = {
            'CEB': 'images/cebu.jpg',
            'MPH': 'images/boracay.jpg',
            'IAO': 'images/siargao.jpg',
            'PPS': 'images/coron.jpg',
            'DVO': 'images/davao.jpg',
            'MNL': 'images/manila.jpg',
            'ILO': 'images/iloilo.jpg'
        };

        const DEST_ONLINE_FALLBACKS = {
            'CEB': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/The_white_sand_of_bantayan_island.jpg/1280px-The_white_sand_of_bantayan_island.jpg',
            'MPH': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            'IAO': 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
            'PPS': 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
            'DVO': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Dahican_Beach_Mati_Davao_Oriental.jpg/1280px-Dahican_Beach_Mati_Davao_Oriental.jpg',
            'MNL': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Iconic_Manila_Bay_sunset%2C_Manila%2C_Philippines.jpg/1280px-Iconic_Manila_Bay_sunset%2C_Manila%2C_Philippines.jpg',
            'ILO': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Islas_de_Gigantes_3.jpg/1280px-Islas_de_Gigantes_3.jpg'
        };

        // Master Catalog of Realistic Domestic Flights
        const MASTER_FLIGHTS = [
            {
                id: '5J-561',
                airline: 'Cebu Pacific',
                code: '5J',
                flightNo: '5J 561',
                aircraft: 'Airbus A321neo',
                badgeBg: 'bg-yellow-400 text-blue-950 font-black',
                depTime: '08:00 AM',
                arrTime: '09:15 AM',
                duration: '1h 15m',
                durationMinutes: 75,
                basePrice: 2850,
                amenities: ['7kg Carry-on', '20kg Check-in', 'USB Charging Port'],
                baggage: '20kg Included'
            },
            {
                id: 'PR-1841',
                airline: 'Philippine Airlines',
                code: 'PR',
                flightNo: 'PR 1841',
                aircraft: 'Airbus A321',
                badgeBg: 'bg-red-600 text-white font-black',
                depTime: '10:30 AM',
                arrTime: '11:45 AM',
                duration: '1h 15m',
                durationMinutes: 75,
                basePrice: 3240,
                amenities: ['7kg Carry-on', '25kg Check-in', 'Complimentary In-flight Snack'],
                baggage: '25kg & Snack Included'
            },
            {
                id: 'Z2-771',
                airline: 'AirAsia',
                code: 'Z2',
                flightNo: 'Z2 771',
                aircraft: 'Airbus A320',
                badgeBg: 'bg-red-500 text-white font-black',
                depTime: '06:45 AM',
                arrTime: '08:00 AM',
                duration: '1h 15m',
                durationMinutes: 75,
                basePrice: 2190,
                amenities: ['7kg Carry-on', '20kg Check-in', 'Standard Recline'],
                baggage: '20kg Included'
            },
            {
                id: '5J-571',
                airline: 'Cebu Pacific',
                code: '5J',
                flightNo: '5J 571',
                aircraft: 'Airbus A321neo',
                badgeBg: 'bg-yellow-400 text-blue-950 font-black',
                depTime: '02:40 PM',
                arrTime: '03:55 PM',
                duration: '1h 15m',
                durationMinutes: 75,
                basePrice: 2680,
                amenities: ['7kg Carry-on', '20kg Check-in', 'Eco Jetliner'],
                baggage: '20kg Included'
            },
            {
                id: 'PR-1853',
                airline: 'Philippine Airlines',
                code: 'PR',
                flightNo: 'PR 1853',
                aircraft: 'Airbus A321',
                badgeBg: 'bg-red-600 text-white font-black',
                depTime: '04:15 PM',
                arrTime: '05:35 PM',
                duration: '1h 20m',
                durationMinutes: 80,
                basePrice: 3450,
                amenities: ['7kg Carry-on', '25kg Check-in', 'Full Service Livery'],
                baggage: '25kg Included'
            },
            {
                id: 'Z2-775',
                airline: 'AirAsia',
                code: 'Z2',
                flightNo: 'Z2 775',
                aircraft: 'Airbus A320',
                badgeBg: 'bg-red-500 text-white font-black',
                depTime: '07:20 PM',
                arrTime: '08:35 PM',
                duration: '1h 15m',
                durationMinutes: 75,
                basePrice: 1980,
                amenities: ['7kg Carry-on', '20kg Check-in', 'Night Flight Saver'],
                baggage: '20kg Included'
            }
        ];

        // Return Flights Catalog
        const RETURN_FLIGHTS = [
            {
                id: '5J-566',
                airline: 'Cebu Pacific',
                code: '5J',
                flightNo: '5J 566',
                aircraft: 'Airbus A320',
                badgeBg: 'bg-yellow-400 text-blue-950 font-black',
                depTime: '04:20 PM',
                arrTime: '05:40 PM',
                duration: '1h 20m',
                durationMinutes: 80,
                basePrice: 2750,
                amenities: ['7kg Carry-on', '20kg Check-in'],
                baggage: '20kg Included'
            },
            {
                id: 'PR-1846',
                airline: 'Philippine Airlines',
                code: 'PR',
                flightNo: 'PR 1846',
                aircraft: 'Airbus A321',
                badgeBg: 'bg-red-600 text-white font-black',
                depTime: '06:10 PM',
                arrTime: '07:30 PM',
                duration: '1h 20m',
                durationMinutes: 80,
                basePrice: 3380,
                amenities: ['7kg Carry-on', '25kg Check-in', 'Snack Included'],
                baggage: '25kg & Snack Included'
            },
            {
                id: 'Z2-778',
                airline: 'AirAsia',
                code: 'Z2',
                flightNo: 'Z2 778',
                aircraft: 'Airbus A320',
                badgeBg: 'bg-red-500 text-white font-black',
                depTime: '09:00 PM',
                arrTime: '10:15 PM',
                duration: '1h 15m',
                durationMinutes: 75,
                basePrice: 2050,
                amenities: ['7kg Carry-on', '20kg Check-in'],
                baggage: '20kg Included'
            }
        ];

        // State Store
        let currentTripType = 'roundtrip';
        let passengerCounts = { adults: 1, children: 0, infants: 0 };
        let selectedOutboundFlight = MASTER_FLIGHTS[0];
        let selectedReturnFlight = RETURN_FLIGHTS[0];
        let currentLegView = 'outbound';
        let activeAirlineFilter = 'all';
        let activeSortCriteria = 'cheapest';
        let selectedSeat = '12A (Window)';
        let baggageAddonCost = 0;
        let insuranceAddonCost = 0;
        let selectedPayment = 'gcash';
        let generatedPnr = 'MCK-5J561-8924';
        let currentGrandTotal = 3470; // Outer-scoped total fare tracking

        // Helper to extract authenticated traveler profile from account session
        function getSignedInTraveler() {
            try {
                const raw = localStorage.getItem('mckanes_user');
                if (!raw) return null;
                const u = JSON.parse(raw);
                if (!u || !u.name) return null;

                // Clean name parsing
                let fullName = (u.name || '').trim();
                let firstName = '';
                let lastName = '';
                if (fullName.includes('(') && fullName.includes(')')) {
                    firstName = 'Chibiba';
                    lastName = 'Mckanes';
                    fullName = 'Chibiba Mckanes';
                } else {
                    const parts = fullName.split(/\s+/);
                    firstName = u.firstName || parts[0] || '';
                    lastName = u.lastName || (parts.length > 1 ? parts.slice(1).join(' ') : '');
                }

                const email = u.email || '';
                const phone = u.phone || '';
                const initials = u.avatarInitials || ((firstName[0] || 'T') + (lastName[0] || 'R')).toUpperCase();

                return {
                    id: u.id || 'CUST-01',
                    name: fullName || `${firstName} ${lastName}`.trim(),
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    avatarInitials: initials,
                    isAdmin: Boolean(u.isAdmin)
                };
            } catch (e) {
                return null;
            }
        }

        const signedTraveler = getSignedInTraveler();

        // Additional Passengers Form Data
        let passengerData = [
            {
                type: 'Adult',
                firstName: signedTraveler ? signedTraveler.firstName : 'Chibiba',
                middleName: '',
                lastName: signedTraveler ? signedTraveler.lastName : 'Mckanes',
                dob: '1990-01-15',
                gender: 'Male',
                nationality: 'Philippines',
                passport: ''
            }
        ];

        function populateFromSignedInUser() {
            const traveler = getSignedInTraveler();
            const pill = document.getElementById('plane-nav-account-pill');
            const avatar = document.getElementById('plane-nav-avatar');
            const nameEl = document.getElementById('plane-nav-user-name');
            const banner = document.getElementById('plane-account-sync-banner');

            if (!traveler) {
                if (pill && avatar && nameEl) {
                    avatar.textContent = 'GT';
                    nameEl.textContent = 'Guest Traveler';
                    const activeBadge = pill.querySelector('.bg-emerald-100');
                    if (activeBadge) activeBadge.classList.add('hidden');
                    const pulseDot = pill.querySelector('.bg-emerald-500, .bg-slate-300');
                    if (pulseDot) {
                        pulseDot.className = 'w-2 h-2 rounded-full bg-slate-300';
                        pulseDot.title = 'Guest Session';
                    }
                }
                if (banner) banner.classList.add('hidden');
                updatePassengerSummary();
                return;
            }

            if (passengerData && passengerData[0]) {
                passengerData[0].firstName = traveler.firstName;
                passengerData[0].lastName = traveler.lastName;
            }

            const f0 = document.getElementById('pax-first-0');
            if (f0) f0.value = traveler.firstName;

            const l0 = document.getElementById('pax-last-0');
            if (l0) l0.value = traveler.lastName;

            const emailInput = document.getElementById('contact-email');
            if (emailInput) emailInput.value = traveler.email;

            const phoneInput = document.getElementById('contact-phone');
            if (phoneInput && traveler.phone) {
                phoneInput.value = traveler.phone.replace(/^\+63\s*/, '');
            }

            // Update top nav account pill
            if (pill && avatar && nameEl) {
                avatar.textContent = traveler.avatarInitials || 'TR';
                nameEl.textContent = traveler.name;
                pill.classList.remove('hidden');
                const activeBadge = pill.querySelector('.bg-emerald-100');
                if (activeBadge) activeBadge.classList.remove('hidden');
                const pulseDot = pill.querySelector('.bg-emerald-500, .bg-slate-300');
                if (pulseDot) {
                    pulseDot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse';
                    pulseDot.title = 'Account Active';
                }
            }

            // Update passenger card account sync banner
            if (banner) {
                const bAvatar = document.getElementById('plane-account-sync-avatar');
                if (bAvatar) bAvatar.textContent = traveler.avatarInitials || 'TR';

                const bName = document.getElementById('plane-account-sync-name');
                if (bName) bName.textContent = traveler.name;

                const bDetails = document.getElementById('plane-account-sync-details');
                if (bDetails) bDetails.textContent = `${traveler.email} • ${traveler.phone}`;

                banner.classList.remove('hidden');
            }

            updatePassengerSummary();
        }

        // 1. Trip Type Switcher (Round-trip vs One-way)
        function setTripType(type) {
            currentTripType = type;
            const btnRound = document.getElementById('btn-roundtrip');
            const btnOne = document.getElementById('btn-oneway');
            const returnContainer = document.getElementById('return-date-container');
            const summaryReturn = document.getElementById('summary-return-block');
            const summaryPill = document.getElementById('summary-trip-pill');
            const legTabs = document.getElementById('leg-tabs-container');

            if (type === 'roundtrip') {
                btnRound.className = "bg-[#0066f5] text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition";
                btnOne.className = "bg-transparent text-gray-600 hover:text-gray-900 font-semibold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition";
                if (returnContainer) {
                    returnContainer.classList.remove('opacity-50', 'bg-gray-50/60');
                    returnContainer.classList.add('bg-white');
                }
                if (summaryReturn) summaryReturn.style.display = 'block';
                if (summaryPill) summaryPill.textContent = 'Round-trip';
                if (legTabs) legTabs.classList.remove('hidden');
                handleDateChange('return');
            } else {
                btnOne.className = "bg-[#0066f5] text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition";
                btnRound.className = "bg-transparent text-gray-600 hover:text-gray-900 font-semibold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition";
                if (returnContainer) {
                    returnContainer.classList.add('opacity-50', 'bg-gray-50/60');
                    returnContainer.classList.remove('bg-white');
                }
                const retDisplay = document.getElementById('return-date-display');
                const retDay = document.getElementById('return-day-display');
                if (retDisplay) retDisplay.textContent = 'No Return Flight';
                if (retDay) retDay.textContent = 'One-way trip (Click to add return)';
                if (summaryReturn) summaryReturn.style.display = 'none';
                if (summaryPill) summaryPill.textContent = 'One-way';
                if (legTabs) legTabs.classList.add('hidden');
            }
            updateRoute();
            recalculateFare();
        }

        // 2. Airport Selection & Route Update
        function swapAirports() {
            const o = document.getElementById('origin-select');
            const d = document.getElementById('dest-select');
            const temp = o.value;
            o.value = d.value;
            d.value = temp;
            updateRoute();
            executeFlightSearch();
        }

        function updateRoute() {
            const oEl = document.getElementById('origin-select');
            const dEl = document.getElementById('dest-select');
            if (!oEl || !dEl) return;
            const o = oEl.value;
            const d = dEl.value;
            const originObj = AIRPORTS[o] || { name: o, airport: 'Airport', terminal: 'Terminal 1', city: o };
            const destObj = AIRPORTS[d] || { name: d, airport: 'Airport', terminal: 'Terminal 1', city: d };

            const originSub = document.getElementById('origin-subtext');
            if (originSub) originSub.textContent = originObj.airport;
            const destSub = document.getElementById('dest-subtext');
            if (destSub) destSub.textContent = destObj.airport;

            const routeTitle = document.getElementById('summary-route-title');
            if (routeTitle) {
                routeTitle.innerHTML = `
                    ${originObj.city} (${o}) <i class="fas fa-arrow-right text-[10px] text-blue-400"></i> ${destObj.city} (${d})
                `;
            }

            const oTerminal = `${originObj.city} ${originObj.terminal}`;
            const dTerminal = `${destObj.city} ${destObj.terminal}`;

            // --- DEPARTURE FLIGHT TICKET (Outbound) ---
            if (document.getElementById('depart-code-text')) {
                document.getElementById('depart-code-text').textContent = o;
            }
            if (document.getElementById('dest-code-text')) {
                document.getElementById('dest-code-text').textContent = d;
            }
            if (document.getElementById('summary-depart-city')) {
                document.getElementById('summary-depart-city').textContent = originObj.city;
            }
            if (document.getElementById('summary-dest-city')) {
                document.getElementById('summary-dest-city').textContent = destObj.city;
            }
            if (document.getElementById('depart-terminal-text')) {
                document.getElementById('depart-terminal-text').textContent = oTerminal;
            }
            if (document.getElementById('arrive-terminal-text')) {
                document.getElementById('arrive-terminal-text').textContent = dTerminal;
            }

            // --- RETURN FLIGHT TICKET (Inbound) ---
            if (document.getElementById('return-depart-code-text')) {
                document.getElementById('return-depart-code-text').textContent = d;
            }
            if (document.getElementById('return-dest-code-text')) {
                document.getElementById('return-dest-code-text').textContent = o;
            }
            if (document.getElementById('summary-return-depart-city')) {
                document.getElementById('summary-return-depart-city').textContent = destObj.city;
            }
            if (document.getElementById('summary-return-dest-city')) {
                document.getElementById('summary-return-dest-city').textContent = originObj.city;
            }
            if (document.getElementById('return-depart-terminal-text')) {
                document.getElementById('return-depart-terminal-text').textContent = dTerminal;
            }
            if (document.getElementById('return-dest-terminal-text')) {
                document.getElementById('return-dest-terminal-text').textContent = oTerminal;
            }

            // Update destination thumbnail based on selected destination place
            const destImg = DEST_IMAGES[d] || DEST_IMAGES['CEB'];
            const destImgEl = document.getElementById('summary-dest-img');
            if (destImgEl) {
                destImgEl.style.opacity = '0.7';
                destImgEl.src = destImg;
                destImgEl.alt = `${destObj.city} - ${destObj.name}`;
                destImgEl.onload = function() {
                    destImgEl.style.opacity = '1';
                };
                destImgEl.onerror = function() {
                    if (!this.dataset.fallbackApplied) {
                        this.dataset.fallbackApplied = 'true';
                        this.src = (typeof DEST_ONLINE_FALLBACKS !== 'undefined' && DEST_ONLINE_FALLBACKS[d]) || 'images/cebu.jpg';
                        this.style.opacity = '1';
                    }
                };
            }
            const destTagEl = document.getElementById('summary-dest-tag-text');
            if (destTagEl) destTagEl.textContent = destObj.city;

            // Update Tab Labels
            const tabOut = document.getElementById('tab-outbound-code');
            if (tabOut) tabOut.textContent = `${o} ➔ ${d}`;
            const tabIn = document.getElementById('tab-inbound-code');
            if (tabIn) tabIn.textContent = `${d} ➔ ${o}`;

            // Update ticket preview & Boarding Pass preview
            const cabinEl = document.getElementById('cabin-select');
            const cabin = cabinEl ? cabinEl.value : 'Economy';
            const ticketRoute = document.getElementById('ticket-route');
            if (ticketRoute) ticketRoute.textContent = `${o} ➔ ${d} • ${cabin}`;

            const ticketTime = document.getElementById('ticket-depart-time');
            if (ticketTime) {
                const depTime = selectedOutboundFlight ? selectedOutboundFlight.depTime : '08:00 AM';
                const arrTime = selectedOutboundFlight ? selectedOutboundFlight.arrTime : '09:15 AM';
                ticketTime.textContent = `${depTime} (${o}) ➔ ${arrTime} (${d})`;
            }

            const ticketRef = document.getElementById('ticket-ref');
            if (ticketRef) ticketRef.textContent = `MCK-${o}${d}-${Math.floor(1000 + Math.random() * 9000)}`;

            const bpOriginCode = document.getElementById('bp-origin-code');
            if (bpOriginCode) bpOriginCode.textContent = o;
            const bpDestCode = document.getElementById('bp-dest-code');
            if (bpDestCode) bpDestCode.textContent = d;
            const bpOriginCity = document.getElementById('bp-origin-city');
            if (bpOriginCity) bpOriginCity.textContent = originObj.city;
            const bpDestCity = document.getElementById('bp-dest-city');
            if (bpDestCity) bpDestCity.textContent = destObj.city;

            // If flight search results panel is visible, re-render results with new route
            const resultsPanel = document.getElementById('flight-results-panel');
            if (resultsPanel && !resultsPanel.classList.contains('hidden')) {
                const resultsTitle = document.getElementById('results-route-title');
                if (resultsTitle) resultsTitle.textContent = `${originObj.name} (${o}) to ${destObj.name} (${d})`;
                renderFlightCards();
            }
        }

        // 3. Date Handling & Interactive Pickers
        function parseLocalDate(dateStr) {
            if (!dateStr) return new Date();
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 12, 0, 0);
            }
            return new Date(dateStr);
        }

        function triggerDatePicker(type) {
            if (type === 'return' && currentTripType === 'oneway') {
                setTripType('roundtrip');
            }
            const inputId = type === 'depart' ? 'depart-date-input' : 'return-date-input';
            const input = document.getElementById(inputId);
            if (!input) return;
            try {
                if (typeof input.showPicker === 'function') {
                    input.showPicker();
                    return;
                }
            } catch (e) {}
            input.focus();
        }

        function handleDateChange(type) {
            if (type === 'depart') {
                const depInput = document.getElementById('depart-date-input');
                const retInput = document.getElementById('return-date-input');
                if (!depInput) return;
                const dep = depInput.value;
                if (dep) {
                    const dObj = parseLocalDate(dep);
                    const formatted = dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const formattedWithDay = dObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                    const dayName = dObj.toLocaleDateString('en-US', { weekday: 'long' });

                    const depDisplay = document.getElementById('depart-date-display');
                    if (depDisplay) depDisplay.textContent = formatted;
                    const depDay = document.getElementById('depart-day-display');
                    if (depDay) depDay.textContent = dayName;

                    if (document.getElementById('summary-depart-date')) document.getElementById('summary-depart-date').textContent = formattedWithDay;
                    if (document.getElementById('summary-arrive-date')) document.getElementById('summary-arrive-date').textContent = formattedWithDay;
                    if (document.getElementById('bp-route-date-origin')) document.getElementById('bp-route-date-origin').textContent = formatted;
                    if (document.getElementById('bp-route-date-dest')) document.getElementById('bp-route-date-dest').textContent = formatted;
                    if (document.getElementById('bp-date')) document.getElementById('bp-date').textContent = formatted;

                    // Ensure return date is not earlier than departure
                    if (retInput) {
                        retInput.min = dep;
                        if (retInput.value < dep) {
                            retInput.value = dep;
                            handleDateChange('return');
                        }
                    }

                    // Dynamically update flight search results panel if visible
                    const resultsPanel = document.getElementById('flight-results-panel');
                    if (resultsPanel && !resultsPanel.classList.contains('hidden')) {
                        const resultsSub = document.getElementById('results-subtitle');
                        if (resultsSub) resultsSub.textContent = `Showing direct flight schedules for ${formatted}.`;
                    }
                }
            } else if (type === 'return') {
                const retInput = document.getElementById('return-date-input');
                if (!retInput) return;
                const ret = retInput.value;
                if (ret) {
                    const rObj = parseLocalDate(ret);
                    const formatted = rObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const formattedWithDay = rObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                    const dayName = rObj.toLocaleDateString('en-US', { weekday: 'long' });

                    const retDisplay = document.getElementById('return-date-display');
                    const retDay = document.getElementById('return-day-display');
                    if (currentTripType === 'roundtrip') {
                        if (retDisplay) retDisplay.textContent = formatted;
                        if (retDay) retDay.textContent = dayName;
                    }
                    if (document.getElementById('summary-return-date')) document.getElementById('summary-return-date').textContent = formattedWithDay;
                    if (document.getElementById('summary-return-arrive-date')) document.getElementById('summary-return-arrive-date').textContent = formattedWithDay;
                }
            }
            updateRouteMeta();
        }

        function updateRouteMeta() {
            const dep = document.getElementById('depart-date-display').textContent;
            const ret = document.getElementById('return-date-display').textContent;
            const paxTotal = passengerCounts.adults + passengerCounts.children;
            const cabin = document.getElementById('cabin-select').value;
            const dateStr = currentTripType === 'roundtrip' ? `${dep} – ${ret}` : dep;
            document.getElementById('summary-route-meta').textContent = `${dateStr} | ${paxTotal} Traveler${paxTotal > 1 ? 's' : ''} | ${cabin}`;
        }

        // 4. Passenger Counters
        function changeCount(type, delta) {
            if (type === 'adults') {
                passengerCounts.adults = Math.max(1, Math.min(9, passengerCounts.adults + delta));
                document.getElementById('count-adults').textContent = passengerCounts.adults;
            } else if (type === 'children') {
                passengerCounts.children = Math.max(0, Math.min(8, passengerCounts.children + delta));
                document.getElementById('count-children').textContent = passengerCounts.children;
            } else if (type === 'infants') {
                passengerCounts.infants = Math.max(0, Math.min(4, passengerCounts.infants + delta));
                document.getElementById('count-infants').textContent = passengerCounts.infants;
            }
            syncPassengersArray();
            renderPassengerInputs();
            updatePassengerSummary();
            updateRouteMeta();
            recalculateFare();
        }

        function syncPassengersArray() {
            const totalPax = passengerCounts.adults + passengerCounts.children;
            while (passengerData.length < totalPax) {
                const idx = passengerData.length;
                const isChild = idx >= passengerCounts.adults;
                passengerData.push({
                    type: isChild ? 'Child' : 'Adult',
                    firstName: isChild ? 'Maria' : 'Carlos',
                    middleName: '',
                    lastName: passengerData[0] ? passengerData[0].lastName : 'Cruz',
                    dob: isChild ? '2016-06-20' : '1992-04-10',
                    gender: 'Female',
                    nationality: 'Philippines',
                    passport: ''
                });
            }
            while (passengerData.length > totalPax && passengerData.length > 1) {
                passengerData.pop();
            }
        }

        function addPassenger() {
            changeCount('adults', 1);
            const container = document.getElementById('dynamic-passengers-container');
            if (container) {
                container.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }

        // Render Passenger Form Cards Dynamically
        function renderPassengerInputs() {
            const container = document.getElementById('dynamic-passengers-container');
            if (!container) return;
            container.innerHTML = '';

            passengerData.forEach((pax, index) => {
                const card = document.createElement('div');
                card.className = "border border-gray-200 rounded-2xl p-4 bg-gray-50/40 space-y-3 relative";
                card.innerHTML = `
                    <div class="flex items-center justify-between pb-2 border-b border-gray-100">
                        <span class="font-extrabold text-xs text-gray-800 flex items-center gap-2">
                            <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">${index + 1}</span>
                            Passenger ${index + 1} (${pax.type}) ${index === 0 ? '<span class="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">Lead Passenger</span>' : ''}
                        </span>
                        ${index > 0 ? `<button type="button" onclick="removePassenger(${index})" class="text-[11px] text-red-500 hover:text-red-700 font-semibold cursor-pointer">Remove ×</button>` : ''}
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-5 gap-3">
                        <div>
                            <label class="text-[10px] font-semibold text-gray-500 block mb-1">First Name *</label>
                            <input type="text" id="pax-first-${index}" value="${pax.firstName || ''}" placeholder="First Name" oninput="handlePaxField(${index}, 'firstName', this.value)" class="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 font-medium focus:border-blue-500 focus:outline-none bg-white">
                        </div>
                        <div>
                            <label class="text-[10px] font-semibold text-gray-500 block mb-1">Middle Name</label>
                            <input type="text" id="pax-middle-${index}" value="${pax.middleName || ''}" placeholder="Middle Name" oninput="handlePaxField(${index}, 'middleName', this.value)" class="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 font-medium focus:border-blue-500 focus:outline-none bg-white">
                        </div>
                        <div>
                            <label class="text-[10px] font-semibold text-gray-500 block mb-1">Last Name *</label>
                            <input type="text" id="pax-last-${index}" value="${pax.lastName || ''}" placeholder="Last Name" oninput="handlePaxField(${index}, 'lastName', this.value)" class="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 font-medium focus:border-blue-500 focus:outline-none bg-white">
                        </div>
                        <div>
                            <label class="text-[10px] font-semibold text-gray-500 block mb-1">Date of Birth *</label>
                            <input type="date" id="pax-dob-${index}" value="${pax.dob || ''}" onchange="handlePaxField(${index}, 'dob', this.value)" class="w-full border border-gray-200 rounded-xl p-2 text-xs text-gray-900 font-medium focus:border-blue-500 focus:outline-none bg-white">
                        </div>
                        <div>
                            <label class="text-[10px] font-semibold text-gray-500 block mb-1">Gender *</label>
                            <select id="pax-gender-${index}" onchange="handlePaxField(${index}, 'gender', this.value)" class="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 font-medium focus:border-blue-500 focus:outline-none bg-white cursor-pointer">
                                <option value="Male" ${pax.gender === 'Male' ? 'selected' : ''}>Male</option>
                                <option value="Female" ${pax.gender === 'Female' ? 'selected' : ''}>Female</option>
                            </select>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function handlePaxField(index, field, val) {
            if (passengerData[index]) {
                passengerData[index][field] = val;
                if (index === 0) {
                    updatePassengerSummary();
                }
            }
        }

        function removePassenger(index) {
            if (passengerData.length > 1) {
                passengerData.splice(index, 1);
                passengerCounts.adults = Math.max(1, passengerData.filter(p => p.type === 'Adult').length);
                passengerCounts.children = passengerData.filter(p => p.type === 'Child').length;
                document.getElementById('count-adults').textContent = passengerCounts.adults;
                document.getElementById('count-children').textContent = passengerCounts.children;
                renderPassengerInputs();
                updatePassengerSummary();
                updateRouteMeta();
                recalculateFare();
            }
        }

        function updatePassengerSummary() {
            const traveler = getSignedInTraveler();
            const lead = passengerData[0] || {};
            let firstName = lead.firstName || '';
            let middleName = lead.middleName || '';
            let lastName = lead.lastName || '';
            if (!firstName && !lastName && traveler) {
                firstName = traveler.firstName;
                lastName = traveler.lastName;
            }
            const fullName = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`.trim() || 'Lead Passenger';
            const totalPax = passengerCounts.adults + passengerCounts.children;
            let paxStr = `${passengerCounts.adults} Adult${passengerCounts.adults > 1 ? 's' : ''}`;
            if (passengerCounts.children > 0) paxStr += `, ${passengerCounts.children} Child${passengerCounts.children > 1 ? 'ren' : ''}`;

            const passBreakdown = document.getElementById('summary-pass-breakdown');
            if (passBreakdown) passBreakdown.textContent = paxStr;

            const passName = document.getElementById('summary-pass-name');
            if (passName) passName.textContent = fullName;

            const calcMult = document.getElementById('calc-pax-multiplier');
            if (calcMult) calcMult.textContent = `${totalPax}x`;

            const ticketPax = document.getElementById('ticket-passenger');
            if (ticketPax) ticketPax.textContent = fullName;

            const ticketCount = document.getElementById('ticket-pass-count');
            if (ticketCount) ticketCount.textContent = paxStr;

            const bpPass = document.getElementById('bp-passenger');
            if (bpPass) bpPass.textContent = fullName.toUpperCase();
        }

        // 5. Cabin Class & Preferences
        function updateCabin() {
            const c = document.getElementById('cabin-select').value;
            document.getElementById('summary-cabin-class').textContent = c;
            document.getElementById('bp-cabin').textContent = c.toUpperCase();
            updateRoute();
            recalculateFare();
        }

        function handleSeatSelect(seat, el) {
            selectedSeat = seat;
            document.querySelectorAll('#seat-selection-group .seat-pill-btn').forEach(btn => {
                btn.className = "seat-pill-btn border border-gray-200 p-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:border-blue-400 transition font-medium text-gray-700";
            });
            if (el && el.parentElement) {
                el.parentElement.className = "seat-pill-btn border-2 border-blue-600 bg-blue-50 text-blue-700 p-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer font-semibold transition";
            }
            document.getElementById('summary-seat-label').textContent = `Seat: ${seat}`;
            document.getElementById('ticket-seat-display').textContent = `Seat ${seat} • ${selectedOutboundFlight.baggage}`;
            document.getElementById('bp-seat').textContent = seat.split(' ')[0];
        }

        function updateBaggageAddon(val) {
            baggageAddonCost = parseInt(val) || 0;
            const row = document.getElementById('row-baggage-addon');
            const summaryText = document.getElementById('summary-baggage-text');
            if (baggageAddonCost === 0) {
                summaryText.textContent = "20kg (Included)";
                summaryText.className = "font-bold text-emerald-600";
            } else if (baggageAddonCost === 450) {
                summaryText.textContent = "32kg Extra (+₱450)";
                summaryText.className = "font-bold text-blue-600";
            } else {
                summaryText.textContent = "40kg Max (+₱850)";
                summaryText.className = "font-bold text-blue-600";
            }
            recalculateFare();
        }

        function updateInsuranceAddon(checked) {
            insuranceAddonCost = checked ? 280 : 0;
            const row = document.getElementById('row-insurance-addon');
            if (checked) {
                row.classList.remove('hidden');
            } else {
                row.classList.add('hidden');
            }
            recalculateFare();
        }

        // 6. Dynamic Fare Recalculation
        function recalculateFare() {
            const cabin = document.getElementById('cabin-select').value;
            let cabinMultiplier = 1.0;
            if (cabin === 'Premium Economy') cabinMultiplier = 1.35;
            if (cabin === 'Business Class') cabinMultiplier = 2.10;

            const outboundBase = selectedOutboundFlight ? selectedOutboundFlight.basePrice : 2850;
            const returnBase = (currentTripType === 'roundtrip' && selectedReturnFlight) ? selectedReturnFlight.basePrice : 0;
            const flightBaseSinglePax = outboundBase + returnBase;

            const paxTotalWeight = passengerCounts.adults + (passengerCounts.children * 0.75);
            const totalBase = Math.round(flightBaseSinglePax * cabinMultiplier * paxTotalWeight);
            const totalTax = Math.round(620 * (currentTripType === 'roundtrip' ? 1.8 : 1.0) * (passengerCounts.adults + passengerCounts.children));
            const grandTotal = totalBase + totalTax + (baggageAddonCost * (passengerCounts.adults + passengerCounts.children)) + (insuranceAddonCost * (passengerCounts.adults + passengerCounts.children));
            currentGrandTotal = grandTotal;

            document.getElementById('summary-base-fare').textContent = `₱${totalBase.toLocaleString()}`;
            document.getElementById('summary-taxes').textContent = `₱${totalTax.toLocaleString()}`;
            document.getElementById('summary-total-fare').textContent = `₱${grandTotal.toLocaleString()}`;
            document.getElementById('ticket-amount').textContent = `₱${grandTotal.toLocaleString()}`;
            document.getElementById('confirm-pay-text').textContent = `Confirm Booking & Pay ₱${grandTotal.toLocaleString()}`;
        }

        // Custom Notice Modal Controller
        let planeNoticeResolver = null;
        function showPlaneNoticeModal({
            title = 'Notice',
            message = '',
            icon = 'fas fa-exclamation-triangle',
            iconBg = 'bg-amber-50 text-amber-600 border-amber-100',
            confirmText = 'OK',
            confirmClass = 'bg-blue-600 hover:bg-blue-700 text-white',
            showCancel = false,
            cancelText = 'Cancel'
        } = {}) {
            return new Promise(resolve => {
                planeNoticeResolver = resolve;
                const modal = document.getElementById('plane-notice-modal');
                const box = document.getElementById('plane-notice-box');
                if (!modal || !box) {
                    resolve(true);
                    return;
                }

                document.getElementById('plane-notice-title').textContent = title;
                document.getElementById('plane-notice-message').textContent = message;
                document.getElementById('plane-notice-icon').className = icon;
                document.getElementById('plane-notice-icon-bg').className = `w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border text-2xl shadow-xs ${iconBg}`;
                document.getElementById('plane-notice-confirm-text').textContent = confirmText;
                document.getElementById('plane-notice-confirm-btn').className = `px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition cursor-pointer ${confirmClass}`;

                const cancelBtn = document.getElementById('plane-notice-cancel-btn');
                if (showCancel) {
                    cancelBtn.classList.remove('hidden');
                    cancelBtn.textContent = cancelText;
                } else {
                    cancelBtn.classList.add('hidden');
                }

                modal.classList.remove('hidden');
                modal.classList.add('flex');
                void modal.offsetWidth;
                box.classList.remove('scale-95', 'opacity-0');
                box.classList.add('scale-100', 'opacity-100');
            });
        }

        function resolvePlaneNotice(val) {
            const modal = document.getElementById('plane-notice-modal');
            const box = document.getElementById('plane-notice-box');
            if (box) {
                box.classList.remove('scale-100', 'opacity-100');
                box.classList.add('scale-95', 'opacity-0');
            }
            setTimeout(() => {
                if (modal) {
                    modal.classList.remove('flex');
                    modal.classList.add('hidden');
                }
                if (typeof planeNoticeResolver === 'function') {
                    const res = planeNoticeResolver;
                    planeNoticeResolver = null;
                    res(val);
                }
            }, 150);
        }

        // 7. Flight Search Execution & Dynamic Results
        function executeFlightSearch() {
            const o = document.getElementById('origin-select').value;
            const d = document.getElementById('dest-select').value;

            if (o === d) {
                showPlaneNoticeModal({
                    title: 'Invalid Route Selection',
                    message: 'Origin and Destination airports cannot be the same. Please select different airports.',
                    icon: 'fas fa-plane-slash',
                    iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
                    confirmText: 'Got It',
                    confirmClass: 'bg-blue-600 hover:bg-blue-700 text-white'
                });
                return;
            }

            const btn = document.getElementById('btn-search-flights');
            const label = document.getElementById('search-flights-label');
            label.textContent = "Searching Schedules...";
            btn.classList.add('opacity-80', 'pointer-events-none');

            setTimeout(() => {
                label.textContent = "Search Flights";
                btn.classList.remove('opacity-80', 'pointer-events-none');

                const panel = document.getElementById('flight-results-panel');
                panel.classList.remove('hidden');

                const oName = AIRPORTS[o] ? AIRPORTS[o].name : o;
                const dName = AIRPORTS[d] ? AIRPORTS[d].name : d;
                document.getElementById('results-route-title').textContent = `${oName} (${o}) to ${dName} (${d})`;
                document.getElementById('results-subtitle').textContent = `Showing direct flight schedules for ${document.getElementById('depart-date-display').textContent}.`;

                renderFlightCards();
                panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 400);
        }

        function switchFlightLeg(leg) {
            currentLegView = leg;
            const tabOut = document.getElementById('tab-outbound');
            const tabIn = document.getElementById('tab-inbound');

            if (leg === 'outbound') {
                tabOut.className = "py-2.5 px-4 text-blue-600 border-b-2 border-blue-600 flex items-center gap-2 transition";
                tabIn.className = "py-2.5 px-4 text-gray-500 hover:text-gray-800 border-b-2 border-transparent flex items-center gap-2 transition";
            } else {
                tabIn.className = "py-2.5 px-4 text-blue-600 border-b-2 border-blue-600 flex items-center gap-2 transition";
                tabOut.className = "py-2.5 px-4 text-gray-500 hover:text-gray-800 border-b-2 border-transparent flex items-center gap-2 transition";
            }
            renderFlightCards();
        }

        function filterAirline(airline, btnEl) {
            activeAirlineFilter = airline;
            document.querySelectorAll('#airline-filter-pills .airline-filter-btn').forEach(btn => {
                btn.className = "airline-filter-btn border border-gray-200 text-gray-600 hover:border-blue-400 rounded-full px-3.5 py-1 bg-white transition";
            });
            if (btnEl) {
                btnEl.className = "airline-filter-btn bg-blue-600 text-white rounded-full px-3.5 py-1 shadow-xs transition";
            }
            renderFlightCards();
        }

        function handleFlightSort(criteria) {
            activeSortCriteria = criteria;
            renderFlightCards();
        }

        function renderFlightCards() {
            const container = document.getElementById('flight-cards-list');
            if (!container) return;
            container.innerHTML = '';

            let flightPool = currentLegView === 'outbound' ? [...MASTER_FLIGHTS] : [...RETURN_FLIGHTS];

            // Apply airline filter
            if (activeAirlineFilter !== 'all') {
                flightPool = flightPool.filter(f => f.airline.toLowerCase().includes(activeAirlineFilter.toLowerCase()));
            }

            // Apply sort
            if (activeSortCriteria === 'cheapest') {
                flightPool.sort((a, b) => a.basePrice - b.basePrice);
            } else if (activeSortCriteria === 'earliest') {
                flightPool.sort((a, b) => a.depTime.localeCompare(b.depTime));
            } else if (activeSortCriteria === 'fastest') {
                flightPool.sort((a, b) => a.durationMinutes - b.durationMinutes);
            }

            document.getElementById('results-count-badge').textContent = `${flightPool.length} Flights Available`;

            const oCode = currentLegView === 'outbound' ? document.getElementById('origin-select').value : document.getElementById('dest-select').value;
            const dCode = currentLegView === 'outbound' ? document.getElementById('dest-select').value : document.getElementById('origin-select').value;
            const currentSelected = currentLegView === 'outbound' ? selectedOutboundFlight : selectedReturnFlight;

            flightPool.forEach(flight => {
                const isSelected = currentSelected && currentSelected.id === flight.id;
                const card = document.createElement('div');
                card.className = isSelected ?
                    "border-2 border-blue-600 bg-blue-50/60 rounded-2xl p-4 cursor-pointer transition shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4" :
                    "border border-gray-200 hover:border-blue-400 bg-white rounded-2xl p-4 cursor-pointer transition hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4";

                card.onclick = () => selectFlightItem(flight, currentLegView);

                card.innerHTML = `
                    <div class="flex items-start sm:items-center gap-3.5 flex-1">
                        <div class="w-10 h-10 rounded-xl ${flight.badgeBg} flex items-center justify-center text-xs shadow-xs flex-shrink-0">
                            ${flight.code}
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center gap-2">
                                <h4 class="font-extrabold text-gray-900 text-xs sm:text-sm">${flight.airline}</h4>
                                <span class="text-[11px] text-gray-500 font-medium">${flight.flightNo} • ${flight.aircraft}</span>
                                ${isSelected ? '<span class="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full shadow-xs">✓ SELECTED</span>' : ''}
                            </div>
                            <div class="flex items-center gap-3 text-xs font-bold text-gray-800 mt-1">
                                <span>${flight.depTime} (${oCode})</span>
                                <i class="fas fa-arrow-right text-[10px] text-blue-500"></i>
                                <span>${flight.arrTime} (${dCode})</span>
                                <span class="text-[10px] text-gray-400 font-medium ml-1">${flight.duration} • Direct</span>
                            </div>
                            <div class="flex flex-wrap gap-2 text-[10px] text-gray-500 mt-1.5">
                                ${flight.amenities.map(a => `<span class="bg-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1"><i class="fas fa-check text-[9px] text-emerald-600"></i> ${a}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 flex-shrink-0">
                        <div class="text-left sm:text-right">
                            <span class="text-base sm:text-lg font-black ${isSelected ? 'text-blue-700' : 'text-gray-900'}">₱${flight.basePrice.toLocaleString()}</span>
                            <span class="text-[10px] text-emerald-600 font-semibold block">${flight.baggage}</span>
                        </div>
                        <button type="button" class="mt-1 text-xs font-bold px-3.5 py-1.5 rounded-lg transition ${isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-700'}">
                            ${isSelected ? 'Selected' : 'Select'}
                        </button>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        function selectFlightItem(flight, leg) {
            if (leg === 'outbound') {
                selectedOutboundFlight = flight;
                document.getElementById('summary-airline-depart').textContent = `${flight.airline} ${flight.flightNo}`;
                document.getElementById('depart-time-text').textContent = flight.depTime;
                document.getElementById('arrive-time-text').textContent = flight.arrTime;
                document.getElementById('depart-duration-text').textContent = flight.duration;
                document.getElementById('ticket-airline-label').textContent = `${flight.airline} ${flight.flightNo}`;
                document.getElementById('ticket-depart-time').textContent = `${flight.depTime} (${document.getElementById('origin-select').value}) ➔ ${flight.arrTime} (${document.getElementById('dest-select').value})`;
                document.getElementById('ticket-duration').textContent = `${flight.duration} Direct`;

                // Update Boarding Pass details
                document.getElementById('bp-airline-name').textContent = flight.airline;
                document.getElementById('bp-flight-no').textContent = flight.flightNo;
                document.getElementById('bp-logo-badge').textContent = flight.code;
                document.getElementById('bp-depart-time').textContent = flight.depTime;
                document.getElementById('bp-arrive-time').textContent = flight.arrTime;
                document.getElementById('bp-duration').textContent = flight.duration;

                const check = document.getElementById('tab-outbound-check');
                if (check) check.classList.remove('hidden');

                // Mark Stepper 1 as completed
                document.getElementById('step-badge-1').innerHTML = '<i class="fas fa-check text-[10px]"></i>';

                // If round-trip and return not selected yet, prompt switch
                if (currentTripType === 'roundtrip') {
                    switchFlightLeg('inbound');
                } else {
                    scrollToSection('card-passenger-info');
                }
            } else {
                selectedReturnFlight = flight;
                document.getElementById('summary-airline-return').textContent = `${flight.airline} ${flight.flightNo}`;
                document.getElementById('return-depart-time-text').textContent = flight.depTime;
                document.getElementById('return-arrive-time-text').textContent = flight.arrTime;
                document.getElementById('return-duration-text').textContent = flight.duration;

                const check = document.getElementById('tab-inbound-check');
                if (check) check.classList.remove('hidden');

                scrollToSection('card-passenger-info');
            }

            renderFlightCards();
            recalculateFare();
        }

        // 8. Navigation & Stepper Control
        function scrollToSection(id) {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // 9. Validation & Step 3 Modal Trigger
        function openReviewModal() {
            validateAndOpenReview();
        }

        function validateAndOpenReview() {
            const email = document.getElementById('contact-email').value.trim();
            const phone = document.getElementById('contact-phone').value.trim();
            const alertBox = document.getElementById('passenger-validation-alert');
            const alertMsg = document.getElementById('passenger-validation-msg');

            // Verify lead passenger name
            const lead = passengerData[0];
            if (!lead || !lead.firstName.trim() || !lead.lastName.trim()) {
                alertBox.classList.remove('hidden');
                alertMsg.textContent = "Please fill in the First Name and Last Name for Passenger 1.";
                scrollToSection('card-passenger-info');
                return;
            }

            if (!email || !email.includes('@')) {
                alertBox.classList.remove('hidden');
                alertMsg.textContent = "Please enter a valid contact email address.";
                scrollToSection('card-passenger-info');
                return;
            }

            if (!phone || phone.length < 7) {
                alertBox.classList.remove('hidden');
                alertMsg.textContent = "Please enter a valid mobile contact phone number.";
                scrollToSection('card-passenger-info');
                return;
            }

            alertBox.classList.add('hidden');

            // Mark Step 2 completed in stepper
            document.getElementById('step-badge-2').innerHTML = '<i class="fas fa-check text-[10px]"></i>';
            document.getElementById('step-badge-2').className = "w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm";

            // Mark Step 3 active
            document.getElementById('step-badge-3').className = "w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm";
            document.getElementById('step-title-3').className = "font-bold text-gray-900 text-xs sm:text-sm leading-tight";

            // Generate fresh PNR
            const oCode = document.getElementById('origin-select').value;
            const dCode = document.getElementById('dest-select').value;
            const randNum = Math.floor(1000 + Math.random() * 9000);
            generatedPnr = `MCK-${selectedOutboundFlight.code}${randNum}`;
            document.getElementById('ticket-ref').textContent = generatedPnr;
            document.getElementById('confirmed-pnr-code').textContent = generatedPnr;
            if (document.getElementById('bp-pnr-badge')) document.getElementById('bp-pnr-badge').textContent = generatedPnr;
            document.getElementById('bp-barcode-text').textContent = `*${generatedPnr}* • ${oCode}${dCode}`;

            // Reset modal states to review
            document.getElementById('modal-step-review').classList.remove('hidden');
            document.getElementById('modal-step-processing').classList.add('hidden');
            document.getElementById('modal-step-confirmed').classList.add('hidden');

            document.getElementById('review-modal').classList.remove('hidden');
        }

        function closeReviewModal() {
            document.getElementById('review-modal').classList.add('hidden');
        }

        // 10. Payment Method Switching
        function selectPaymentMethod(method) {
            selectedPayment = method;
            document.querySelectorAll('#modal-step-review .pm-btn').forEach(btn => {
                btn.className = "pm-btn border border-gray-200 hover:border-blue-400 rounded-xl p-2.5 flex flex-col items-center justify-center text-center cursor-pointer transition";
            });

            document.getElementById('payment-form-gcash').classList.add('hidden');
            document.getElementById('payment-form-maya').classList.add('hidden');
            document.getElementById('payment-form-card').classList.add('hidden');
            document.getElementById('payment-form-otc').classList.add('hidden');

            const activeBtn = document.getElementById(`pm-${method}`);
            if (activeBtn) {
                activeBtn.className = "pm-btn border-2 border-blue-600 bg-blue-50/70 rounded-xl p-2.5 flex flex-col items-center justify-center text-center cursor-pointer transition";
            }
            const activeForm = document.getElementById(`payment-form-${method}`);
            if (activeForm) {
                activeForm.classList.remove('hidden');
            }
        }

        // 11. Complete Booking (Simulation with Real Ticket Generation)
        function completeBooking() {
            const userJson = localStorage.getItem('mckanes_user');
            if (!userJson) {
                showPlaneNoticeModal({
                    title: 'Account Sign-In Required',
                    message: 'You must be signed in to your Mckanes account to finalize your flight reservation and issue official boarding passes.',
                    icon: 'fas fa-user-lock',
                    iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
                    confirmText: 'Sign In Now',
                    confirmClass: 'bg-blue-600 hover:bg-blue-700 text-white',
                    showCancel: true,
                    cancelText: 'Stay on Page'
                }).then(proceed => {
                    if (proceed) {
                        window.location.href = 'home.html#services';
                    }
                });
                return;
            }

            const reviewStep = document.getElementById('modal-step-review');
            const procStep = document.getElementById('modal-step-processing');
            const confStep = document.getElementById('modal-step-confirmed');

            reviewStep.classList.add('hidden');
            procStep.classList.remove('hidden');

            setTimeout(() => {
                document.getElementById('processing-status-text').textContent = "Allocating airline seat assignments & generating digital barcode...";
            }, 500);

            setTimeout(() => {
                procStep.classList.add('hidden');
                confStep.classList.remove('hidden');

                // Mark Stepper 3 completed
                document.getElementById('step-badge-3').innerHTML = '<i class="fas fa-check text-[10px]"></i>';

                // Record flight booking in admin system & update client metrics
                recordFlightBookingToAdmin();
            }, 1200);
        }

        function recordFlightBookingToAdmin() {
            try {
                let user = null;
                const userJson = localStorage.getItem('mckanes_user');
                if (userJson) {
                    try { user = JSON.parse(userJson); } catch (e) {}
                }

                const o = document.getElementById('origin-select') ? document.getElementById('origin-select').value : 'MNL';
                const d = document.getElementById('dest-select') ? document.getElementById('dest-select').value : 'CEB';
                const lead = (passengerData && passengerData[0]) ? passengerData[0] : null;
                const domFirst = document.getElementById('pax-first-0') ? document.getElementById('pax-first-0').value.trim() : '';
                const domLast = document.getElementById('pax-last-0') ? document.getElementById('pax-last-0').value.trim() : '';
                let fName = (lead && lead.firstName ? lead.firstName : domFirst) || '';
                let lName = (lead && lead.lastName ? lead.lastName : domLast) || '';
                let fullName = `${fName} ${lName}`.trim();

                if (!fullName && user) {
                    fullName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim();
                }
                if (!fullName) fullName = "Flight Passenger";

                const email = (document.getElementById('contact-email') ? document.getElementById('contact-email').value.trim() : '') || (user ? user.email : '');
                const phoneRaw = document.getElementById('contact-phone') ? document.getElementById('contact-phone').value.trim() : '';
                const phone = phoneRaw ? (phoneRaw.startsWith('+63') ? phoneRaw : `+63 ${phoneRaw}`) : (user && user.phone ? user.phone : '+63 917 123 4567');
                
                const domTotalText = document.getElementById('summary-total-fare') ? document.getElementById('summary-total-fare').textContent.replace(/[^0-9]/g, '') : '';
                const domFare = Number(domTotalText) || 0;
                const fare = currentGrandTotal > 0 ? currentGrandTotal : (domFare > 0 ? domFare : 3470);
                const flightLabel = selectedOutboundFlight ? `${selectedOutboundFlight.airline} ${selectedOutboundFlight.flightNo}` : 'Commercial Flight';
                const departDate = document.getElementById('depart-date-display') ? document.getElementById('depart-date-display').textContent : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const totalPax = (passengerCounts.adults || 1) + (passengerCounts.children || 0);

                const booking = {
                    id: generatedPnr || `MCK-FLIGHT-${Date.now()}`,
                    type: "flight",
                    title: `${flightLabel} (${o} → ${d})`,
                    customer: fullName,
                    email: email,
                    phone: phone,
                    date: departDate,
                    operator: selectedOutboundFlight ? selectedOutboundFlight.airline : "Mckanes Air Partner",
                    pax: totalPax,
                    amount: fare,
                    paymentMethod: selectedPayment ? selectedPayment.toUpperCase() : "GCash",
                    status: "Confirmed",
                    seat: selectedSeat || "12A",
                    notes: `Flight ticketed: ${o} to ${d}. Seat: ${selectedSeat || 'Auto-allocated'}. PNR: ${generatedPnr}`,
                    createdAt: new Date().toISOString(),
                    origin: o,
                    dest: d,
                    cabin: document.getElementById('cabin-select') ? document.getElementById('cabin-select').value : 'Economy Class',
                    baggage: selectedOutboundFlight ? selectedOutboundFlight.baggage : '20kg Included'
                };

                // 1. Add to central admin bookings
                let bookings = [];
                const rawB = localStorage.getItem('mckanes_admin_bookings');
                if (rawB) {
                    try { bookings = JSON.parse(rawB); } catch (e) {}
                }
                bookings.unshift(booking);
                localStorage.setItem('mckanes_admin_bookings', JSON.stringify(bookings));

                // 2. Update client lifetime trips, spend and loyalty tier in central customers directory
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

                // 3. Dispatch admin notification
                let notifs = [];
                try {
                    const rawN = localStorage.getItem('mckanes_admin_notifications');
                    notifs = rawN ? JSON.parse(rawN) : [];
                } catch (e) {}
                notifs.unshift({
                    id: 'NOTIF-' + Date.now(),
                    title: 'New Flight Booking Confirmed',
                    desc: `${booking.customer} booked ${booking.title} (₱${(Number(booking.amount) || 0).toLocaleString()})`,
                    time: 'Just now',
                    type: 'booking',
                    unread: true
                });
                localStorage.setItem('mckanes_admin_notifications', JSON.stringify(notifs.slice(0, 25)));
            } catch (err) {
                console.error("Error recording flight booking to admin:", err);
            }
        }

        function copyPnrCode() {
            navigator.clipboard.writeText(generatedPnr).then(() => {
                const btn = document.getElementById('btn-copy-pnr');
                btn.innerHTML = '<i class="fas fa-check text-xs"></i> <span>Copied!</span>';
                btn.className = "bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition";
                setTimeout(() => {
                    btn.innerHTML = '<i class="far fa-copy text-xs"></i> <span>Copy</span>';
                    btn.className = "bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer";
                }, 2000);
            });
        }

        function printBoardingPass() {
            window.print();
        }

        function downloadTicketReceipt() {
            const o = document.getElementById('origin-select').value;
            const d = document.getElementById('dest-select').value;
            const lead = passengerData[0];
            const fullName = `${lead.firstName} ${lead.lastName}`;
            const total = document.getElementById('summary-total-fare').textContent;

            const text = `=====================================================
MCKANES TRAVEL AND TOURS - OFFICIAL E-TICKET
=====================================================
Booking Reference (PNR): ${generatedPnr}
Status: CONFIRMED & TICKETED
Date Issued: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}

PASSENGER MANIFEST:
- Lead Passenger: ${fullName} (${passengerCounts.adults} Adult${passengerCounts.adults > 1 ? 's' : ''}, ${passengerCounts.children} Child)
- Nationality: ${lead.nationality}
- Contact Email: ${document.getElementById('contact-email').value}
- Contact Phone: +63 ${document.getElementById('contact-phone').value}

FLIGHT ITINERARY:
- Outbound Flight: ${selectedOutboundFlight.airline} ${selectedOutboundFlight.flightNo}
  Route: ${o} -> ${d}
  Departure: ${document.getElementById('depart-date-display').textContent} - ${selectedOutboundFlight.depTime}
  Arrival: ${selectedOutboundFlight.arrTime}
  Aircraft: ${selectedOutboundFlight.aircraft}
  Assigned Seat: ${selectedSeat}

${currentTripType === 'roundtrip' ? `- Inbound Flight: ${selectedReturnFlight.airline} ${selectedReturnFlight.flightNo}
  Route: ${d} -> ${o}
  Departure: ${document.getElementById('return-date-display').textContent} - ${selectedReturnFlight.depTime}
  Arrival: ${selectedReturnFlight.arrTime}
  Aircraft: ${selectedReturnFlight.aircraft}` : ''}

CABIN & BAGGAGE:
- Cabin Class: ${document.getElementById('cabin-select').value}
- Baggage Allowance: ${selectedOutboundFlight.baggage}

PAYMENT SUMMARY:
- Payment Method: ${selectedPayment.toUpperCase()}
- Total Amount Paid: ${total}

Have a safe and wonderful flight across the Philippines!
Mckanes Travel and Tours • Hotline: +63 02 8888-MCKANES
=====================================================`;

            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Mckanes_Flight_${generatedPnr}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function resetBookingFlow() {
            closeReviewModal();
            scrollToSection('card-flight-details');
            document.getElementById('step-badge-1').innerHTML = '1';
            document.getElementById('step-badge-2').innerHTML = '2';
            document.getElementById('step-badge-3').innerHTML = '3';
        }

        // 12. Initialize Page
        window.addEventListener('DOMContentLoaded', () => {
            // Set dynamic min dates for date pickers
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const todayIso = `${yyyy}-${mm}-${dd}`;
            const depInput = document.getElementById('depart-date-input');
            const retInput = document.getElementById('return-date-input');
            if (depInput) depInput.min = todayIso;
            if (retInput && depInput) retInput.min = depInput.value || todayIso;

            renderPassengerInputs();
            populateFromSignedInUser();
            updateRoute();
            handleDateChange('depart');
            handleDateChange('return');
            updatePassengerSummary();
            updateRouteMeta();
            recalculateFare();
        });
