// Destination Scenic Image Mappings for Bus routes
const BUS_DEST_IMAGES = {
    'Baguio City': 'images/baguio.jpg',
    'Manila (Pasay)': 'images/manila.jpg',
    'Manila (Cubao)': 'images/manila.jpg',
    'Vigan': 'images/vigan.jpg',
    'La Union': 'images/la_union.jpg',
    'Sagada': 'images/banaue.jpg',
    'Batangas Pier': 'images/batangas.jpg'
};

// Master Catalog of Bus Trips
const TRIPS_DATA = [
            {
                id: 1,
                operator: 'Victory Liner',
                class: 'Deluxe',
                icon: '<i class="fas fa-check text-red-600"></i>',
                iconBg: 'bg-red-50 border-red-100 text-red-600',
                origin: 'Manila (Pasay)',
                destination: 'Baguio City',
                depTime: '06:00 AM',
                arrTime: '11:30 AM',
                duration: '5h 30m',
                durationMinutes: 330,
                baseFare: 750,
                amenities: ['WiFi', 'Charging Port', 'Comfortable Seat'],
                terminalOrigin: 'Pasay Victory Terminal',
                terminalDest: 'Baguio Victory Terminal'
            },
            {
                id: 2,
                operator: 'Genesis Transport',
                class: 'Premium Deluxe',
                icon: '<i class="fas fa-circle-notch text-amber-700"></i>',
                iconBg: 'bg-orange-50 border-orange-100 text-amber-700',
                origin: 'Manila (Cubao)',
                destination: 'Baguio City',
                depTime: '07:00 AM',
                arrTime: '12:45 PM',
                duration: '5h 45m',
                durationMinutes: 345,
                baseFare: 800,
                amenities: ['WiFi', 'Charging Port', 'Comfortable Seat'],
                terminalOrigin: 'Cubao Genesis Terminal',
                terminalDest: 'Baguio Central Terminal'
            },
            {
                id: 3,
                operator: 'JoyBus',
                class: 'Executive',
                icon: 'JoyBus',
                iconBg: 'bg-blue-900 border-blue-800 text-yellow-400 text-xs font-bold',
                origin: 'Manila (Cubao)',
                destination: 'Baguio City',
                depTime: '08:00 AM',
                arrTime: '01:30 PM',
                duration: '5h 30m',
                durationMinutes: 330,
                baseFare: 850,
                amenities: ['WiFi', 'Charging Port', 'Comfortable Seat'],
                terminalOrigin: 'Cubao JoyBus Lounge',
                terminalDest: 'Baguio Gov Pack Terminal'
            },
            {
                id: 4,
                operator: 'Partas',
                class: 'Deluxe',
                icon: '<i class="fas fa-location-arrow text-blue-700"></i>',
                iconBg: 'bg-blue-50 border-blue-100 text-blue-700',
                origin: 'Manila (Pasay)',
                destination: 'Baguio City',
                depTime: '09:00 AM',
                arrTime: '03:00 PM',
                duration: '6h 00m',
                durationMinutes: 360,
                baseFare: 780,
                amenities: ['WiFi', 'Charging Port', 'Comfortable Seat'],
                terminalOrigin: 'Pasay Partas Station',
                terminalDest: 'Baguio Partas Terminal'
            },
            {
                id: 5,
                operator: 'Philtranco',
                class: 'Deluxe',
                icon: '<i class="fas fa-sun text-yellow-500 mr-1"></i> PT',
                iconBg: 'bg-amber-50 border-amber-200 text-blue-900 text-xs font-bold',
                origin: 'Manila (Pasay)',
                destination: 'Baguio City',
                depTime: '10:00 AM',
                arrTime: '03:45 PM',
                duration: '5h 45m',
                durationMinutes: 345,
                baseFare: 720,
                amenities: ['WiFi', 'Charging Port', 'Comfortable Seat'],
                terminalOrigin: 'Pasay Philtranco Terminal',
                terminalDest: 'Baguio City Terminal'
            },
            {
                id: 6,
                operator: 'Victory Liner',
                class: 'Standard Aircon',
                icon: '<i class="fas fa-check text-red-600"></i>',
                iconBg: 'bg-red-50 border-red-100 text-red-600',
                origin: 'Manila (Cubao)',
                destination: 'Baguio City',
                depTime: '11:00 AM',
                arrTime: '05:00 PM',
                duration: '6h 00m',
                durationMinutes: 360,
                baseFare: 650,
                amenities: ['WiFi', 'Comfortable Seat'],
                terminalOrigin: 'Cubao Victory Terminal',
                terminalDest: 'Baguio Victory Terminal'
            }
        ];

        // State variables
        let selectedTripId = 1;
        let selectedOperatorFilter = 'all';
        let currentSort = 'time';
        let passengerCount = 1;
        let terminalFeePerPax = 30;
        let tripType = 'oneway';
        let currentDate = new Date('2026-10-18T00:00:00');

        // Helper to extract authenticated traveler profile from account session
        function getSignedInUserForBus() {
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

        // Initialize on page load
        window.addEventListener('DOMContentLoaded', () => {
            renderTrips();
            updateTripSummary();
            renderPassengerInputs();
            updateDateDisplays();
            updateNavAccountBadge();

            // Auto-populate signed-in traveler contact details
            const user = getSignedInUserForBus();
            if (user) {
                const emInput = document.getElementById('bus-contact-email');
                if (emInput) emInput.value = user.email || '';
                const phInput = document.getElementById('bus-contact-phone');
                if (phInput) phInput.value = user.phone || '';
                const sumName = document.getElementById('summary-passenger-name');
                if (sumName && user.name) sumName.textContent = user.name;
            }
        });

        function updateNavAccountBadge() {
            const user = getSignedInUserForBus();
            const pill = document.getElementById('bus-nav-account-pill');
            const avatar = document.getElementById('bus-nav-avatar');
            const nameEl = document.getElementById('bus-nav-user-name');
            if (pill && avatar && nameEl) {
                if (user) {
                    avatar.textContent = user.avatarInitials || 'TR';
                    nameEl.textContent = user.name;
                    pill.classList.remove('hidden');
                    const badge = pill.querySelector('.bg-emerald-100');
                    if (badge) badge.classList.remove('hidden');
                    const dot = pill.querySelector('.bg-emerald-500, .bg-slate-300');
                    if (dot) {
                        dot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse';
                        dot.title = 'Account Active';
                    }
                } else {
                    avatar.textContent = 'GT';
                    nameEl.textContent = 'Guest Traveler';
                    const badge = pill.querySelector('.bg-emerald-100');
                    if (badge) badge.classList.add('hidden');
                    const dot = pill.querySelector('.bg-emerald-500, .bg-slate-300');
                    if (dot) {
                        dot.className = 'w-2 h-2 rounded-full bg-slate-300';
                        dot.title = 'Guest Session';
                    }
                }
            }
        }

        // Toggle Trip Type
        function setTripType(type) {
            tripType = type;
            const btnOne = document.getElementById('btn-oneway');
            const btnRound = document.getElementById('btn-roundtrip');
            if (type === 'oneway') {
                btnOne.className = "bg-blue-600 text-white rounded-full px-5 py-1.5 font-semibold text-xs tracking-wide shadow-sm transition";
                btnRound.className = "text-gray-600 hover:text-blue-600 rounded-full px-4 py-1.5 font-medium text-xs tracking-wide transition";
            } else {
                btnRound.className = "bg-blue-600 text-white rounded-full px-5 py-1.5 font-semibold text-xs tracking-wide shadow-sm transition";
                btnOne.className = "text-gray-600 hover:text-blue-600 rounded-full px-4 py-1.5 font-medium text-xs tracking-wide transition";
            }
            updateTripSummary();
        }

        // Swap From & To
        function swapLocations() {
            const originSelect = document.getElementById('select-origin');
            const destSelect = document.getElementById('select-destination');
            const temp = originSelect.value;
            originSelect.value = destSelect.value;
            destSelect.value = temp;
            executeSearch();
        }

        function updateSearchLabels() {
            updateTripSummary();
        }

        // Date Picker Handler
        function handleDateChange(val) {
            if (!val) return;
            currentDate = new Date(val + 'T00:00:00');
            updateDateDisplays();
            updateTripSummary();
        }

        // Step Date Backward/Forward
        function changeDay(delta) {
            currentDate.setDate(currentDate.getDate() + delta);
            const y = currentDate.getFullYear();
            const m = String(currentDate.getMonth() + 1).padStart(2, '0');
            const d = String(currentDate.getDate()).padStart(2, '0');
            document.getElementById('input-date').value = `${y}-${m}-${d}`;
            updateDateDisplays();
            updateTripSummary();
        }

        function updateDateDisplays() {
            const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
            const formatted = currentDate.toLocaleDateString('en-US', options);
            document.getElementById('header-date-display').textContent = formatted;
        }

        // Passenger Count Handler
        function handlePassengerChange(val) {
            passengerCount = parseInt(val) || 1;
            renderPassengerInputs();
            updateTripSummary();
        }

        // Execute Search Function
        function executeSearch() {
            const origin = document.getElementById('select-origin').value;
            const dest = document.getElementById('select-destination').value;
            const searchBtn = document.getElementById('btn-search-buses');
            
            // Visual search feedback
            searchBtn.innerHTML = `<i class="fas fa-spinner fa-spin text-sm"></i> Searching...`;
            
            setTimeout(() => {
                searchBtn.innerHTML = `<i class="fas fa-search text-sm"></i> <span>Search Buses</span>`;
                document.getElementById('search-sub-status').textContent = `Showing direct bus trips for ${origin} to ${dest}.`;
                renderTrips();
                updateTripSummary();
            }, 300);
        }

        // Filter by Operator
        function filterOperator(opName, btnElem) {
            selectedOperatorFilter = opName;
            const pills = document.querySelectorAll('.op-filter');
            pills.forEach(p => {
                p.className = "op-filter border border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600 rounded-full px-4 py-1.5 bg-white transition";
            });
            if (btnElem) {
                btnElem.className = "op-filter bg-blue-600 text-white rounded-full px-4 py-1.5 shadow-sm transition";
            }
            renderTrips();
        }

        // Sort Handler
        function handleSortChange(sortVal) {
            currentSort = sortVal;
            renderTrips();
        }

        // Render Trip Cards based on filters & sort
        function renderTrips() {
            const container = document.getElementById('trips-container');
            const origin = document.getElementById('select-origin').value;
            const dest = document.getElementById('select-destination').value;

            // Filter
            let filtered = TRIPS_DATA.filter(t => {
                if (selectedOperatorFilter !== 'all' && t.operator !== selectedOperatorFilter) {
                    return false;
                }
                return true;
            });

            // Sort
            if (currentSort === 'price-asc') {
                filtered.sort((a, b) => a.baseFare - b.baseFare);
            } else if (currentSort === 'price-desc') {
                filtered.sort((a, b) => b.baseFare - a.baseFare);
            } else if (currentSort === 'duration') {
                filtered.sort((a, b) => a.durationMinutes - b.durationMinutes);
            } else {
                // Default: Departure time
                filtered.sort((a, b) => a.id - b.id);
            }

            document.getElementById('trips-count-badge').textContent = `${filtered.length} Trips Available`;

            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                        <i class="fas fa-bus-slash text-4xl text-gray-300 mb-3"></i>
                        <h4 class="text-lg font-bold text-gray-800">No Trips Found for this Filter</h4>
                        <p class="text-xs text-gray-500 mt-1 mb-4">Try selecting "All Operators" or choosing an alternative schedule.</p>
                        <button onclick="filterOperator('all')" class="bg-blue-600 text-white text-xs px-5 py-2 rounded-full font-semibold">View All Trips</button>
                    </div>
                `;
                return;
            }

            // Generate HTML
            container.innerHTML = filtered.map(trip => {
                const isSelected = (trip.id === selectedTripId);
                const borderClass = isSelected ? 'border-2 border-blue-600 shadow-md' : 'border border-gray-100 shadow-sm hover:border-blue-300';
                const btnContent = isSelected 
                    ? `<button class="select-btn mt-2 bg-blue-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"><i class="fas fa-check text-xs"></i> Selected</button>`
                    : `<button onclick="selectTrip(${trip.id})" class="select-btn mt-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition">Select</button>`;

                return `
                    <div id="trip-card-${trip.id}" class="trip-card bg-white rounded-2xl p-5 ${borderClass} transition relative cursor-pointer" onclick="selectTrip(${trip.id})">
                        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            <!-- Operator Info -->
                            <div class="md:col-span-4 flex items-center gap-4">
                                <div class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl border flex-shrink-0 ${trip.iconBg}">
                                    ${trip.icon}
                                </div>
                                <div>
                                    <h4 class="font-bold text-gray-900 text-base">${trip.operator}</h4>
                                    <span class="text-xs text-gray-500 font-medium">${trip.class}</span>
                                    <div class="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                                        ${trip.amenities.map(a => `<span title="${a}"><i class="fas fa-${a === 'WiFi' ? 'wifi' : a === 'Charging Port' ? 'plug' : 'couch'} text-gray-400"></i> ${a}</span>`).join('')}
                                    </div>
                                </div>
                            </div>

                            <!-- Route & Schedule -->
                            <div class="md:col-span-5 flex items-center justify-between text-center px-2">
                                <div class="text-left">
                                    <span class="text-base font-extrabold text-gray-900 block">${trip.depTime}</span>
                                    <span class="text-[11px] text-gray-400 block">${origin}</span>
                                </div>

                                <div class="flex-1 px-4 flex flex-col items-center">
                                    <span class="text-[11px] text-gray-400 font-medium mb-1">${trip.duration}</span>
                                    <div class="w-full flex items-center relative">
                                        <div class="w-full h-0.5 bg-gray-200"></div>
                                        <div class="absolute inset-x-0 flex justify-center">
                                            <i class="fas fa-bus ${isSelected ? 'text-blue-600' : 'text-gray-400'} text-xs bg-white px-1"></i>
                                        </div>
                                    </div>
                                    <span class="text-[10px] text-gray-400 mt-1">Direct</span>
                                </div>

                                <div class="text-right">
                                    <span class="text-base font-extrabold text-gray-900 block">${trip.arrTime}</span>
                                    <span class="text-[11px] text-gray-400 block">${dest}</span>
                                </div>
                            </div>

                            <!-- Pricing & Action Button -->
                            <div class="md:col-span-3 flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0" onclick="event.stopPropagation()">
                                <div class="text-left md:text-right">
                                    <span class="text-xl font-bold ${isSelected ? 'text-blue-600' : 'text-gray-900'} block leading-tight">₱${trip.baseFare}</span>
                                    <span class="text-[11px] text-gray-400 block">per person</span>
                                </div>
                                <div onclick="selectTrip(${trip.id})">
                                    ${btnContent}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Select Trip Handler
        function selectTrip(id) {
            selectedTripId = id;
            renderTrips();
            updateTripSummary();
        }

        // Update Trip Summary Sidebar
        function updateTripSummary() {
            const trip = TRIPS_DATA.find(t => t.id === selectedTripId) || TRIPS_DATA[0];
            const origin = document.getElementById('select-origin').value;
            const dest = document.getElementById('select-destination').value;

            // Date formatting
            const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
            const formattedDate = currentDate.toLocaleDateString('en-US', options);

            // Calculations
            const totalBase = trip.baseFare * passengerCount;
            const totalTerminal = terminalFeePerPax * passengerCount;
            const grandTotal = totalBase + totalTerminal;

            // Update DOM
            document.getElementById('summary-route').innerHTML = `${origin.split(' ')[0]} <i class="fas fa-arrow-right text-xs text-sky-400"></i> ${dest.split(' ')[0]}`;
            document.getElementById('summary-date-line').textContent = `${formattedDate} | ${passengerCount} Passenger${passengerCount > 1 ? 's' : ''} | ${tripType === 'oneway' ? 'One-way' : 'Round-trip'}`;
            document.getElementById('summary-operator').textContent = trip.operator;
            document.getElementById('summary-class').textContent = trip.class;
            document.getElementById('summary-dep-time').textContent = trip.depTime;
            document.getElementById('summary-arr-time').textContent = trip.arrTime;
            document.getElementById('summary-origin').textContent = origin;
            document.getElementById('summary-dest').textContent = dest;
            document.getElementById('summary-duration').textContent = trip.duration;
            document.getElementById('summary-pax-count').textContent = `${passengerCount} Adult${passengerCount > 1 ? 's' : ''}`;
            document.getElementById('calc-pax-label').textContent = `${passengerCount}x`;
            document.getElementById('summary-base-fare').textContent = `₱${totalBase.toLocaleString()}`;
            document.getElementById('summary-terminal-fare').textContent = `₱${totalTerminal.toLocaleString()}`;
            document.getElementById('summary-total-fare').textContent = `₱${grandTotal.toLocaleString()}`;

            // Update destination scenic photo
            const summaryImg = document.getElementById('summary-img');
            if (summaryImg) {
                summaryImg.src = BUS_DEST_IMAGES[dest] || 'images/baguio.jpg';
                summaryImg.alt = `${dest} Scenery`;
            }

            // Modal Header updates
            document.getElementById('modal-route').textContent = `${origin} → ${dest}`;
            document.getElementById('modal-operator').textContent = `${trip.operator} (${trip.class})`;
            document.getElementById('modal-departure').textContent = `${formattedDate} - ${trip.depTime}`;
            document.getElementById('modal-total').textContent = `₱${grandTotal.toLocaleString()}`;
        }

        // Render Dynamic Passenger Input Fields
        function renderPassengerInputs(prefetchedUser) {
            const container = document.getElementById('dynamic-passenger-inputs');
            if (!container) return;
            const signedUser = prefetchedUser || getSignedInUserForBus();
            let html = '';
            for (let i = 1; i <= passengerCount; i++) {
                const defaultFirst = (i === 1 && signedUser) ? signedUser.firstName : '';
                const defaultLast = (i === 1 && signedUser) ? signedUser.lastName : '';
                html += `
                    <div class="bg-gray-50 border border-gray-100 rounded-2xl p-3.5 mb-2">
                        <span class="block text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-2">Passenger ${i} Details ${i === 1 ? '<span class="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full ml-1.5">Lead Passenger</span>' : ''}</span>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">First Name *</label>
                                <input type="text" id="pax-first-${i}" required value="${defaultFirst}" placeholder="First Name" oninput="syncLeadPassengerName()" class="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Last Name *</label>
                                <input type="text" id="pax-last-${i}" required value="${defaultLast}" placeholder="Last Name" oninput="syncLeadPassengerName()" class="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500">
                            </div>
                        </div>
                    </div>
                `;
            }
            container.innerHTML = html;
        }

        function syncLeadPassengerName() {
            const f = document.getElementById('pax-first-1') ? document.getElementById('pax-first-1').value.trim() : '';
            const l = document.getElementById('pax-last-1') ? document.getElementById('pax-last-1').value.trim() : '';
            const full = `${f} ${l}`.trim();
            const sumEl = document.getElementById('summary-passenger-name');
            if (sumEl) sumEl.textContent = full || 'Lead Passenger';
        }

        function highlightSeats() {
            const options = document.querySelectorAll('.seat-option');
            options.forEach(opt => {
                const radio = opt.querySelector('input');
                if (radio.checked) {
                    opt.className = "seat-option border-2 border-blue-600 bg-blue-50 text-blue-700 p-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer font-semibold";
                } else {
                    opt.className = "seat-option border border-gray-200 p-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:border-blue-400";
                }
            });
        }

        function renderModalAccountBanner(user) {
            const banner = document.getElementById('modal-account-sync-banner');
            if (!banner) return;
            if (user) {
                const av = document.getElementById('modal-account-sync-avatar');
                if (av) av.textContent = user.avatarInitials || 'CH';

                const nm = document.getElementById('modal-account-sync-name');
                if (nm) nm.textContent = user.name;

                const dt = document.getElementById('modal-account-sync-details');
                if (dt) dt.textContent = `${user.email} • ${user.phone}`;

                banner.classList.remove('hidden');
            } else {
                banner.classList.add('hidden');
            }
        }

        function openPassengerModal() {
            const signedUser = getSignedInUserForBus();

            // 1. Synchronize trip and route details in modal header
            const origin = document.getElementById('select-origin') ? document.getElementById('select-origin').value : 'Manila (Pasay)';
            const dest = document.getElementById('select-destination') ? document.getElementById('select-destination').value : 'Baguio City';
            const trip = TRIPS_DATA.find(t => t.id === selectedTripId) || TRIPS_DATA[0];
            const grandTotal = (trip.baseFare * passengerCount) + (terminalFeePerPax * passengerCount);
            const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
            const dateStr = currentDate.toLocaleDateString('en-US', options);

            const rEl = document.getElementById('modal-route');
            if (rEl) rEl.textContent = `${origin} → ${dest}`;
            const opEl = document.getElementById('modal-operator');
            if (opEl) opEl.textContent = `${trip.operator} (${trip.class})`;
            const depEl = document.getElementById('modal-departure');
            if (depEl) depEl.textContent = `${dateStr} – ${trip.depTime}`;
            const totEl = document.getElementById('modal-total');
            if (totEl) totEl.textContent = `₱${grandTotal.toLocaleString()}`;

            // 2. Render dynamic passenger inputs with signed-in user pre-fill
            renderPassengerInputs(signedUser);

            // 3. Force-populate Lead Passenger 1, Email, and Phone based on Account Details
            if (signedUser) {
                const f1 = document.getElementById('pax-first-1');
                if (f1) f1.value = signedUser.firstName;

                const l1 = document.getElementById('pax-last-1');
                if (l1) l1.value = signedUser.lastName;

                const emInput = document.getElementById('bus-contact-email');
                if (emInput) emInput.value = signedUser.email;

                const phInput = document.getElementById('bus-contact-phone');
                if (phInput) phInput.value = signedUser.phone;

                const sumName = document.getElementById('summary-passenger-name');
                if (sumName) sumName.textContent = signedUser.name;
            }

            // 4. Update Modal Account Linked Banner
            renderModalAccountBanner(signedUser);

            document.getElementById('passenger-modal').classList.remove('hidden');
        }

        function closePassengerModal() {
            document.getElementById('passenger-modal').classList.add('hidden');
        }

        function printBusTicket() {
            window.print();
        }

        let busNoticeResolver = null;
        function showBusNoticeModal({
            title = 'Account Sign-In Required',
            message = 'You must be signed in to your Mckanes account to finalize your bus reservation and issue your digital ticket.',
            icon = 'fas fa-user-lock',
            iconBg = 'bg-blue-50 text-blue-600 border-blue-100',
            confirmText = 'Sign In Now',
            confirmClass = 'bg-blue-600 hover:bg-blue-700 text-white',
            showCancel = true,
            cancelText = 'Stay on Page'
        } = {}) {
            return new Promise(resolve => {
                busNoticeResolver = resolve;
                const modal = document.getElementById('bus-notice-modal');
                const box = document.getElementById('bus-notice-box');
                if (!modal || !box) {
                    resolve(true);
                    return;
                }

                document.getElementById('bus-notice-title').textContent = title;
                document.getElementById('bus-notice-message').textContent = message;
                document.getElementById('bus-notice-icon').className = icon;
                document.getElementById('bus-notice-icon-bg').className = `w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border text-2xl shadow-xs ${iconBg}`;
                document.getElementById('bus-notice-confirm-text').textContent = confirmText;
                document.getElementById('bus-notice-confirm-btn').className = `px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition cursor-pointer ${confirmClass}`;

                const cancelBtn = document.getElementById('bus-notice-cancel-btn');
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

        function resolveBusNotice(val) {
            const modal = document.getElementById('bus-notice-modal');
            const box = document.getElementById('bus-notice-box');
            if (box) {
                box.classList.remove('scale-100', 'opacity-100');
                box.classList.add('scale-95', 'opacity-0');
            }
            setTimeout(() => {
                if (modal) {
                    modal.classList.remove('flex');
                    modal.classList.add('hidden');
                }
                if (typeof busNoticeResolver === 'function') {
                    const res = busNoticeResolver;
                    busNoticeResolver = null;
                    res(val);
                }
            }, 150);
        }

        function handleBookingSubmit(e) {
            e.preventDefault();
            const userJson = localStorage.getItem('mckanes_user');
            if (!userJson) {
                showBusNoticeModal({
                    title: 'Account Sign-In Required',
                    message: 'You must be signed in to your Mckanes account to finalize your bus reservation and issue your digital ticket.',
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

            const first1 = document.getElementById('pax-first-1') ? document.getElementById('pax-first-1').value.trim() : '';
            const last1 = document.getElementById('pax-last-1') ? document.getElementById('pax-last-1').value.trim() : '';
            let leadName = `${first1} ${last1}`.trim();
            if (!leadName) {
                const signedUser = getSignedInUserForBus();
                if (signedUser) leadName = signedUser.name;
            }
            if (!leadName) leadName = "Lead Passenger";
            
            const contactEmail = document.getElementById('bus-contact-email') ? document.getElementById('bus-contact-email').value.trim() : '';
            const contactPhone = document.getElementById('bus-contact-phone') ? document.getElementById('bus-contact-phone').value.trim() : '';

            document.getElementById('summary-passenger-name').textContent = leadName;

            // Fill ticket values
            const trip = TRIPS_DATA.find(t => t.id === selectedTripId) || TRIPS_DATA[0];
            const origin = document.getElementById('select-origin').value;
            const dest = document.getElementById('select-destination').value;
            const grandTotal = (trip.baseFare * passengerCount) + (terminalFeePerPax * passengerCount);
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            const dateStr = currentDate.toLocaleDateString('en-US', options);
            const selectedSeat = document.querySelector('input[name="seat"]:checked') ? document.querySelector('input[name="seat"]:checked').value : '12A';

            const bookingCode = `MCK-${Math.floor(1000 + Math.random() * 9000)}-BUS`;
            document.getElementById('ticket-passenger').textContent = leadName + (passengerCount > 1 ? ` (+${passengerCount - 1} Pax)` : '');
            document.getElementById('ticket-route').textContent = `${origin} → ${dest}`;
            document.getElementById('ticket-operator').textContent = `${trip.operator} (${trip.class})`;
            document.getElementById('ticket-date').textContent = `${dateStr} - ${trip.depTime}`;
            document.getElementById('ticket-seats').textContent = `${selectedSeat} ${passengerCount > 1 ? '(Group Allocation)' : '(Window)'}`;
            document.getElementById('ticket-total').textContent = `₱${grandTotal.toLocaleString()}.00`;
            document.getElementById('ticket-booking-code').textContent = bookingCode;
            if (document.getElementById('bus-barcode-text')) {
                document.getElementById('bus-barcode-text').textContent = `*${bookingCode}* • ${origin.slice(0, 3).toUpperCase()}-${dest.slice(0, 3).toUpperCase()}`;
            }

            document.getElementById('bus-booking-form').classList.add('hidden');
            document.getElementById('booking-success').classList.remove('hidden');

            // Record bus booking in admin system & update client metrics
            recordBusBookingToAdmin({
                bookingCode: bookingCode,
                leadName: leadName,
                email: contactEmail,
                phone: contactPhone,
                origin: origin,
                dest: dest,
                trip: trip,
                dateStr: dateStr,
                selectedSeat: selectedSeat,
                grandTotal: grandTotal,
                passengerCount: passengerCount
            });
        }

        function recordBusBookingToAdmin(data) {
            try {
                let user = null;
                const userJson = localStorage.getItem('mckanes_user');
                if (userJson) {
                    try { user = JSON.parse(userJson); } catch (e) {}
                }

                const email = data.email || (user && user.email ? user.email : '');
                const phone = data.phone || (user && user.phone ? user.phone : '+63 917 123 4567');
                let fullName = data.leadName || '';
                if (!fullName && user) {
                    fullName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim();
                }
                if (!fullName) fullName = "Bus Passenger";

                const booking = {
                    id: data.bookingCode || `MCK-BUS-${Date.now()}`,
                    type: "bus",
                    title: `${data.origin} to ${data.dest} Express`,
                    customer: fullName,
                    email: email,
                    phone: phone,
                    date: data.dateStr,
                    operator: `${data.trip.operator} (${data.trip.class})`,
                    pax: data.passengerCount,
                    amount: data.grandTotal,
                    paymentMethod: "Online / Counter",
                    status: "Confirmed",
                    seat: data.selectedSeat,
                    notes: `Bus transit reserved: ${data.origin} → ${data.dest}. Seat: ${data.selectedSeat}. Ref: ${data.bookingCode}`,
                    createdAt: new Date().toISOString(),
                    origin: data.origin,
                    dest: data.dest,
                    cabin: data.trip ? `${data.trip.class} Class` : 'Standard Express',
                    baggage: '25kg Cargo Compartment'
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
                    title: 'New Bus Trip Reserved',
                    desc: `${booking.customer} booked ${booking.title} (₱${(Number(booking.amount) || 0).toLocaleString()})`,
                    time: 'Just now',
                    type: 'booking',
                    unread: true
                });
                localStorage.setItem('mckanes_admin_notifications', JSON.stringify(notifs.slice(0, 25)));
            } catch (err) {
                console.error("Error recording bus booking to admin:", err);
            }
        }
