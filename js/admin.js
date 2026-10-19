/**
 * ==========================================================================
 * Mckanes Travel and Tours - Admin Panel Controller (js/admin.js)
 * Enterprise-grade operations engine for bookings, packages, fleet & analytics.
 * Fully interactive with instant CRUD, sorting, pagination, bulk actions,
 * global search autocomplete, notifications, and localStorage persistence.
 * ==========================================================================
 */

// Global State
let currentTab = 'dashboard';
let fleetSubTab = 'buses';
let bookingFilterService = 'all';
let bookingFilterStatus = 'all';
let bookingSearchQuery = '';
let bookingSortColumn = 'createdAt';
let bookingSortDirection = 'desc';
let bookingCurrentPage = 1;
let bookingPageSize = 8;
let selectedBookingIds = new Set();
let openStatusDropdownId = null;
let activeStatusDropdownBookingId = null;

// =============================================================================
// ADMIN AUTHENTICATION & CREDENTIALS CONTROLLER
// =============================================================================
const ADMIN_CREDENTIALS = {
    username: "Mckanes@123",
    password: "chibiba",
    name: "Mckanes Admin (Chibiba)",
    role: "Operations Director"
};

function isAdminLoggedIn() {
    return localStorage.getItem('mckanes_admin_logged_in') === 'true';
}

function checkAdminAuth() {
    const authScreen = document.getElementById('admin-auth-screen');
    if (!authScreen) return;

    // Check if login is explicitly requested or arrived from the public role gateway
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const forceLoginParam = urlParams.get('action') === 'login' || 
                               urlParams.get('mode') === 'login' || 
                               urlParams.has('login') ||
                               urlParams.has('lock') ||
                               urlParams.has('auth');
        const arrivedFromGateway = document.referrer && (
            document.referrer.endsWith('/index.html') || 
            document.referrer.endsWith('/') || 
            document.referrer.includes('index.html')
        );

        if (forceLoginParam || arrivedFromGateway) {
            localStorage.removeItem('mckanes_admin_logged_in');
            localStorage.removeItem('mckanes_admin_session');
            sessionStorage.removeItem('mckanes_admin_logged_in');
            sessionStorage.removeItem('mckanes_admin_session');
        }
    } catch (err) {}

    if (isAdminLoggedIn()) {
        authScreen.classList.remove('flex');
        authScreen.classList.add('hidden');
        authScreen.style.setProperty('display', 'none', 'important');
        updateAdminProfileBadge();
    } else {
        authScreen.classList.remove('hidden');
        authScreen.classList.add('flex');
        authScreen.style.removeProperty('display');
        authScreen.style.display = 'flex';

        // Always ensure password is blank when displaying the login screen
        const passInput = document.getElementById('admin-login-password');
        if (passInput) passInput.value = '';

        const errorBanner = document.getElementById('admin-login-error');
        if (errorBanner) errorBanner.classList.add('hidden');

        // If remembered, prefill username only
        const remember = localStorage.getItem('mckanes_admin_remember') === 'true';
        const userInput = document.getElementById('admin-login-username');
        if (remember && userInput) {
            userInput.value = ADMIN_CREDENTIALS.username;
        } else if (userInput) {
            userInput.value = '';
        }
    }
}

function handleAdminLogin(e) {
    if (e && e.preventDefault) e.preventDefault();
    const userInput = document.getElementById('admin-login-username');
    const passInput = document.getElementById('admin-login-password');
    const errorBanner = document.getElementById('admin-login-error');
    const loginCard = document.getElementById('admin-login-card');
    const rememberBox = document.getElementById('admin-login-remember');

    const username = userInput ? userInput.value.trim() : '';
    const password = passInput ? passInput.value.trim() : '';

    // Validate credentials: username check (Mckanes@123 or chibiba, case-insensitive) and password (chibiba)
    const isUserValid = username.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() || username.toLowerCase() === 'chibiba';
    const isPassValid = password.toLowerCase() === ADMIN_CREDENTIALS.password.toLowerCase() || password === ADMIN_CREDENTIALS.password;

    if (isUserValid && isPassValid) {
        // Authenticate successfully
        if (errorBanner) errorBanner.classList.add('hidden');
        if (userInput) userInput.classList.remove('border-rose-500');
        if (passInput) passInput.classList.remove('border-rose-500');

        localStorage.setItem('mckanes_admin_logged_in', 'true');
        localStorage.setItem('mckanes_admin_session', JSON.stringify({
            username: ADMIN_CREDENTIALS.username,
            name: ADMIN_CREDENTIALS.name,
            role: ADMIN_CREDENTIALS.role,
            loggedInAt: new Date().toISOString()
        }));

        if (rememberBox && rememberBox.checked) {
            localStorage.setItem('mckanes_admin_remember', 'true');
        } else {
            localStorage.removeItem('mckanes_admin_remember');
        }

        // Hide auth screen reliably
        const authScreen = document.getElementById('admin-auth-screen');
        if (authScreen) {
            authScreen.classList.remove('flex');
            authScreen.classList.add('hidden');
            authScreen.style.setProperty('display', 'none', 'important');
        }

        renderDashboard();
        renderBookingsTable();
        updateAdminProfileBadge();
        showAdminToast('Welcome back, Admin! Console unlocked.', 'success');
    } else {
        // Show error feedback
        if (errorBanner) {
            errorBanner.classList.remove('hidden');
            const msgEl = document.getElementById('admin-login-error-msg');
            if (msgEl) {
                if (!isUserValid) {
                    msgEl.textContent = 'Invalid Admin User ID. Use Mckanes@123';
                } else {
                    msgEl.textContent = 'Invalid Password. Please check and try again.';
                }
            }
        }
        if (userInput && !isUserValid) userInput.classList.add('border-rose-500');
        if (passInput && !isPassValid) passInput.classList.add('border-rose-500');

        if (loginCard) {
            loginCard.classList.add('shake-error');
            setTimeout(() => loginCard.classList.remove('shake-error'), 500);
        }
    }
}

// ============================================================================
// CUSTOM ADMIN CONFIRMATION & PROMPT MODAL CONTROLLER
// ============================================================================
let adminConfirmResolver = null;

function showAdminConfirmModal({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    icon = 'fas fa-exclamation-triangle',
    iconBg = 'bg-rose-50 text-rose-600 border-rose-100',
    confirmText = 'Confirm',
    confirmIcon = 'fas fa-check',
    confirmClass = 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25',
    cancelText = 'Cancel',
    showInput = false,
    inputValue = '',
    inputLabel = 'Value'
} = {}) {
    return new Promise((resolve) => {
        adminConfirmResolver = resolve;

        const modal = document.getElementById('admin-confirm-modal');
        const box = document.getElementById('admin-confirm-box');
        const iconEl = document.getElementById('admin-confirm-icon');
        const iconBgEl = document.getElementById('admin-confirm-icon-bg');
        const titleEl = document.getElementById('admin-confirm-title');
        const msgEl = document.getElementById('admin-confirm-message');
        const cancelBtn = document.getElementById('admin-confirm-cancel-btn');
        const actionBtn = document.getElementById('admin-confirm-action-btn');
        const actionText = document.getElementById('admin-confirm-action-text');
        const actionIcon = document.getElementById('admin-confirm-action-icon');
        const inputContainer = document.getElementById('admin-confirm-input-container');
        const inputLabelEl = document.getElementById('admin-confirm-input-label');
        const inputEl = document.getElementById('admin-confirm-input');

        if (!modal || !box) {
            const fallback = confirm(`${title}\n\n${message}`);
            resolve(fallback);
            return;
        }

        if (titleEl) titleEl.textContent = title;
        if (msgEl) msgEl.textContent = message;
        if (cancelBtn) cancelBtn.textContent = cancelText;
        if (actionText) actionText.textContent = confirmText;

        if (iconEl) iconEl.className = icon;
        if (iconBgEl) iconBgEl.className = `w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border text-2xl shadow-xs transition-colors ${iconBg}`;

        if (actionIcon) actionIcon.className = `${confirmIcon} text-[10px]`;
        if (actionBtn) {
            actionBtn.className = `px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2 ${confirmClass}`;
        }

        if (inputContainer && inputEl && inputLabelEl) {
            if (showInput) {
                inputContainer.classList.remove('hidden');
                inputLabelEl.textContent = inputLabel;
                inputEl.value = inputValue;
            } else {
                inputContainer.classList.add('hidden');
            }
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        void modal.offsetWidth;

        box.classList.remove('scale-95', 'opacity-0');
        box.classList.add('scale-100', 'opacity-100');

        if (showInput && inputEl) {
            setTimeout(() => { inputEl.focus(); inputEl.select(); }, 60);
        } else if (actionBtn) {
            setTimeout(() => actionBtn.focus(), 60);
        }
    });
}

function resolveAdminConfirm(isConfirm) {
    const modal = document.getElementById('admin-confirm-modal');
    const box = document.getElementById('admin-confirm-box');
    const inputContainer = document.getElementById('admin-confirm-input-container');
    const inputEl = document.getElementById('admin-confirm-input');

    let resultValue = isConfirm;
    if (isConfirm && inputContainer && !inputContainer.classList.contains('hidden') && inputEl) {
        resultValue = inputEl.value;
    } else if (!isConfirm && inputContainer && !inputContainer.classList.contains('hidden')) {
        resultValue = null;
    }

    if (box) {
        box.classList.remove('scale-100', 'opacity-100');
        box.classList.add('scale-95', 'opacity-0');
    }

    setTimeout(() => {
        if (modal) {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }
        if (typeof adminConfirmResolver === 'function') {
            const resolver = adminConfirmResolver;
            adminConfirmResolver = null;
            resolver(resultValue);
        }
    }, 150);
}

function logoutAdmin() {
    showAdminConfirmModal({
        title: 'Lock Admin Console?',
        message: 'Are you sure you want to lock the Admin Operations Console and sign out? You will need administrator credentials to log back in.',
        icon: 'fas fa-lock',
        iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
        confirmText: 'Lock & Sign Out',
        confirmIcon: 'fas fa-lock',
        confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25',
        cancelText: 'Stay Signed In'
    }).then(confirmed => {
        if (!confirmed) return;

        localStorage.removeItem('mckanes_admin_logged_in');
        localStorage.removeItem('mckanes_admin_session');
        
        const authScreen = document.getElementById('admin-auth-screen');
        if (authScreen) {
            authScreen.classList.remove('hidden');
            authScreen.classList.add('flex');
            authScreen.style.removeProperty('display');
            authScreen.style.display = 'flex';
            const passInput = document.getElementById('admin-login-password');
            if (passInput) passInput.value = '';
            const errorBanner = document.getElementById('admin-login-error');
            if (errorBanner) errorBanner.classList.add('hidden');
        }

        showAdminToast('Admin console locked. Signed out successfully.', 'info');
    });
}

function goToRoleGateway(e) {
    if (e && e.preventDefault) e.preventDefault();
    try {
        localStorage.removeItem('mckanes_admin_logged_in');
        localStorage.removeItem('mckanes_admin_session');
        sessionStorage.removeItem('mckanes_admin_logged_in');
        sessionStorage.removeItem('mckanes_admin_session');
    } catch (err) {}
    window.location.href = 'index.html';
}

function autofillAdminCredentials(autoSubmit = false) {
    const userInput = document.getElementById('admin-login-username');
    const passInput = document.getElementById('admin-login-password');
    const errorBanner = document.getElementById('admin-login-error');

    if (userInput) {
        userInput.value = ADMIN_CREDENTIALS.username;
        userInput.classList.remove('border-rose-500');
    }
    if (passInput) {
        passInput.value = ADMIN_CREDENTIALS.password;
        passInput.classList.remove('border-rose-500');
    }
    if (errorBanner) {
        errorBanner.classList.add('hidden');
    }

    if (autoSubmit) {
        handleAdminLogin();
    } else {
        showAdminToast('Admin credentials autofilled!', 'info');
    }
}

function toggleAdminLoginPassword() {
    const passInput = document.getElementById('admin-login-password');
    const icon = document.getElementById('admin-login-pass-icon');
    if (!passInput || !icon) return;

    if (passInput.type === 'password') {
        passInput.type = 'text';
        icon.className = 'fas fa-eye-slash text-blue-400';
    } else {
        passInput.type = 'password';
        icon.className = 'fas fa-eye text-slate-400';
    }
}

function updateAdminProfileBadge() {
    const nameEl = document.getElementById('admin-user-display-name');
    const roleEl = document.getElementById('admin-user-display-role');
    if (nameEl) nameEl.textContent = ADMIN_CREDENTIALS.name;
    if (roleEl) roleEl.textContent = `${ADMIN_CREDENTIALS.username} (${ADMIN_CREDENTIALS.role})`;
}

// Default Seed Data
const DEFAULT_BOOKINGS = [];

const DEFAULT_PACKAGES = [
    {
        id: "boracay-escape",
        altId: "boracay-escape",
        name: "Boracay Ultimate Tropical Retreat",
        destination: "Boracay Island, Aklan",
        duration: "3D2N",
        transport: "Flights Included",
        price: 8499,
        basePrice: 8499,
        originalPrice: 11999,
        capacity: 30,
        booked: 24,
        status: "Active",
        image: "images/boracay.jpg"
    },
    {
        id: "coron-odyssey",
        altId: "coron-odyssey",
        name: "Coron Island Odyssey & Shipwreck Safari",
        destination: "Coron, Palawan",
        duration: "4D3N",
        transport: "Flights Included",
        price: 11999,
        basePrice: 11999,
        originalPrice: 15999,
        capacity: 25,
        booked: 21,
        status: "Active",
        image: "images/coron.jpg"
    },
    {
        id: "banaue-heritage",
        altId: "baguio-banaue",
        name: "Banaue & Batad Rice Terraces Heritage",
        destination: "Banaue, Ifugao",
        duration: "3D2N",
        transport: "Deluxe Bus Included",
        price: 5899,
        basePrice: 5899,
        originalPrice: 7999,
        capacity: 20,
        booked: 16,
        status: "Active",
        image: "images/banaue.jpg"
    },
    {
        id: "siargao-surf",
        altId: "siargao-adventure",
        name: "Siargao Island Surf & Natural Pools",
        destination: "General Luna, Siargao",
        duration: "4D3N",
        transport: "Flights Included",
        price: 13499,
        basePrice: 13499,
        originalPrice: 17500,
        capacity: 20,
        booked: 18,
        status: "Active",
        image: "images/siargao.jpg"
    },
    {
        id: "siquijor-mystique",
        altId: "siquijor-haven",
        name: "Siquijor Mystique & Waterfalls Expedition",
        destination: "San Juan & Lazi, Siquijor",
        duration: "3D2N",
        transport: "Fastcraft + Bus Included",
        price: 7999,
        basePrice: 7999,
        originalPrice: 10500,
        capacity: 15,
        booked: 9,
        status: "Active",
        image: "images/waterfall.jpg"
    },
    {
        id: "cebu-bohol-wonders",
        altId: "cebu-bohol",
        name: "Cebu & Bohol Heritage & Chocolate Hills",
        destination: "Cebu City & Panglao, Bohol",
        duration: "4D3N",
        transport: "Flights Included",
        price: 12750,
        basePrice: 12750,
        originalPrice: 16900,
        capacity: 25,
        booked: 22,
        status: "Active",
        image: "images/cebu_bohol.jpg"
    }
];

const DEFAULT_BUS_SCHEDULES = [
    { id: "BS-01", operator: "Victory Liner", classType: "First Class", origin: "Manila (Pasay)", dest: "Baguio City", dep: "06:00 AM", arr: "10:30 AM", fare: 850, seatsTotal: 30, seatsAvail: 12, status: "Active" },
    { id: "BS-02", operator: "Genesis Transport", classType: "JoyBus Executive", origin: "Manila (Cubao)", dest: "Baguio City", dep: "07:30 AM", arr: "12:00 PM", fare: 780, seatsTotal: 32, seatsAvail: 8, status: "Active" },
    { id: "BS-03", operator: "Victory Liner", classType: "Regular Aircon", origin: "Manila (Cubao)", dest: "Baguio City", dep: "09:00 AM", arr: "02:30 PM", fare: 580, seatsTotal: 45, seatsAvail: 24, status: "Active" },
    { id: "BS-04", operator: "Partas Transport", classType: "Deluxe Class", origin: "Manila (Pasay)", dest: "Vigan, Ilocos Sur", dep: "08:00 AM", arr: "04:30 PM", fare: 950, seatsTotal: 28, seatsAvail: 6, status: "Active" },
    { id: "BS-05", operator: "Partas Transport", classType: "Standard Aircon", origin: "Manila (Cubao)", dest: "La Union (San Fernando)", dep: "10:00 AM", arr: "03:30 PM", fare: 720, seatsTotal: 40, seatsAvail: 15, status: "Active" },
    { id: "BS-06", operator: "Genesis Transport", classType: "JoyBus Premiere", origin: "Manila (Cubao)", dest: "Sagada, Mt. Province", dep: "09:00 PM", arr: "07:00 AM", fare: 1100, seatsTotal: 28, seatsAvail: 5, status: "Active" },
    { id: "BS-07", operator: "Philtranco", classType: "Express Aircon", origin: "Manila (Pasay)", dest: "Batangas Pier", dep: "05:30 AM", arr: "07:45 AM", fare: 320, seatsTotal: 49, seatsAvail: 28, status: "Active" }
];

const DEFAULT_FLIGHT_SCHEDULES = [
    { id: "PR-2041", airline: "Philippine Airlines", route: "MNL ➔ MPH (Caticlan / Boracay)", dep: "07:15 AM", arr: "08:20 AM", craft: "Airbus A321neo", fare: 4375, seatsAvail: 18, status: "On Time" },
    { id: "5J-531", airline: "Cebu Pacific", route: "MNL ➔ USU (Coron / Busuanga)", dep: "09:05 AM", arr: "10:15 AM", craft: "ATR 72-600", fare: 4250, seatsAvail: 7, status: "On Time" },
    { id: "PR-2849", airline: "Philippine Airlines", route: "MNL ➔ CEB (Cebu)", dep: "10:45 AM", arr: "12:10 PM", craft: "Airbus A321", fare: 3250, seatsAvail: 22, status: "On Time" },
    { id: "Z2-771", airline: "AirAsia Philippines", route: "MNL ➔ CEB (Cebu)", dep: "01:20 PM", arr: "02:45 PM", craft: "Airbus A320", fare: 2650, seatsAvail: 14, status: "On Time" },
    { id: "PR-2971", airline: "Philippine Airlines", route: "MNL ➔ IAO (Siargao)", dep: "06:30 AM", arr: "08:45 AM", craft: "De Havilland Q400", fare: 4900, seatsAvail: 5, status: "On Time" },
    { id: "5J-891", airline: "Cebu Pacific", route: "MNL ➔ DVO (Davao)", dep: "03:10 PM", arr: "05:00 PM", craft: "Airbus A321neo", fare: 3600, seatsAvail: 31, status: "On Time" }
];

const DEFAULT_CUSTOMERS = [
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
        notes: "Primary Administrator Account (User: Mckanes@123, Password: chibiba). Authorized console operator."
    }
];

const DEFAULT_INQUIRIES = [];

const DEFAULT_PROMOS = [
    { code: "PILIPINAS10", discount: "10% OFF", type: "Percentage", minSpend: 3000, maxUses: 500, usesCount: 342, expiry: "2026-12-31", status: "Active" },
    { code: "SUMMER2026", discount: "₱1,000 OFF", type: "Fixed", minSpend: 8000, maxUses: 200, usesCount: 168, expiry: "2026-11-30", status: "Active" },
    { code: "BUSESCAPE", discount: "₱100 OFF", type: "Fixed", minSpend: 700, maxUses: 1000, usesCount: 684, expiry: "2026-12-15", status: "Active" },
    { code: "EARLYBIRD500", discount: "₱500 OFF", type: "Fixed", minSpend: 5000, maxUses: 300, usesCount: 195, expiry: "2026-10-31", status: "Active" }
];

const DEFAULT_NOTIFICATIONS = [
    { id: "NOTIF-1", title: "Admin Portal Online", desc: "Operations console active with authorized staff account (Mckanes@123 / chibiba)", time: "Just now", type: "system", unread: false },
    { id: "NOTIF-2", title: "Customer Database Ready", desc: "Client reflection engine active. New traveler registrations will appear live.", time: "Just now", type: "alert", unread: false },
    { id: "NOTIF-3", title: "Seat Capacity Alert", desc: "JoyBus Executive to Baguio has high demand for upcoming weekend departures", time: "1 hour ago", type: "alert", unread: true }
];

// LocalStorage Persistence Helpers
function getStored(key, fallback) {
    try {
        const item = localStorage.getItem(`mckanes_admin_${key}`);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        return fallback;
    }
}

function setStored(key, data) {
    try {
        localStorage.setItem(`mckanes_admin_${key}`, JSON.stringify(data));
    } catch (e) {
        console.warn('Storage quota or error', e);
    }
}

// Master Catalog of Legacy Mock Bookings to Cleanly Purge
const ALL_MOCK_BOOKING_IDS = new Set([
    'MCK-FL-2891', 'MCK-BUS-8492', 'MCK-PKG-1049', 'MCK-BUS-8504',
    'MCK-FL-2895', 'MCK-PKG-1052', 'MCK-BUS-8510', 'MCK-FL-2899',
    'MCK-PKG-1055', 'MCK-FL-2902', 'MCK-BUS-8515', 'MCK-BUS-8519',
    'MCK-PKG-4819', 'MCK-FL-3301', 'MCK-BUS-9102', 'MCK-PKG-5521',
    'MCK-FL-4102', 'MCK-BUS-7210', 'MCK-PKG-6119', 'MCK-FL-5509',
    'MCK-BUS-6612', 'MCK-BUS-5501'
]);

const ALL_MOCK_EMAILS = new Set([
    'juan.delacruz@gmail.com', 'maria.santos@yahoo.com', 'maria.santos@gmail.com',
    'rlim.travel@gmail.com', 'josh.mendoza@outlook.com', 'joshua.m@freelance.ph',
    'dr.reyes@medcenter.ph', 'angela.reyes@stlukes.com.ph', 'kenneth.b@techcorp.com',
    'patricia.g@gmail.com', 'carlos.f@venture.ph', 'elena.soriano@edu.ph',
    'elena.soriano@deped.gov.ph', 'mark.tan@surfmedia.ph', 'grace.d@yahoo.com',
    'grace.d@techstartup.ph', 'gab.cruz@creative.ph', 'cathy.tan@bdo.com.ph',
    'roberto.lim@macroholdings.com', 'carmela.s@gmail.com', 'mcheng@asiaventures.com',
    'ferdie.ramos@deped.gov.ph', 'lvillanueva@law.ph'
]);

const ALL_MOCK_NAMES = new Set([
    'juan dela cruz', 'maria santos', 'roberto & andrea lim', 'roberto lim',
    'joshua mendoza', 'dr. angela reyes', 'angela reyes', 'kenneth bautista',
    'kenneth bautista & group', 'patricia gomez', 'carlos fernandez',
    'elena soriano', 'mark vincent tan', 'grace dimaculangan', 'gabriel cruz',
    'cathy tan', 'carmela soriano', 'michael cheng', 'atty. liza villanueva',
    'ferdinand ramos'
]);

function isMockBooking(b) {
    if (!b || typeof b !== 'object') return true;
    if (b.id && (b.id.startsWith('BK-FL-') || b.id.startsWith('BK-BUS-') || b.id.startsWith('BK-PKG-'))) return false;
    if (b.id && ALL_MOCK_BOOKING_IDS.has(b.id)) return true;
    if (b.email && ALL_MOCK_EMAILS.has(b.email.toLowerCase().trim())) return true;
    if (b.customer && ALL_MOCK_NAMES.has(b.customer.toLowerCase().trim())) return true;
    return false;
}

// Data Store Accessors
function getBookings() {
    let list = getStored('bookings', null);
    if (list === null) {
        list = [];
        saveBookings(list);
    } else if (Array.isArray(list)) {
        let changed = false;
        const cleaned = list.filter(b => !isMockBooking(b));
        if (cleaned.length !== list.length) {
            list = cleaned;
            changed = true;
        }
        // Auto-repair any 0-amount, missing-amount, or missing-createdAt bookings from earlier test submissions
        list.forEach(b => {
            if (!b.amount || Number(b.amount) <= 0) {
                if (b.type === 'flight') {
                    b.amount = 3470 * (Number(b.pax) || 1);
                    changed = true;
                } else if (b.type === 'bus') {
                    b.amount = 680 * (Number(b.pax) || 1);
                    changed = true;
                } else if (b.type === 'package') {
                    b.amount = 14800 * (Number(b.pax) || 1);
                    changed = true;
                }
            }
            if (!b.createdAt) {
                b.createdAt = new Date().toISOString();
                changed = true;
            }
        });
        if (changed) {
            saveBookings(list);
        }
    }
    return list;
}
function saveBookings(data) { setStored('bookings', data); }

function getPackages() { return getStored('packages', DEFAULT_PACKAGES); }
function savePackages(data) { 
    setStored('packages', data); 
    try {
        window.dispatchEvent(new CustomEvent('packageDataUpdated', { detail: { packages: data } }));
    } catch (e) {}
}

function getBusSchedules() { return getStored('bus_schedules', DEFAULT_BUS_SCHEDULES); }
function saveBusSchedules(data) { setStored('bus_schedules', data); }

function getFlightSchedules() { return getStored('flight_schedules', DEFAULT_FLIGHT_SCHEDULES); }
function saveFlightSchedules(data) { setStored('flight_schedules', data); }

function getCustomers() {
    let list = getStored('customers', null);
    if (!list || (Array.isArray(list) && list.some(c => c.id === 'CUST-01' || c.name === 'Juan Dela Cruz' || c.email === 'juan.delacruz@gmail.com'))) {
        list = [...DEFAULT_CUSTOMERS];
        saveCustomers(list);
    }
    return list;
}
function saveCustomers(data) { setStored('customers', data); }

function getInquiries() {
    let list = getStored('inquiries', null);
    if (list === null) {
        list = [];
        saveInquiries(list);
    } else if (Array.isArray(list)) {
        const legacyMockInqIds = new Set(['INQ-101', 'INQ-102', 'INQ-103', 'INQ-104']);
        const cleaned = list.filter(q => q && q.id && !legacyMockInqIds.has(q.id) && q.email !== 'carmela.s@gmail.com' && q.email !== 'mcheng@asiaventures.com');
        if (cleaned.length !== list.length) {
            list = cleaned;
            saveInquiries(list);
        }
    }
    return list;
}

function getRegisteredAccounts() {
    try {
        const item = localStorage.getItem('mckanes_registered_accounts');
        return item ? JSON.parse(item) : [];
    } catch (e) {
        return [];
    }
}
function saveRegisteredAccounts(data) {
    try {
        localStorage.setItem('mckanes_registered_accounts', JSON.stringify(data));
    } catch (e) {
        console.error('Error saving registered accounts:', e);
    }
}
function saveInquiries(data) { setStored('inquiries', data); }

function getPromos() { return getStored('promos', DEFAULT_PROMOS); }
function savePromos(data) { setStored('promos', data); }

function getNotifications() {
    let list = getStored('notifications', null);
    if (!list || (Array.isArray(list) && list.some(n => n.desc && n.desc.includes('Juan Dela Cruz')))) {
        list = [...DEFAULT_NOTIFICATIONS];
        saveNotifications(list);
    }
    return list;
}
function saveNotifications(data) { setStored('notifications', data); }

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Purge legacy mock accounts from localStorage if present
    try {
        const rawCust = localStorage.getItem('mckanes_admin_customers');
        if (rawCust) {
            let custs = JSON.parse(rawCust);
            if (Array.isArray(custs) && custs.some(c => c.id === 'CUST-01' || c.name === 'Juan Dela Cruz')) {
                custs = [...DEFAULT_CUSTOMERS];
                localStorage.setItem('mckanes_admin_customers', JSON.stringify(custs));
            }
        }
        const rawUser = localStorage.getItem('mckanes_user');
        if (rawUser) {
            const u = JSON.parse(rawUser);
            if (!u.isAdmin && (u.name === 'Juan Dela Cruz' || u.name === 'Maria Santos' || u.email === 'juan.delacruz@gmail.com')) {
                localStorage.removeItem('mckanes_user');
            }
        }
    } catch (e) {}

    // Purge legacy mock bookings & inquiries from localStorage if present
    try {
        const rawBookings = localStorage.getItem('mckanes_admin_bookings');
        if (rawBookings) {
            let bks = JSON.parse(rawBookings);
            if (Array.isArray(bks)) {
                const cleaned = bks.filter(b => !isMockBooking(b));
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
    } catch (e) {}

    checkAdminAuth();
    initClock();
    renderDashboard();
    renderBookingsTable();
    renderPackages();
    renderFleet();
    renderCustomers();
    renderInquiries();
    renderPromos();
    renderNotifications();
    setupGlobalSearch();
    loadAgencySettings();

    // Support direct tab deeplinking via URL hash (e.g. admin.html#packages)
    try {
        const hash = (window.location.hash || '').replace('#tab-', '').replace('#', '');
        if (hash && document.getElementById(`tab-${hash}`)) {
            switchTab(hash);
        }
    } catch (e) {}

    // Close popovers on click outside
    document.addEventListener('click', (e) => {
        // Global Status dropdown outside click
        const statusDrop = document.getElementById('global-status-dropdown');
        if (statusDrop && !statusDrop.classList.contains('hidden')) {
            if (!statusDrop.contains(e.target) && !e.target.closest('.status-dropdown-btn')) {
                closeGlobalStatusDropdown();
            }
        }
        if (!e.target.closest('.status-dropdown-wrapper') && !e.target.closest('#global-status-dropdown')) {
            closeAllStatusDropdowns();
        }
        // Notification dropdown
        const notifBtn = document.getElementById('btn-notifications');
        const notifPanel = document.getElementById('admin-notifications-dropdown');
        if (notifBtn && notifPanel && !notifBtn.contains(e.target) && !notifPanel.contains(e.target)) {
            notifPanel.classList.add('hidden');
        }
        // Global search dropdown
        const searchBox = document.getElementById('admin-global-search-container');
        const searchResults = document.getElementById('admin-global-search-results');
        if (searchBox && searchResults && !searchBox.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });

    // Close status dropdown on scroll or window resize
    window.addEventListener('scroll', () => {
        const statusDrop = document.getElementById('global-status-dropdown');
        if (statusDrop && !statusDrop.classList.contains('hidden')) {
            closeGlobalStatusDropdown();
        }
    }, true);

    window.addEventListener('resize', () => {
        const statusDrop = document.getElementById('global-status-dropdown');
        if (statusDrop && !statusDrop.classList.contains('hidden')) {
            closeGlobalStatusDropdown();
        }
    });

    // Custom Confirm Modal backdrop click & keyboard navigation
    const confirmModal = document.getElementById('admin-confirm-modal');
    if (confirmModal) {
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) {
                resolveAdminConfirm(false);
            }
        });
    }

    // Add Package Modal & Edit Package Modal backdrop clicks
    const addPkgModalEl = document.getElementById('add-package-modal');
    if (addPkgModalEl) {
        addPkgModalEl.addEventListener('click', (e) => {
            if (e.target === addPkgModalEl) closeAddPackageModal();
        });
    }
    const editPkgModalEl = document.getElementById('package-edit-modal');
    if (editPkgModalEl) {
        editPkgModalEl.addEventListener('click', (e) => {
            if (e.target === editPkgModalEl) closePackageEditModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeGlobalStatusDropdown();
            closeAddPackageModal();
            closePackageEditModal();
        }
        const confirmModal = document.getElementById('admin-confirm-modal');
        if (confirmModal && !confirmModal.classList.contains('hidden')) {
            if (e.key === 'Escape') {
                resolveAdminConfirm(false);
            } else if (e.key === 'Enter') {
                const activeTag = document.activeElement ? document.activeElement.tagName : '';
                if (activeTag !== 'TEXTAREA') {
                    resolveAdminConfirm(true);
                }
            }
        }
    });
});

// Live Digital Clock (Topbar & Lock Screen HUD)
function initClock() {
    const clockEl = document.getElementById('live-clock');
    const lockClockEl = document.getElementById('admin-lock-clock');
    if (!clockEl && !lockClockEl) return;
    const update = () => {
        const now = new Date();
        if (clockEl) {
            const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            clockEl.textContent = now.toLocaleDateString('en-US', options);
        }
        if (lockClockEl) {
            const timeOptions = { timeZone: 'Asia/Manila', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
            lockClockEl.textContent = now.toLocaleTimeString('en-US', timeOptions) + ' PST';
        }
    };
    update();
    setInterval(update, 1000);
}


// Tab Navigation Controller
function switchTab(tabId) {
    currentTab = tabId;

    // Update Sidebar Navigation Link Styling
    const navButtons = document.querySelectorAll('.sidebar-nav-btn');
    navButtons.forEach(btn => {
        const target = btn.getAttribute('data-tab');
        if (target === tabId) {
            btn.className = 'sidebar-nav-btn flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs tracking-wide bg-blue-600 text-white shadow-md shadow-blue-500/20 transition cursor-pointer';
        } else {
            btn.className = 'sidebar-nav-btn flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs tracking-wide text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer';
        }
    });

    // Toggle Content Views
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(t => {
        if (t.id === `tab-${tabId}`) {
            t.classList.add('active');
        } else {
            t.classList.remove('active');
        }
    });

    // Close Mobile Sidebar if Open
    const sidebar = document.getElementById('admin-sidebar');
    if (sidebar && window.innerWidth < 1024) {
        sidebar.classList.add('-translate-x-full');
    }

    // Refresh Active View Data
    if (tabId === 'dashboard') renderDashboard();
    if (tabId === 'bookings') renderBookingsTable();
    if (tabId === 'packages') renderPackages();
    if (tabId === 'fleet') renderFleet();
    if (tabId === 'customers') renderCustomers();
    if (tabId === 'inquiries') renderInquiries();
    if (tabId === 'promos') renderPromos();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle Mobile Sidebar
function toggleAdminSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('-translate-x-full');
    }
}

// ==========================================================================
// 1. DASHBOARD OVERVIEW RENDERING
// ==========================================================================
function renderDashboard() {
    const bookings = getBookings();
    
    // Compute dynamic KPI metrics from live bookings
    const confirmedBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Completed');
    const totalRev = confirmedBookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    const totalPax = confirmedBookings.reduce((sum, b) => sum + (Number(b.pax) || 1), 0);

    const elRev = document.getElementById('kpi-revenue');
    const elBookings = document.getElementById('kpi-bookings');
    const elPax = document.getElementById('kpi-pax');

    if (elRev) elRev.textContent = `₱${totalRev.toLocaleString()}`;
    if (elBookings) elBookings.textContent = `${bookings.length}`;
    if (elPax) elPax.textContent = `${totalPax.toLocaleString()} Pax`;

    // Render Recent 6 Bookings Feed
    const feedBody = document.getElementById('dashboard-recent-tbody');
    if (feedBody) {
        const recent = bookings.slice(0, 6);
        if (recent.length === 0) {
            feedBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-12 text-gray-400">
                        <div class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-2 text-gray-300">
                            <i class="fas fa-calendar-xmark text-xl"></i>
                        </div>
                        <p class="font-bold text-gray-700 text-xs">No client bookings recorded yet</p>
                        <p class="text-[11px] text-gray-400 mt-1">New flight, bus, or tour package reservations will automatically appear here.</p>
                    </td>
                </tr>
            `;
        } else {
            feedBody.innerHTML = recent.map((b, idx) => {
                const badgeIcon = b.type === 'flight' ? 'fa-plane text-sky-500' : b.type === 'bus' ? 'fa-bus text-amber-500' : 'fa-umbrella-beach text-emerald-500';
                const statusClass = getStatusBadgeClass(b.status);
                const isTopRecent = idx === 0;
                return `
                    <tr class="border-b border-gray-100 hover:bg-slate-50/80 transition text-xs ${isTopRecent ? 'bg-gradient-to-r from-emerald-50/70 via-teal-50/30 to-transparent border-l-4 border-l-emerald-500 font-medium' : ''}">
                        <td class="py-3 px-4 font-mono font-bold text-blue-600">
                            <div class="flex items-center gap-1.5 flex-wrap">
                                <span>${b.id}</span>
                                ${isTopRecent ? '<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-xs"><i class="fas fa-sparkles text-[7px]"></i> New</span>' : ''}
                            </div>
                        </td>
                        <td class="py-3 px-4">
                            <div class="font-bold text-gray-900">${b.customer}</div>
                            <div class="text-[11px] text-gray-500 flex items-center gap-1">
                                <span>${b.email || 'No email'}</span>
                                ${b.phone ? `<span class="text-gray-300">•</span><span>${b.phone}</span>` : ''}
                            </div>
                        </td>
                        <td class="py-3 px-4">
                            <div class="flex items-center gap-1.5 font-semibold text-gray-800">
                                <i class="fas ${badgeIcon}"></i>
                                <span class="truncate max-w-[200px]">${b.title}</span>
                            </div>
                        </td>
                        <td class="py-3 px-4 font-extrabold text-gray-900">₱${(Number(b.amount) || 0).toLocaleString()}</td>
                        <td class="py-3 px-4">
                            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusClass}">
                                <span class="w-1.5 h-1.5 rounded-full ${getStatusDotClass(b.status)}"></span>
                                ${b.status}
                            </span>
                        </td>
                        <td class="py-3 px-4 text-right">
                            <button onclick="viewBookingDetails('${b.id}')" class="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer">
                                View →
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }
}

// Status Badges & Dot Styling
function getStatusBadgeClass(status) {
    switch (status) {
        case 'Confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'Completed': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'Cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
}

function getStatusDotClass(status) {
    switch (status) {
        case 'Confirmed': return 'bg-emerald-500';
        case 'Pending': return 'bg-amber-500';
        case 'Completed': return 'bg-blue-500';
        case 'Cancelled': return 'bg-rose-500';
        default: return 'bg-gray-500';
    }
}

// ==========================================================================
// 2. BOOKINGS MANAGEMENT ENGINE (Sorting, Pagination, Status Dropdowns)
// ==========================================================================
function filterBookings(type, val) {
    if (type === 'service') {
        bookingFilterService = (bookingFilterService === val && val !== 'all') ? 'all' : val;
        document.querySelectorAll('.filter-pill-service').forEach(btn => {
            const btnVal = btn.getAttribute('data-val');
            btn.className = btnVal === bookingFilterService 
                ? 'filter-pill-service bg-blue-600 text-white rounded-full px-3.5 py-1 text-xs font-semibold shadow-xs cursor-pointer'
                : 'filter-pill-service bg-white border border-gray-200 text-gray-600 hover:border-blue-400 rounded-full px-3.5 py-1 text-xs font-medium cursor-pointer transition';
        });
    } else if (type === 'status') {
        bookingFilterStatus = (bookingFilterStatus === val && val !== 'all') ? 'all' : val;
        const select = document.getElementById('bookings-status-select');
        if (select) select.value = bookingFilterStatus;
        
        // Update quick status count chips
        document.querySelectorAll('.quick-status-chip').forEach(chip => {
            const chipVal = chip.getAttribute('data-status');
            if (chipVal === bookingFilterStatus) {
                chip.classList.add('bg-blue-50', 'text-blue-700', 'border-blue-300', 'font-bold');
                chip.classList.remove('bg-white', 'text-gray-600', 'border-gray-200');
            } else {
                chip.classList.remove('bg-blue-50', 'text-blue-700', 'border-blue-300', 'font-bold');
                chip.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
            }
        });
    }
    bookingCurrentPage = 1;
    renderBookingsTable();
}

function handleBookingSearch(query) {
    bookingSearchQuery = query.toLowerCase().trim();
    bookingCurrentPage = 1;

    // Show/hide search clear button
    const clearBtn = document.getElementById('bookings-search-clear');
    if (clearBtn) {
        if (bookingSearchQuery) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
    }

    renderBookingsTable();
}

function clearBookingSearch() {
    const input = document.getElementById('bookings-search-input');
    if (input) input.value = '';
    handleBookingSearch('');
}

function sortBookings(column) {
    if (bookingSortColumn === column) {
        bookingSortDirection = bookingSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        bookingSortColumn = column;
        bookingSortDirection = 'asc';
    }
    renderBookingsTable();
}

function renderBookingsTable() {
    const tbody = document.getElementById('bookings-tbody');
    if (!tbody) return;

    let allBookings = getBookings();

    // Update Quick Status Counts
    updateQuickStatusCounters(allBookings);

    // Apply Filter by Service
    let list = allBookings;
    if (bookingFilterService !== 'all') {
        list = list.filter(b => b.type === bookingFilterService);
    }

    // Apply Filter by Status
    if (bookingFilterStatus !== 'all') {
        list = list.filter(b => b.status === bookingFilterStatus);
    }

    // Apply Filter by Search Query
    if (bookingSearchQuery) {
        list = list.filter(b => 
            b.id.toLowerCase().includes(bookingSearchQuery) ||
            b.customer.toLowerCase().includes(bookingSearchQuery) ||
            b.email.toLowerCase().includes(bookingSearchQuery) ||
            b.title.toLowerCase().includes(bookingSearchQuery) ||
            b.operator.toLowerCase().includes(bookingSearchQuery)
        );
    }

    // Apply Sorting
    list.sort((a, b) => {
        let valA = a[bookingSortColumn];
        let valB = b[bookingSortColumn];

        if (bookingSortColumn === 'amount' || bookingSortColumn === 'pax') {
            valA = Number(valA) || 0;
            valB = Number(valB) || 0;
            return bookingSortDirection === 'asc' ? valA - valB : valB - valA;
        }

        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
        if (valA < valB) return bookingSortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return bookingSortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    // Update sort header indicator arrows
    updateSortHeaderIndicators();

    // Update count indicator
    const countEl = document.getElementById('bookings-filter-count');
    if (countEl) countEl.textContent = `${list.length} Records Found`;

    // Empty state
    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-16 text-gray-400 text-xs">
                    <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400 text-xl">
                        <i class="fas fa-folder-open"></i>
                    </div>
                    <div class="font-bold text-gray-700 text-sm mb-1">${allBookings.length === 0 ? 'No client reservations placed yet' : 'No matching reservations found'}</div>
                    <p class="text-gray-400">${allBookings.length === 0 ? 'Confirmed flight, bus, or tour package bookings will appear here in real time.' : 'Try adjusting your search query, service filter or status selection.'}</p>
                    ${allBookings.length > 0 ? `
                        <button onclick="clearAllBookingFilters()" class="mt-3 text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer">
                            Reset All Filters
                        </button>
                    ` : `
                        <button onclick="openCreateBookingModal()" class="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer shadow-xs">
                            <i class="fas fa-plus text-[10px]"></i> Create First Booking
                        </button>
                    `}
                </td>
            </tr>
        `;
        renderPaginationControls(0, 0, 0);
        return;
    }

    // Pagination calculations
    const totalRecords = list.length;
    const totalPages = Math.ceil(totalRecords / bookingPageSize);
    if (bookingCurrentPage > totalPages) bookingCurrentPage = totalPages || 1;
    const startIndex = (bookingCurrentPage - 1) * bookingPageSize;
    const endIndex = Math.min(startIndex + bookingPageSize, totalRecords);
    const paginatedList = list.slice(startIndex, endIndex);

    // Render Table Rows
    tbody.innerHTML = paginatedList.map(b => {
        const badgeIcon = b.type === 'flight' ? 'fa-plane text-sky-500' : b.type === 'bus' ? 'fa-bus text-amber-500' : 'fa-umbrella-beach text-emerald-500';
        const typeBadge = b.type === 'flight' ? '<span class="text-[9px] bg-sky-50 text-sky-700 border border-sky-200 px-1.5 py-0.2 rounded font-extrabold uppercase">Flight</span>'
                        : b.type === 'bus' ? '<span class="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded font-extrabold uppercase">Bus</span>'
                        : '<span class="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-extrabold uppercase">Package</span>';

        const isChecked = selectedBookingIds.has(b.id) ? 'checked' : '';
        const statusClass = getStatusBadgeClass(b.status);
        const statusDotClass = getStatusDotClass(b.status);

        // Initials avatar
        const initials = b.customer.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() || 'TR';

        return `
            <tr class="border-b border-gray-100 hover:bg-slate-50/90 transition text-xs ${isChecked ? 'bg-blue-50/40' : ''}">
                <td class="py-3 px-3 text-center">
                    <input type="checkbox" onchange="toggleSelectBooking('${b.id}', this.checked)" class="custom-checkbox" ${isChecked}>
                </td>
                <td class="py-3 px-4 font-mono font-bold text-blue-600">
                    <div class="flex items-center gap-1.5">
                        <button onclick="copyToClipboard('${b.id}', 'Booking reference')" class="hover:text-blue-800 transition" title="Copy Reference">
                            ${b.id}
                        </button>
                    </div>
                    <div class="text-[10px] text-gray-400 font-normal font-sans mt-0.5">${b.createdAt}</div>
                </td>
                <td class="py-3 px-4">
                    <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-extrabold text-[10px] flex items-center justify-center flex-shrink-0 shadow-2xs">
                            ${initials}
                        </div>
                        <div class="min-w-0">
                            <div class="font-extrabold text-gray-900 truncate">${b.customer}</div>
                            <div class="text-[11px] text-gray-500 truncate">${b.email}</div>
                            <div class="text-[10px] text-gray-400">${b.phone || ''}</div>
                        </div>
                    </div>
                </td>
                <td class="py-3 px-4">
                    <div class="flex items-center gap-1.5 mb-1">
                        <i class="fas ${badgeIcon} text-xs"></i>
                        <span class="font-bold text-gray-900">${b.title}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        ${typeBadge}
                        <span class="text-[11px] text-gray-500 font-medium">${b.operator}</span>
                    </div>
                </td>
                <td class="py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">
                    <div class="flex items-center gap-1 text-gray-800 font-bold">
                        <i class="far fa-calendar text-[11px] text-blue-500"></i>
                        <span>${b.date}</span>
                    </div>
                    <div class="text-[10px] text-gray-400 mt-0.5">${b.pax} Traveler${b.pax > 1 ? 's' : ''}</div>
                </td>
                <td class="py-3 px-4 font-black text-gray-900 whitespace-nowrap">
                    <div class="text-sm">₱${b.amount.toLocaleString()}</div>
                    <div class="text-[10px] text-gray-500 font-normal mt-0.5">${b.paymentMethod}</div>
                </td>
                <td class="py-3 px-4 relative status-dropdown-wrapper">
                    <!-- Interactive Status Dropdown Button -->
                    <button type="button" onclick="toggleStatusDropdown('${b.id}', event)" class="status-dropdown-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusClass} hover:shadow-xs transition cursor-pointer">
                        <span class="w-1.5 h-1.5 rounded-full ${statusDotClass}"></span>
                        <span>${b.status}</span>
                        <i class="fas fa-chevron-down text-[8px] opacity-60 ml-0.5"></i>
                    </button>
                </td>
                <td class="py-3 px-4 text-center whitespace-nowrap">
                    <div class="inline-flex items-center gap-1.5">
                        <button onclick="viewBookingDetails('${b.id}')" title="View Full Details / E-Ticket" class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition cursor-pointer">
                            <i class="fas fa-eye text-xs"></i>
                        </button>
                        <button onclick="openEditBookingModal('${b.id}')" title="Edit Booking" class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition cursor-pointer">
                            <i class="fas fa-edit text-xs"></i>
                        </button>
                        <button onclick="deleteBooking('${b.id}')" title="Delete Booking" class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center transition cursor-pointer">
                            <i class="fas fa-trash-alt text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    renderPaginationControls(startIndex + 1, endIndex, totalRecords);
    updateBulkActionBar();
}

// Quick Status Counter Update
function updateQuickStatusCounters(bookings) {
    const totalCount = bookings.length;
    const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
    const pendingCount = bookings.filter(b => b.status === 'Pending').length;
    const completedCount = bookings.filter(b => b.status === 'Completed').length;
    const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length;

    const elAll = document.getElementById('chip-count-all');
    const elConf = document.getElementById('chip-count-confirmed');
    const elPend = document.getElementById('chip-count-pending');
    const elComp = document.getElementById('chip-count-completed');
    const elCanc = document.getElementById('chip-count-cancelled');

    if (elAll) elAll.textContent = totalCount;
    if (elConf) elConf.textContent = confirmedCount;
    if (elPend) elPend.textContent = pendingCount;
    if (elComp) elComp.textContent = completedCount;
    if (elCanc) elCanc.textContent = cancelledCount;
}

// Sort Header Indicator Arrows
function updateSortHeaderIndicators() {
    const cols = ['id', 'customer', 'date', 'amount', 'status'];
    cols.forEach(c => {
        const arrowEl = document.getElementById(`sort-icon-${c}`);
        if (arrowEl) {
            if (bookingSortColumn === c) {
                arrowEl.innerHTML = bookingSortDirection === 'asc' ? '<i class="fas fa-sort-up text-blue-600"></i>' : '<i class="fas fa-sort-down text-blue-600"></i>';
            } else {
                arrowEl.innerHTML = '<i class="fas fa-sort text-gray-300"></i>';
            }
        }
    });
}

// Pagination Renderer
function renderPaginationControls(start, end, total) {
    const infoEl = document.getElementById('bookings-pagination-info');
    const pagesEl = document.getElementById('bookings-pagination-pages');
    const btnPrev = document.getElementById('bookings-page-prev');
    const btnNext = document.getElementById('bookings-page-next');

    if (infoEl) {
        infoEl.textContent = total > 0 ? `Showing ${start}–${end} of ${total} reservations` : '0 reservations';
    }

    const totalPages = Math.ceil(total / bookingPageSize) || 1;

    if (btnPrev) {
        btnPrev.disabled = bookingCurrentPage <= 1;
        btnPrev.className = bookingCurrentPage <= 1 
            ? 'px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-300 cursor-not-allowed'
            : 'px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-xs font-semibold text-gray-700 cursor-pointer transition';
    }

    if (btnNext) {
        btnNext.disabled = bookingCurrentPage >= totalPages;
        btnNext.className = bookingCurrentPage >= totalPages 
            ? 'px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-300 cursor-not-allowed'
            : 'px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-xs font-semibold text-gray-700 cursor-pointer transition';
    }

    if (pagesEl) {
        let html = '';
        for (let i = 1; i <= totalPages; i++) {
            const isActive = i === bookingCurrentPage;
            html += `
                <button type="button" onclick="goToBookingPage(${i})" class="w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${isActive ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 border border-gray-200'}">
                    ${i}
                </button>
            `;
        }
        pagesEl.innerHTML = html;
    }
}

function goToBookingPage(page) {
    bookingCurrentPage = page;
    renderBookingsTable();
}

function changeBookingPage(delta) {
    const list = getFilteredBookingsList();
    const totalPages = Math.ceil(list.length / bookingPageSize) || 1;
    const next = bookingCurrentPage + delta;
    if (next >= 1 && next <= totalPages) {
        goToBookingPage(next);
    }
}

function changeBookingPageSize(size) {
    bookingPageSize = size === 'all' ? 9999 : parseInt(size);
    bookingCurrentPage = 1;
    renderBookingsTable();
}

function getFilteredBookingsList() {
    let list = getBookings();
    if (bookingFilterService !== 'all') list = list.filter(b => b.type === bookingFilterService);
    if (bookingFilterStatus !== 'all') list = list.filter(b => b.status === bookingFilterStatus);
    if (bookingSearchQuery) {
        list = list.filter(b => 
            b.id.toLowerCase().includes(bookingSearchQuery) ||
            b.customer.toLowerCase().includes(bookingSearchQuery) ||
            b.email.toLowerCase().includes(bookingSearchQuery) ||
            b.title.toLowerCase().includes(bookingSearchQuery)
        );
    }
    return list;
}

function clearAllBookingFilters() {
    bookingFilterService = 'all';
    bookingFilterStatus = 'all';
    bookingSearchQuery = '';
    const searchInput = document.getElementById('bookings-search-input');
    if (searchInput) searchInput.value = '';
    filterBookings('service', 'all');
    filterBookings('status', 'all');
}

// =============================================================================
// GLOBAL FIXED STATUS DROPDOWN PORTAL (IMMUNE TO OVERFLOW CLIPPING)
// =============================================================================
function toggleStatusDropdown(id, e) {
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    }

    const dropdown = document.getElementById('global-status-dropdown');
    if (!dropdown) return;

    // Toggle off if already open for this exact booking
    if (!dropdown.classList.contains('hidden') && activeStatusDropdownBookingId === id) {
        closeGlobalStatusDropdown();
        return;
    }

    const list = getBookings();
    const booking = list.find(b => b.id === id);
    if (!booking) return;

    activeStatusDropdownBookingId = id;
    openStatusDropdownId = id;

    // Update Ref Label in dropdown header
    const refEl = document.getElementById('global-status-dropdown-ref');
    if (refEl) refEl.textContent = id;

    // Highlight the booking's current active status
    const options = dropdown.querySelectorAll('[data-status-opt]');
    options.forEach(btn => {
        const optStatus = btn.getAttribute('data-status-opt');
        const checkIcon = btn.querySelector('.status-check-icon');
        if (optStatus === booking.status) {
            btn.classList.add('bg-slate-100', 'font-black');
            if (checkIcon) checkIcon.classList.remove('opacity-0');
        } else {
            btn.classList.remove('bg-slate-100', 'font-black');
            if (checkIcon) checkIcon.classList.add('opacity-0');
        }
    });

    // Make visible to measure exact layout dimensions
    dropdown.classList.remove('hidden');

    // Retrieve clicked trigger button coordinates
    let btn = (e && e.currentTarget) ? e.currentTarget : null;
    if (!btn) {
        btn = document.querySelector(`button[onclick*="toggleStatusDropdown('${id}'"]`);
    }

    if (btn) {
        const rect = btn.getBoundingClientRect();
        const dropWidth = dropdown.offsetWidth || 208;
        const dropHeight = dropdown.offsetHeight || 190;

        // Horizontal positioning: align left with button, clamp safely inside screen
        let left = rect.left;
        if (left + dropWidth > window.innerWidth - 12) {
            left = window.innerWidth - dropWidth - 12;
        }
        if (left < 12) left = 12;

        // Vertical auto-flip: check available viewport space below vs above
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        let top;

        if (spaceBelow < dropHeight + 10 && spaceAbove > dropHeight + 10) {
            // Flip UPWARDS
            top = rect.top - dropHeight - 6;
        } else {
            // Open DOWNWARDS
            top = rect.bottom + 6;
        }

        dropdown.style.top = `${Math.max(10, top)}px`;
        dropdown.style.left = `${left}px`;
    }
}

function closeGlobalStatusDropdown() {
    const dropdown = document.getElementById('global-status-dropdown');
    if (dropdown) {
        dropdown.classList.add('hidden');
    }
    activeStatusDropdownBookingId = null;
    openStatusDropdownId = null;
}

function closeAllStatusDropdowns() {
    closeGlobalStatusDropdown();
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.add('hidden'));
}

function handleGlobalStatusSelect(newStatus) {
    if (!activeStatusDropdownBookingId) return;
    const targetId = activeStatusDropdownBookingId;
    closeGlobalStatusDropdown();
    setDirectStatus(targetId, newStatus);
}

function setDirectStatus(id, newStatus) {
    closeGlobalStatusDropdown();
    const list = getBookings();
    const item = list.find(b => b.id === id);
    if (!item) return;

    item.status = newStatus;
    saveBookings(list);
    renderBookingsTable();
    renderDashboard();
    showAdminToast(`Updated ${id} status to ${newStatus}`, 'success');
}

// Bulk Selection Actions
function toggleSelectAllBookings(checked) {
    const list = getFilteredBookingsList();
    if (checked) {
        list.forEach(b => selectedBookingIds.add(b.id));
    } else {
        selectedBookingIds.clear();
    }
    renderBookingsTable();
}

function toggleSelectBooking(id, checked) {
    if (checked) selectedBookingIds.add(id);
    else selectedBookingIds.delete(id);
    updateBulkActionBar();
}

function updateBulkActionBar() {
    const bar = document.getElementById('bulk-action-bar');
    const countEl = document.getElementById('bulk-selected-count');
    const selectAllBox = document.getElementById('select-all-bookings-checkbox');

    if (!bar) return;

    if (selectedBookingIds.size > 0) {
        bar.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
        bar.classList.add('translate-y-0', 'opacity-100');
        if (countEl) countEl.textContent = `${selectedBookingIds.size} Selected`;
    } else {
        bar.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
        bar.classList.remove('translate-y-0', 'opacity-100');
        if (selectAllBox) selectAllBox.checked = false;
    }
}

function bulkSetStatus(status) {
    if (selectedBookingIds.size === 0) return;
    const list = getBookings();
    list.forEach(b => {
        if (selectedBookingIds.has(b.id)) {
            b.status = status;
        }
    });
    const count = selectedBookingIds.size;
    saveBookings(list);
    selectedBookingIds.clear();
    renderBookingsTable();
    renderDashboard();
    showAdminToast(`Updated ${count} booking${count > 1 ? 's' : ''} to ${status}!`, 'success');
}

function bulkDelete() {
    if (selectedBookingIds.size === 0) return;
    const count = selectedBookingIds.size;
    showAdminConfirmModal({
        title: 'Delete Selected Reservations?',
        message: `Are you sure you want to delete ${count} selected reservation${count > 1 ? 's' : ''}? This action will permanently remove them from local records.`,
        icon: 'fas fa-trash-alt',
        iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
        confirmText: `Delete (${count})`,
        confirmIcon: 'fas fa-trash-alt',
        confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25',
        cancelText: 'Cancel'
    }).then(confirmed => {
        if (!confirmed) return;

        let list = getBookings();
        list = list.filter(b => !selectedBookingIds.has(b.id));
        saveBookings(list);
        selectedBookingIds.clear();
        renderBookingsTable();
        renderDashboard();
        showAdminToast('Selected bookings deleted successfully.', 'info');
    });
}

function clearBulkSelection() {
    selectedBookingIds.clear();
    renderBookingsTable();
}

// Delete Booking
function deleteBooking(id) {
    showAdminConfirmModal({
        title: 'Delete Reservation?',
        message: `Are you sure you want to delete booking ${id}? This action will permanently remove it from local records.`,
        icon: 'fas fa-trash-alt',
        iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
        confirmText: 'Delete Booking',
        confirmIcon: 'fas fa-trash-alt',
        confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25',
        cancelText: 'Cancel'
    }).then(confirmed => {
        if (!confirmed) return;

        let list = getBookings();
        list = list.filter(b => b.id !== id);
        saveBookings(list);
        renderBookingsTable();
        renderDashboard();
        showAdminToast(`Booking ${id} deleted successfully`, 'info');
    });
}

// View Full Details Modal (Enhanced Executive Manifest Controller)
function viewBookingDetails(id) {
    const list = getBookings();
    const b = list.find(item => item.id === id);
    if (!b) return;

    // 1. Reference & Formatted Created Timestamp
    const refEl = document.getElementById('modal-booking-ref');
    if (refEl) refEl.textContent = b.id;

    const createdEl = document.getElementById('modal-booking-created');
    if (createdEl) {
        if (b.createdAt) {
            try {
                const cDate = new Date(b.createdAt);
                createdEl.textContent = isNaN(cDate.getTime()) ? b.createdAt : cDate.toLocaleString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                });
            } catch (e) {
                createdEl.textContent = b.createdAt;
            }
        } else {
            createdEl.textContent = `${b.date || 'Oct 18, 2026'} • Confirmed`;
        }
    }

    // 2. Traveler Profile & Contact
    const custEl = document.getElementById('modal-booking-customer');
    if (custEl) custEl.textContent = b.customer || 'Traveler';

    const initialsEl = document.getElementById('modal-booking-initials');
    if (initialsEl) {
        const parts = (b.customer || 'TR').trim().split(/\s+/);
        const initials = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : (parts[0].slice(0, 2).toUpperCase() || 'TR');
        initialsEl.textContent = initials;
    }

    const emailEl = document.getElementById('modal-booking-email');
    if (emailEl) emailEl.textContent = b.email || 'No email provided';

    const emailLink = document.getElementById('modal-booking-email-link');
    if (emailLink && b.email) emailLink.href = `mailto:${b.email}`;

    const phoneEl = document.getElementById('modal-booking-phone');
    if (phoneEl) phoneEl.textContent = b.phone || '+63 917 123 4567';

    const phoneLink = document.getElementById('modal-booking-phone-link');
    if (phoneLink && b.phone) phoneLink.href = `tel:${b.phone.replace(/[^0-9+]/g, '')}`;

    // 3. Journey & Service Manifest
    const serviceEl = document.getElementById('modal-booking-service');
    if (serviceEl) serviceEl.textContent = b.title;

    const opEl = document.getElementById('modal-booking-operator');
    if (opEl) opEl.textContent = b.operator || 'Mckanes Partner';

    const dateEl = document.getElementById('modal-booking-date');
    if (dateEl) dateEl.textContent = b.date;

    const paxEl = document.getElementById('modal-booking-pax');
    const paxNum = Number(b.pax) || 1;
    if (paxEl) paxEl.textContent = `${paxNum} Passenger${paxNum > 1 ? 's' : ''}`;

    const seatEl = document.getElementById('modal-booking-seat');
    if (seatEl) seatEl.textContent = b.seat || 'Standard Allocation';

    const isFlight = b.type === 'flight' || (b.title && b.title.includes('Flight')) || (b.id && b.id.includes('FLIGHT')) || (b.id && b.id.includes('5J'));
    const isBus = b.type === 'bus' || (b.title && b.title.includes('Express')) || (b.id && b.id.includes('BUS'));

    const typeIconEl = document.getElementById('modal-booking-type-icon');
    if (typeIconEl) {
        typeIconEl.className = isFlight ? 'fas fa-plane text-sky-400' : isBus ? 'fas fa-bus text-amber-400' : 'fas fa-umbrella-beach text-emerald-400';
    }

    const typeBadgeEl = document.getElementById('modal-booking-type-badge');
    if (typeBadgeEl) {
        typeBadgeEl.textContent = isFlight ? 'Official Flight Manifest' : isBus ? 'Bus Express Transit Pass' : 'Tour Package Reservation';
    }

    const cabinEl = document.getElementById('modal-booking-cabin');
    if (cabinEl) {
        cabinEl.textContent = b.cabin || (isFlight ? 'Economy Class' : isBus ? 'Executive Deluxe' : 'Guided Vacation');
    }

    const baggageEl = document.getElementById('modal-booking-baggage');
    if (baggageEl) {
        baggageEl.innerHTML = `<i class="fas fa-suitcase text-slate-400 text-[11px]"></i> ${b.baggage || (isFlight ? '20kg Checked + 7kg Hand-carry Included' : isBus ? '25kg Cargo Compartment' : 'Standard Touring Allowance')}`;
    }

    // 4. Financial & Payment Info
    const paymentEl = document.getElementById('modal-booking-payment');
    if (paymentEl) paymentEl.textContent = (b.paymentMethod || 'GCASH').toUpperCase();

    const totalEl = document.getElementById('modal-booking-total');
    if (totalEl) totalEl.textContent = `₱${(Number(b.amount) || 0).toLocaleString()}`;

    // 5. Operational Notes
    const notesInput = document.getElementById('modal-booking-notes');
    if (notesInput) notesInput.value = b.notes || '';

    // 6. Quick Status Select Inside Modal
    const modalSelect = document.getElementById('modal-booking-status-select');
    if (modalSelect) {
        modalSelect.value = b.status || 'Confirmed';
        modalSelect.setAttribute('data-id', b.id);
        updateModalSelectStyle(modalSelect, b.status || 'Confirmed');
    }

    const modal = document.getElementById('booking-details-modal');
    if (modal) modal.classList.remove('hidden');
}

function updateModalSelectStyle(selectEl, status) {
    if (!selectEl) return;
    if (status === 'Confirmed') {
        selectEl.className = "bg-emerald-950/90 text-emerald-200 border-2 border-emerald-500/80 focus:border-emerald-400 pl-3 pr-8 py-1.5 rounded-xl text-xs font-black tracking-wide outline-none cursor-pointer appearance-none shadow-sm transition";
    } else if (status === 'Pending') {
        selectEl.className = "bg-amber-950/90 text-amber-200 border-2 border-amber-500/80 focus:border-amber-400 pl-3 pr-8 py-1.5 rounded-xl text-xs font-black tracking-wide outline-none cursor-pointer appearance-none shadow-sm transition";
    } else if (status === 'Completed') {
        selectEl.className = "bg-blue-950/90 text-blue-200 border-2 border-blue-500/80 focus:border-blue-400 pl-3 pr-8 py-1.5 rounded-xl text-xs font-black tracking-wide outline-none cursor-pointer appearance-none shadow-sm transition";
    } else if (status === 'Cancelled') {
        selectEl.className = "bg-rose-950/90 text-rose-200 border-2 border-rose-500/80 focus:border-rose-400 pl-3 pr-8 py-1.5 rounded-xl text-xs font-black tracking-wide outline-none cursor-pointer appearance-none shadow-sm transition";
    }
}

function handleModalStatusChange(newStatus) {
    const select = document.getElementById('modal-booking-status-select');
    const id = select ? select.getAttribute('data-id') : null;
    if (!id) return;
    updateModalSelectStyle(select, newStatus);
    setDirectStatus(id, newStatus);
}

function handleSaveBookingNotes() {
    const select = document.getElementById('modal-booking-status-select');
    const id = select ? select.getAttribute('data-id') : null;
    const notesInput = document.getElementById('modal-booking-notes');
    if (!id || !notesInput) return;

    const list = getBookings();
    const b = list.find(item => item.id === id);
    if (b) {
        b.notes = notesInput.value.trim();
        saveBookings(list);
        showAdminToast('Operational notes saved successfully!', 'success');
    }
}

function appendQuickNote(tag) {
    const notesInput = document.getElementById('modal-booking-notes');
    if (!notesInput) return;
    const current = notesInput.value.trim();
    if (current && !current.includes(tag)) {
        notesInput.value = `${current} • [${tag}]`;
    } else if (!current) {
        notesInput.value = `[${tag}]`;
    }
    notesInput.focus();
}

function copyModalRef() {
    const ref = document.getElementById('modal-booking-ref')?.textContent;
    if (ref) {
        navigator.clipboard.writeText(ref).then(() => {
            showAdminToast(`Reference ${ref} copied to clipboard!`, 'info');
        }).catch(() => {
            showAdminToast(`Copied: ${ref}`, 'info');
        });
    }
}

function copyFullBookingManifest() {
    const select = document.getElementById('modal-booking-status-select');
    const id = select ? select.getAttribute('data-id') : null;
    if (!id) return;
    const list = getBookings();
    const b = list.find(item => item.id === id);
    if (!b) return;

    const manifest = `=====================================================
MCKANES TRAVEL AND TOURS • OFFICIAL E-TICKET MANIFEST
=====================================================
Booking Reference: ${b.id}
Operational Status: ${b.status}
Booking Date: ${b.date}

TRAVELER INFORMATION:
- Lead Passenger: ${b.customer}
- Email: ${b.email}
- Phone: ${b.phone || 'N/A'}
- Passenger Count: ${b.pax} Traveler${(Number(b.pax) || 1) > 1 ? 's' : ''}

JOURNEY & SERVICE DETAILS:
- Service: ${b.title}
- Carrier / Operator: ${b.operator}
- Seat Allocation: ${b.seat || 'Standard'}
- Cabin / Class: ${b.cabin || 'Economy'}

PAYMENT SUMMARY:
- Payment Method: ${b.paymentMethod}
- Total Amount Paid: ₱${(Number(b.amount) || 0).toLocaleString()}

OPERATIONAL NOTES:
${b.notes || 'None'}
=====================================================`;

    navigator.clipboard.writeText(manifest).then(() => {
        showAdminToast('Complete E-Ticket Manifest copied to clipboard!', 'success');
    }).catch(() => {
        showAdminToast(`Manifest ${b.id} copied!`, 'info');
    });
}

function openEditBookingFromView() {
    const select = document.getElementById('modal-booking-status-select');
    const id = select ? select.getAttribute('data-id') : null;
    if (id) {
        closeBookingModal();
        openEditBookingModal(id);
    }
}

function printBookingManifest() {
    window.print();
}

function closeBookingModal() {
    const modal = document.getElementById('booking-details-modal');
    if (modal) modal.classList.add('hidden');
}

// Edit Booking Modal
function openEditBookingModal(id) {
    const list = getBookings();
    const b = list.find(item => item.id === id);
    if (!b) return;

    document.getElementById('edit-booking-id').value = b.id;
    document.getElementById('edit-booking-name').value = b.customer;
    document.getElementById('edit-booking-email').value = b.email;
    document.getElementById('edit-booking-phone').value = b.phone || '';
    document.getElementById('edit-booking-route').value = b.title;
    document.getElementById('edit-booking-operator').value = b.operator;
    document.getElementById('edit-booking-date').value = b.date;
    document.getElementById('edit-booking-pax').value = b.pax;
    document.getElementById('edit-booking-seat').value = b.seat || '';
    document.getElementById('edit-booking-amount').value = b.amount;
    document.getElementById('edit-booking-payment').value = b.paymentMethod;
    document.getElementById('edit-booking-status').value = b.status;

    const modal = document.getElementById('edit-booking-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeEditBookingModal() {
    const modal = document.getElementById('edit-booking-modal');
    if (modal) modal.classList.add('hidden');
}

function handleEditBookingSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('edit-booking-id').value;
    const list = getBookings();
    const b = list.find(item => item.id === id);
    if (!b) return;

    b.customer = document.getElementById('edit-booking-name').value.trim();
    b.email = document.getElementById('edit-booking-email').value.trim();
    b.phone = document.getElementById('edit-booking-phone').value.trim();
    b.title = document.getElementById('edit-booking-route').value.trim();
    b.operator = document.getElementById('edit-booking-operator').value.trim();
    b.date = document.getElementById('edit-booking-date').value;
    b.pax = parseInt(document.getElementById('edit-booking-pax').value) || 1;
    b.seat = document.getElementById('edit-booking-seat').value.trim();
    b.amount = parseFloat(document.getElementById('edit-booking-amount').value) || 0;
    b.paymentMethod = document.getElementById('edit-booking-payment').value;
    b.status = document.getElementById('edit-booking-status').value;

    saveBookings(list);
    closeEditBookingModal();
    renderBookingsTable();
    renderDashboard();
    showAdminToast(`Booking ${id} updated successfully!`, 'success');
}

// Create Manual Booking Modal
function openCreateBookingModal() {
    const modal = document.getElementById('create-booking-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeCreateBookingModal() {
    const modal = document.getElementById('create-booking-modal');
    if (modal) modal.classList.add('hidden');
}

function handleCreateServiceChange(type) {
    const operatorInput = document.getElementById('new-booking-operator');
    const routeInput = document.getElementById('new-booking-route');
    const amountInput = document.getElementById('new-booking-amount');

    if (type === 'flight') {
        operatorInput.value = 'Philippine Airlines';
        routeInput.value = 'Manila (MNL) ➔ Caticlan / Boracay (MPH)';
        amountInput.value = '4375';
    } else if (type === 'bus') {
        operatorInput.value = 'Victory Liner';
        routeInput.value = 'Manila (Pasay) ➔ Baguio City';
        amountInput.value = '850';
    } else {
        operatorInput.value = 'Henann Crystal Sands';
        routeInput.value = 'Boracay Ultimate Tropical Retreat (3D2N)';
        amountInput.value = '8499';
    }
}

function handleCreateBookingSubmit(e) {
    e.preventDefault();
    const type = document.getElementById('new-booking-type').value;
    const customer = document.getElementById('new-booking-name').value.trim();
    const email = document.getElementById('new-booking-email').value.trim();
    const phone = document.getElementById('new-booking-phone').value.trim();
    const title = document.getElementById('new-booking-route').value.trim();
    const operator = document.getElementById('new-booking-operator').value.trim();
    const date = document.getElementById('new-booking-date').value;
    const pax = parseInt(document.getElementById('new-booking-pax').value) || 1;
    const amount = parseFloat(document.getElementById('new-booking-amount').value) || 0;
    const paymentMethod = document.getElementById('new-booking-payment').value;

    const prefix = type === 'flight' ? 'MCK-FL-' : type === 'bus' ? 'MCK-BUS-' : 'MCK-PKG-';
    const randId = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
        id: randId,
        type: type,
        title: title,
        customer: customer,
        email: email,
        phone: phone,
        date: date,
        operator: operator,
        pax: pax,
        amount: amount,
        paymentMethod: paymentMethod,
        status: "Confirmed",
        seat: pax > 1 ? `Assigned (${pax} Seats)` : "Standard Seat",
        notes: "Direct booking registered via Admin Console.",
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    const list = getBookings();
    list.unshift(newBooking);
    saveBookings(list);

    // Synchronize customer profile
    if (customer || email) {
        let customers = getCustomers();
        const bEmail = email.toLowerCase().trim();
        const bCust = customer.toLowerCase().trim();
        let cIdx = customers.findIndex(c => 
            (bEmail && c.email && c.email.toLowerCase().trim() === bEmail) ||
            (bCust && c.name && c.name.toLowerCase().trim() === bCust)
        );

        if (cIdx >= 0) {
            customers[cIdx].trips = (Number(customers[cIdx].trips) || 0) + 1;
            customers[cIdx].totalSpend = (Number(customers[cIdx].totalSpend) || 0) + amount;
            customers[cIdx].lastActive = new Date().toISOString();
            if (customers[cIdx].totalSpend >= 60000) customers[cIdx].tier = "Platinum VIP";
            else if (customers[cIdx].totalSpend >= 25000) customers[cIdx].tier = "Gold VIP";
            else if (customers[cIdx].totalSpend >= 10000) customers[cIdx].tier = "Silver";
        } else {
            const nextId = 'CUST-' + String(customers.length + 1).padStart(2, '0');
            customers.unshift({
                id: nextId,
                name: customer,
                email: email,
                phone: phone,
                city: 'Metro Manila',
                tier: amount >= 60000 ? 'Platinum VIP' : amount >= 25000 ? 'Gold VIP' : amount >= 10000 ? 'Silver' : 'Bronze',
                trips: 1,
                totalSpend: amount,
                status: 'Active',
                joinedAt: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                loginCount: 1,
                notes: 'Created via Admin Manual Reservation.'
            });
        }
        saveCustomers(customers);
    }

    // Add notification
    let notifs = getNotifications();
    notifs.unshift({
        id: 'NOTIF-' + Date.now(),
        title: 'New Manual Reservation',
        desc: `${customer} registered for ${title} (₱${amount.toLocaleString()})`,
        time: 'Just now',
        type: 'booking',
        unread: true
    });
    saveNotifications(notifs.slice(0, 25));

    closeCreateBookingModal();
    renderBookingsTable();
    renderDashboard();
    renderCustomers();
    renderNotifications();
    showAdminToast(`Created booking ${randId} for ${customer}!`, 'success');
}

// Clear All Test Bookings
function clearAllTestBookings() {
    showAdminConfirmModal({
        title: 'Purge All Bookings?',
        message: 'Are you sure you want to clear all test bookings? This will purge all reservations and reset the Bookings directory to a completely clean state.',
        icon: 'fas fa-exclamation-triangle',
        iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
        confirmText: 'Purge Bookings',
        confirmIcon: 'fas fa-eraser',
        confirmClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25',
        cancelText: 'Cancel'
    }).then(confirmed => {
        if (!confirmed) return;

        localStorage.removeItem('mckanes_admin_bookings');
        saveBookings([]);
        selectedBookingIds.clear();
        bookingFilterService = 'all';
        bookingFilterStatus = 'all';
        bookingSearchQuery = '';
        renderBookingsTable();
        renderDashboard();
        renderFleet();
        showAdminToast('All reservations cleared! Directory is now ready for live bookings.', 'success');
    });
}

// Export Bookings to CSV
function exportBookingsCSV(onlySelected = false) {
    let list = getBookings();
    if (onlySelected && selectedBookingIds.size > 0) {
        list = list.filter(b => selectedBookingIds.has(b.id));
    }

    let csv = "Booking Reference,Service Type,Title,Customer,Email,Phone,Travel Date,Operator,Passengers,Amount PHP,Payment Method,Status,Created At\n";

    list.forEach(b => {
        csv += `"${b.id}","${b.type}","${b.title}","${b.customer}","${b.email}","${b.phone || ''}","${b.date}","${b.operator}","${b.pax}","${b.amount}","${b.paymentMethod}","${b.status}","${b.createdAt}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `mckanes_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showAdminToast(`Exported ${list.length} bookings to CSV successfully!`, 'success');
}

// ==========================================================================
// 3. CURATED TOUR PACKAGES MANAGEMENT
// ==========================================================================
function renderPackages() {
    const container = document.getElementById('packages-grid');
    if (!container) return;

    const packages = getPackages();

    // Live Badge Counter in Header
    const badgeEl = document.getElementById('packages-count-badge');
    if (badgeEl) {
        const activeCount = packages.filter(p => p.status === 'Active').length;
        badgeEl.textContent = `● ${activeCount} Active Holiday Bundles (${packages.length} Total)`;
    }

    if (packages.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner">
                    <i class="fas fa-map-location-dot"></i>
                </div>
                <h4 class="font-extrabold text-base text-gray-900 mb-1">No Vacation Packages Found</h4>
                <p class="text-xs text-gray-500 max-w-sm mx-auto mb-4">You have not added any vacation packages or all existing packages have been removed.</p>
                <button type="button" onclick="openAddPackageModal()" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer">
                    <i class="fas fa-plus-circle"></i> Add First Place
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = packages.map(pkg => {
        const capacity = Number(pkg.capacity) || 25;
        const booked = Number(pkg.booked) || 0;
        const pct = Math.min(100, Math.round((booked / capacity) * 100));
        const price = Number(pkg.price || pkg.basePrice || 0);

        return `
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
                <div class="relative h-44 overflow-hidden bg-gray-100">
                    <img src="${pkg.image || 'images/place1.jpg'}" alt="${pkg.name}" class="w-full h-full object-cover">
                    <span class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        ${pkg.duration || '3D2N'}
                    </span>
                    <span class="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${pkg.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'}">
                        ${pkg.status || 'Active'}
                    </span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <div class="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">${pkg.destination || 'Philippines'}</div>
                        <h4 class="font-extrabold text-sm text-gray-900 leading-tight mb-2">${pkg.name}</h4>
                        <div class="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
                            <i class="fas fa-ticket-alt text-xs text-blue-500"></i> ${pkg.transport || 'Flights Included'}
                        </div>
                    </div>

                    <div>
                        <!-- Slots Meter -->
                        <div class="mb-3">
                            <div class="flex justify-between text-[11px] font-semibold text-gray-600 mb-1">
                                <span>Booked Slots</span>
                                <span>${booked} / ${capacity} (${pct}%)</span>
                            </div>
                            <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div class="bg-blue-600 h-2 rounded-full" style="width: ${pct}%"></div>
                            </div>
                        </div>

                        <!-- Price and Controls -->
                        <div class="pt-3 border-t border-gray-100 flex items-center justify-between">
                            <div>
                                <span class="text-[10px] text-gray-400 block">Rate / Pax</span>
                                <span class="text-base font-black text-gray-900">₱${price.toLocaleString()}</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <button onclick="togglePackageStatus('${pkg.id}')" class="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 text-xs font-semibold text-gray-700 transition cursor-pointer">
                                    ${pkg.status === 'Active' ? 'Pause' : 'Activate'}
                                </button>
                                <button onclick="openPackageEditModal('${pkg.id}')" class="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition cursor-pointer">
                                    Edit Rate
                                </button>
                                <button onclick="deletePackage('${pkg.id}')" title="Delete Package" class="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition cursor-pointer">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function togglePackageStatus(id) {
    const list = getPackages();
    const pkg = list.find(p => p.id === id);
    if (!pkg) return;
    pkg.status = pkg.status === 'Active' ? 'Paused' : 'Active';
    savePackages(list);
    renderPackages();
    showAdminToast(`Package ${pkg.name} is now ${pkg.status}`, 'info');
}

// Delete Tour Package with Confirmation Modal
function deletePackage(id) {
    const list = getPackages();
    const pkg = list.find(p => p.id === id);
    const name = pkg ? pkg.name : 'this package';

    showAdminConfirmModal({
        title: 'Delete Tour Package?',
        message: `Are you sure you want to delete "${name}"? This package will be removed from the catalog and will no longer appear on the client website.`,
        icon: 'fas fa-trash-alt',
        iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
        confirmText: 'Delete Package',
        confirmIcon: 'fas fa-trash-alt',
        confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25',
        cancelText: 'Cancel'
    }).then(confirmed => {
        if (!confirmed) return;

        const updated = list.filter(p => p.id !== id);
        savePackages(updated);
        renderPackages();
        showAdminToast(`Package "${name}" removed successfully.`, 'info');
    });
}

// ==========================================================================
// ADD NEW PLACE / VACATION PACKAGE MODAL CONTROLLERS
// ==========================================================================
function openAddPackageModal() {
    const form = document.getElementById('add-package-form');
    if (form) form.reset();

    const imgInput = document.getElementById('add-pkg-image');
    if (imgInput) imgInput.value = 'images/place1.jpg';
    updateAddImagePreview('images/place1.jpg');

    // Reset preset buttons styling
    const presetBtns = document.querySelectorAll('.preset-img-btn');
    presetBtns.forEach((btn, idx) => {
        if (idx === 0) {
            btn.className = 'preset-img-btn group relative rounded-xl overflow-hidden border-2 border-blue-600 ring-2 ring-blue-500/30 h-14 cursor-pointer';
        } else {
            btn.className = 'preset-img-btn group relative rounded-xl overflow-hidden border-2 border-transparent hover:border-gray-300 h-14 cursor-pointer';
        }
    });

    const modal = document.getElementById('add-package-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeAddPackageModal() {
    const modal = document.getElementById('add-package-modal');
    if (modal) modal.classList.add('hidden');
}

function selectPresetImage(src, btn) {
    const imgInput = document.getElementById('add-pkg-image');
    if (imgInput) imgInput.value = src;
    updateAddImagePreview(src);

    const presetBtns = document.querySelectorAll('.preset-img-btn');
    presetBtns.forEach(b => {
        b.className = 'preset-img-btn group relative rounded-xl overflow-hidden border-2 border-transparent hover:border-gray-300 h-14 cursor-pointer';
    });
    if (btn) {
        btn.className = 'preset-img-btn group relative rounded-xl overflow-hidden border-2 border-blue-600 ring-2 ring-blue-500/30 h-14 cursor-pointer';
    }
}

function updateAddImagePreview(val) {
    const preview = document.getElementById('add-pkg-image-preview');
    if (preview) {
        preview.src = val ? val.trim() : 'images/place1.jpg';
        preview.onerror = () => {
            preview.src = 'images/place1.jpg';
        };
    }
}

function handleCreatePackageSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById('add-pkg-name');
    const destInput = document.getElementById('add-pkg-dest');
    const catInput = document.getElementById('add-pkg-category');
    const durInput = document.getElementById('add-pkg-duration');
    const transInput = document.getElementById('add-pkg-transport');
    const priceInput = document.getElementById('add-pkg-price');
    const origPriceInput = document.getElementById('add-pkg-original-price');
    const capInput = document.getElementById('add-pkg-capacity');
    const resortInput = document.getElementById('add-pkg-resort');
    const imgInput = document.getElementById('add-pkg-image');
    const overviewInput = document.getElementById('add-pkg-overview');

    const name = nameInput ? nameInput.value.trim() : '';
    const destination = destInput ? destInput.value.trim() : '';
    if (!name || !destination) {
        showAdminToast('Please provide both package title and destination location.', 'error');
        return;
    }

    const category = catInput ? catInput.value : 'island';
    const duration = durInput && durInput.value.trim() ? durInput.value.trim() : '3D2N';
    const transport = transInput ? transInput.value : 'Flights Included';
    const price = priceInput ? (parseFloat(priceInput.value) || 0) : 0;
    const customOrigPrice = origPriceInput ? parseFloat(origPriceInput.value) : 0;
    const originalPrice = (!isNaN(customOrigPrice) && customOrigPrice > price) ? customOrigPrice : Math.round(price * 1.35);
    const capacity = capInput ? (parseInt(capInput.value) || 25) : 25;
    const resort = resortInput && resortInput.value.trim() ? resortInput.value.trim() : `${destination} Heritage Resort & Suites`;
    const image = imgInput && imgInput.value.trim() ? imgInput.value.trim() : 'images/place1.jpg';
    const overview = overviewInput && overviewInput.value.trim() ? overviewInput.value.trim() : `Comprehensive guided tour exploring scenic destinations and landmarks in ${destination}.`;

    // Parse stay days and nights from duration
    let stayDays = 3;
    let stayNights = 2;
    const dMatch = duration.match(/(\d+)\s*[dD]/);
    const nMatch = duration.match(/(\d+)\s*[nN]/);
    if (dMatch) stayDays = parseInt(dMatch[1]) || 3;
    if (nMatch) stayNights = parseInt(nMatch[1]) || Math.max(1, stayDays - 1);

    // Discount text
    let discountText = 'Special Promo';
    if (originalPrice > price) {
        const pct = Math.round(((originalPrice - price) / originalPrice) * 100);
        discountText = `Save ${pct}%`;
    }

    // Category badge styling
    let badgeColor = 'bg-blue-600 text-white';
    let badge = '✨ Featured Destination';
    if (category === 'beach') {
        badgeColor = 'bg-cyan-600 text-white';
        badge = '🏖️ Tropical Beach';
    } else if (category === 'highland') {
        badgeColor = 'bg-emerald-600 text-white';
        badge = '⛰️ Mountain Escape';
    } else if (category === 'adventure') {
        badgeColor = 'bg-amber-600 text-white';
        badge = '🧭 Heritage Tour';
    }

    // Generate unique ID slug
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const uniqueSuffix = Date.now().toString(36).substring(4);
    const id = `${baseSlug || 'pkg'}-${uniqueSuffix}`;

    const isFlight = transport.toLowerCase().includes('flight');

    const newPkg = {
        id: id,
        altId: id,
        name: name,
        destination: destination,
        region: 'Philippines',
        category: category,
        badge: badge,
        badgeColor: badgeColor,
        duration: `${stayDays} Days / ${stayNights} Nights`,
        stayDays: stayDays,
        stayNights: stayNights,
        transport: transport,
        transportType: isFlight ? 'flight' : 'bus',
        transportBadge: isFlight ? '✈️ Roundtrip Flights Included' : '🚌 Deluxe Bus Included',
        resort: resort,
        price: price,
        basePrice: price,
        originalPrice: originalPrice,
        discount: discountText,
        rating: '4.9',
        reviewsCount: Math.floor(Math.random() * 60) + 40,
        capacity: capacity,
        booked: 0,
        status: 'Active',
        image: image,
        inclusions: [
            transport,
            `${stayDays}D${stayNights}N Accommodation at ${resort}`,
            'Daily Complimentary Breakfast',
            'Airport / Terminal Land Transfers',
            'Full Itinerary Guided Sightseeing & Eco-Tours',
            'All Environmental, Terminal & Entry Fees'
        ],
        highlights: [
            `${destination} Panoramic Sightseeing`,
            'Curated Local Culture & Heritage Tour',
            'Scenic Photo Opportunities & Viewpoints',
            'Dedicated Mckanes Tour Guide & Assistance'
        ],
        itinerary: [
            {
                day: 1,
                title: `Arrival & Welcome to ${destination}`,
                desc: `Arrival via ${transport}. Welcome meet & greet by Mckanes tour coordinator. Private transfer to ${resort}, check-in, welcome refreshments, and relaxed leisure evening.`
            },
            {
                day: 2,
                title: `Full-Day Highlights & Guided Expedition`,
                desc: overview || `Enjoy a full-day guided excursion around ${destination}'s premier scenic locations, historic landmarks, and photo spots with complimentary lunch.`
            },
            {
                day: 3,
                title: `Leisure Morning & Return Transit`,
                desc: `Resort breakfast, free leisure time for souvenir shopping and photography, followed by hotel check-out and scheduled transfer for return travel.`
            }
        ],
        roomTiers: [
            { id: 'standard', name: 'Deluxe Room', pricePerNight: 0, desc: 'King or Twin beds with balcony & scenic view' },
            { id: 'suite', name: 'Executive Suite', pricePerNight: 2800, desc: 'Spacious suite with panoramic views & lounge access' },
            { id: 'villa', name: 'Private Pool Villa', pricePerNight: 5500, desc: 'Exclusive private plunge pool & dedicated butler' }
        ],
        addons: [
            { id: 'travel_insurance', name: 'Comprehensive Travel Insurance', price: 450 },
            { id: 'airport_vip', name: 'VIP Fast-Track & Private Transfer', price: 1200 },
            { id: 'photo_package', name: 'Drone & DSLR Photography Pass', price: 1800 }
        ]
    };

    const list = getPackages();
    list.unshift(newPkg); // Add to beginning of array
    savePackages(list);

    closeAddPackageModal();
    renderPackages();
    showAdminToast(`New place "${newPkg.name}" created and published live!`, 'success');
}

// Open Full Package Edit Modal
function openPackageEditModal(id) {
    const list = getPackages();
    const pkg = list.find(p => p.id === id);
    if (!pkg) return;

    const idInput = document.getElementById('edit-pkg-id');
    const nameInput = document.getElementById('edit-pkg-name');
    const destInput = document.getElementById('edit-pkg-dest');
    const durationInput = document.getElementById('edit-pkg-duration');
    const priceInput = document.getElementById('edit-pkg-price');
    const origPriceInput = document.getElementById('edit-pkg-original-price');
    const statusInput = document.getElementById('edit-pkg-status');
    const bookedInput = document.getElementById('edit-pkg-booked');
    const capInput = document.getElementById('edit-pkg-capacity');

    const currPrice = Number(pkg.price || pkg.basePrice || 0);
    const currOrig = Number(pkg.originalPrice || Math.round(currPrice * 1.35));

    if (idInput) idInput.value = pkg.id;
    if (nameInput) nameInput.value = pkg.name || '';
    if (destInput) destInput.value = pkg.destination || '';
    if (durationInput) durationInput.value = pkg.duration || '';
    if (priceInput) priceInput.value = currPrice;
    if (origPriceInput) origPriceInput.value = currOrig;
    if (statusInput) statusInput.value = pkg.status || 'Active';
    if (bookedInput) bookedInput.value = pkg.booked !== undefined ? pkg.booked : 0;
    if (capInput) capInput.value = pkg.capacity !== undefined ? pkg.capacity : 25;

    const modal = document.getElementById('package-edit-modal');
    if (modal) modal.classList.remove('hidden');
}

function closePackageEditModal() {
    const modal = document.getElementById('package-edit-modal');
    if (modal) modal.classList.add('hidden');
}

function handleSavePackageEdit(e) {
    e.preventDefault();
    const id = document.getElementById('edit-pkg-id').value;
    const list = getPackages();
    const pkg = list.find(p => p.id === id);
    if (!pkg) return;

    pkg.name = document.getElementById('edit-pkg-name').value.trim();
    pkg.destination = document.getElementById('edit-pkg-dest').value.trim();
    pkg.duration = document.getElementById('edit-pkg-duration').value.trim();

    const price = parseFloat(document.getElementById('edit-pkg-price').value) || 0;
    pkg.price = price;
    pkg.basePrice = price; // Dual sync

    const origPrice = parseFloat(document.getElementById('edit-pkg-original-price').value);
    pkg.originalPrice = (!isNaN(origPrice) && origPrice > 0) ? origPrice : Math.round(price * 1.35);

    pkg.status = document.getElementById('edit-pkg-status').value;
    pkg.booked = parseInt(document.getElementById('edit-pkg-booked').value) || 0;
    pkg.capacity = parseInt(document.getElementById('edit-pkg-capacity').value) || 25;

    savePackages(list);
    closePackageEditModal();
    renderPackages();
    showAdminToast(`Package "${pkg.name}" updated! Changes reflect live on the main page.`, 'success');
}

function editPackagePrice(id) {
    openPackageEditModal(id);
}

// ==========================================================================
// 4. FLEET & TRANSIT SCHEDULES
// ==========================================================================
function switchFleetSubTab(type) {
    fleetSubTab = type;
    const btnBuses = document.getElementById('fleet-btn-buses');
    const btnFlights = document.getElementById('fleet-btn-flights');
    const viewBuses = document.getElementById('fleet-view-buses');
    const viewFlights = document.getElementById('fleet-view-flights');

    if (type === 'buses') {
        if (btnBuses) btnBuses.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-xs cursor-pointer';
        if (btnFlights) btnFlights.className = 'px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer';
        if (viewBuses) viewBuses.classList.remove('hidden');
        if (viewFlights) viewFlights.classList.add('hidden');
    } else {
        if (btnBuses) btnBuses.className = 'px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer';
        if (btnFlights) btnFlights.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-xs cursor-pointer';
        if (viewBuses) viewBuses.classList.add('hidden');
        if (viewFlights) viewFlights.classList.remove('hidden');
    }
}

function renderFleet() {
    // Bus Schedules
    const busBody = document.getElementById('fleet-buses-tbody');
    if (busBody) {
        const buses = getBusSchedules();
        busBody.innerHTML = buses.map(bus => `
            <tr class="border-b border-gray-100 hover:bg-slate-50 transition text-xs">
                <td class="py-3 px-4 font-mono font-bold text-gray-900">${bus.id}</td>
                <td class="py-3 px-4">
                    <span class="font-bold text-gray-900 block">${bus.operator}</span>
                    <span class="text-[10px] text-gray-500">${bus.classType}</span>
                </td>
                <td class="py-3 px-4">
                    <div class="font-semibold text-gray-800">${bus.origin} ➔ ${bus.dest}</div>
                </td>
                <td class="py-3 px-4 font-medium text-gray-600">${bus.dep} – ${bus.arr}</td>
                <td class="py-3 px-4 font-bold text-gray-900">₱${bus.fare.toLocaleString()}</td>
                <td class="py-3 px-4">
                    <span class="font-semibold ${bus.seatsAvail < 10 ? 'text-rose-600' : 'text-gray-700'}">${bus.seatsAvail} / ${bus.seatsTotal}</span>
                </td>
                <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${bus.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}">
                        ${bus.status}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    // Flight Schedules
    const flightBody = document.getElementById('fleet-flights-tbody');
    if (flightBody) {
        const flights = getFlightSchedules();
        flightBody.innerHTML = flights.map(fl => `
            <tr class="border-b border-gray-100 hover:bg-slate-50 transition text-xs">
                <td class="py-3 px-4 font-mono font-bold text-sky-600">${fl.id}</td>
                <td class="py-3 px-4 font-bold text-gray-900">${fl.airline}</td>
                <td class="py-3 px-4 font-semibold text-gray-800">${fl.route}</td>
                <td class="py-3 px-4 font-medium text-gray-600">${fl.dep} – ${fl.arr}</td>
                <td class="py-3 px-4 text-gray-500">${fl.craft}</td>
                <td class="py-3 px-4 font-bold text-gray-900">₱${fl.fare.toLocaleString()}</td>
                <td class="py-3 px-4 font-semibold text-gray-700">${fl.seatsAvail} seats</td>
                <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        ${fl.status}
                    </span>
                </td>
            </tr>
        `).join('');
    }
}

// ==========================================================================
// 5. TRAVELERS & CUSTOMER DIRECTORY CONTROLLER
// ==========================================================================
let currentViewingCustomerId = null;

function isCustomerOnline(c) {
    if (!c) return false;
    // Explicitly offline or suspended accounts are never marked active
    if (c.status === 'Offline' || c.status === 'Suspended') return false;

    // Check lastActive timestamp
    if (!c.lastActive) return c.status === 'Online';
    const diffMs = Date.now() - new Date(c.lastActive).getTime();

    // If marked Online, consider active if within 30 minutes of last activity
    if (c.status === 'Online') {
        return diffMs < 30 * 60 * 1000;
    }

    // Fallback for sessions with recent activity (<15 mins)
    return diffMs < 15 * 60 * 1000;
}

function formatRelativeTime(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const diffMs = Date.now() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Active just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getCustomerInitials(name) {
    if (!name) return 'TR';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

function renderCustomers(customList = null) {
    const tbody = document.getElementById('customers-tbody');
    if (!tbody) return;

    const allCustomers = getCustomers();
    const customers = customList || allCustomers;

    // Update Summary Metric Counters
    const statTotal = document.getElementById('cust-stat-total');
    const statOnline = document.getElementById('cust-stat-online');
    const statVip = document.getElementById('cust-stat-vip');
    const statSpend = document.getElementById('cust-stat-spend');

    if (statTotal) statTotal.textContent = allCustomers.length;
    if (statOnline) {
        const onlineCount = allCustomers.filter(c => isCustomerOnline(c)).length;
        statOnline.textContent = onlineCount;
    }
    if (statVip) {
        const vipCount = allCustomers.filter(c => (c.tier && c.tier.includes('VIP'))).length;
        statVip.textContent = vipCount;
    }
    if (statSpend) {
        const totalSpendAll = allCustomers.reduce((acc, c) => acc + (Number(c.totalSpend) || 0), 0);
        statSpend.textContent = '₱' + totalSpendAll.toLocaleString();
    }

    if (customers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="py-12 text-center text-gray-400">
                    <div class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-2 text-gray-300">
                        <i class="fas fa-user-slash text-xl"></i>
                    </div>
                    <div class="font-bold text-gray-700 text-xs">No traveler clients found</div>
                    <div class="text-[11px] text-gray-400 mt-1">Try adjusting your search criteria or register a new client profile.</div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = customers.map(c => {
        const online = isCustomerOnline(c);
        const initials = getCustomerInitials(c.name);
        const tierClass = c.tier.includes('Platinum') ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : c.tier.includes('Gold') ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : c.tier.includes('Silver') ? 'bg-slate-100 text-slate-700 border-slate-200'
                        : 'bg-orange-50 text-orange-700 border-orange-200';

        const tierIcon = c.tier.includes('Platinum') ? 'fa-crown text-purple-500'
                       : c.tier.includes('Gold') ? 'fa-award text-amber-500'
                       : c.tier.includes('Silver') ? 'fa-shield text-slate-500'
                       : 'fa-star text-orange-500';

        return `
            <tr class="border-b border-gray-100 hover:bg-slate-50/80 transition text-xs">
                <!-- Customer ID -->
                <td class="py-3.5 px-4 font-mono font-bold text-blue-600">
                    <span class="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100">${c.id}</span>
                </td>

                <!-- Traveler Profile -->
                <td class="py-3.5 px-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-xl ${online ? 'bg-gradient-to-tr from-emerald-500 to-teal-600' : 'bg-gradient-to-tr from-blue-600 to-indigo-600'} text-white font-black text-xs flex items-center justify-center shadow-xs flex-shrink-0">
                            ${initials}
                        </div>
                        <div>
                            <div class="flex items-center gap-1.5">
                                <span class="font-extrabold text-gray-900">${c.name}</span>
                                ${online ? `
                                    <span class="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black" title="Signed in and active">
                                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 status-pulse"></span> Active
                                    </span>
                                ` : ''}
                            </div>
                            <div class="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                <i class="fas fa-location-dot text-[9px] text-gray-400"></i>
                                <span>${c.city || 'Metro Manila'}</span>
                            </div>
                        </div>
                    </div>
                </td>

                <!-- Contact Details -->
                <td class="py-3.5 px-4">
                    <div class="font-medium text-gray-800">
                        <a href="mailto:${c.email}" class="hover:text-blue-600 hover:underline inline-flex items-center gap-1">
                            <span>${c.email}</span>
                            <i class="fas fa-arrow-up-right-from-square text-[9px] text-gray-400"></i>
                        </a>
                    </div>
                    <div class="text-[11px] text-gray-400 font-mono mt-0.5">${c.phone || '+63 9XX XXX XXXX'}</div>
                </td>

                <!-- Loyalty Tier -->
                <td class="py-3.5 px-4">
                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${tierClass}">
                        <i class="fas ${tierIcon} text-[9px]"></i>
                        <span>${c.tier}</span>
                    </span>
                </td>

                <!-- Trips Completed -->
                <td class="py-3.5 px-4 font-bold text-gray-700">
                    <span class="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-800 text-[11px] font-bold">
                        ${c.trips || 0} Trips
                    </span>
                </td>

                <!-- Total Spend -->
                <td class="py-3.5 px-4 font-black text-gray-900 text-[13px]">
                    ₱${(Number(c.totalSpend) || 0).toLocaleString()}
                </td>

                <!-- Last Active -->
                <td class="py-3.5 px-4">
                    <div class="text-[11px] font-semibold ${online ? 'text-emerald-600' : 'text-gray-500'}">
                        ${formatRelativeTime(c.lastActive)}
                    </div>
                    <div class="text-[9px] text-gray-400">
                        ${c.joinedAt ? 'Joined ' + c.joinedAt.slice(0, 10) : 'Standard Member'}
                    </div>
                </td>

                <!-- Manage Actions -->
                <td class="py-3.5 px-4 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                        <button type="button" onclick="viewCustomerDetails('${c.id}')" class="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer" title="View Full Profile & Reservations">
                            <i class="fas fa-eye text-xs"></i>
                        </button>
                        <button type="button" onclick="openEditCustomerModal('${c.id}')" class="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-800 hover:text-white transition cursor-pointer" title="Edit Client Information">
                            <i class="fas fa-pen text-xs"></i>
                        </button>
                        <button type="button" onclick="deleteCustomer('${c.id}')" class="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer" title="Remove Client">
                            <i class="fas fa-trash-can text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function filterCustomers() {
    const query = (document.getElementById('cust-search-input')?.value || '').toLowerCase().trim();
    const tierFilter = document.getElementById('cust-tier-filter')?.value || 'all';
    const statusFilter = document.getElementById('cust-status-filter')?.value || 'all';
    const sortFilter = document.getElementById('cust-sort-filter')?.value || 'recent';

    let list = [...getCustomers()];

    // Search filter
    if (query) {
        list = list.filter(c => 
            (c.name && c.name.toLowerCase().includes(query)) ||
            (c.email && c.email.toLowerCase().includes(query)) ||
            (c.phone && c.phone.toLowerCase().includes(query)) ||
            (c.city && c.city.toLowerCase().includes(query)) ||
            (c.id && c.id.toLowerCase().includes(query))
        );
    }

    // Tier filter
    if (tierFilter !== 'all') {
        list = list.filter(c => c.tier && c.tier.includes(tierFilter));
    }

    // Status filter
    if (statusFilter !== 'all') {
        if (statusFilter === 'Online') {
            list = list.filter(c => isCustomerOnline(c));
        } else {
            list = list.filter(c => c.status === statusFilter);
        }
    }

    // Sorting
    if (sortFilter === 'recent') {
        list.sort((a, b) => new Date(b.lastActive || 0) - new Date(a.lastActive || 0));
    } else if (sortFilter === 'spend-high') {
        list.sort((a, b) => (Number(b.totalSpend) || 0) - (Number(a.totalSpend) || 0));
    } else if (sortFilter === 'trips-high') {
        list.sort((a, b) => (Number(b.trips) || 0) - (Number(a.trips) || 0));
    } else if (sortFilter === 'name-asc') {
        list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    renderCustomers(list);
}

function resetCustomerFilters() {
    const sInput = document.getElementById('cust-search-input');
    const tSelect = document.getElementById('cust-tier-filter');
    const stSelect = document.getElementById('cust-status-filter');
    const sortSelect = document.getElementById('cust-sort-filter');

    if (sInput) sInput.value = '';
    if (tSelect) tSelect.value = 'all';
    if (stSelect) stSelect.value = 'all';
    if (sortSelect) sortSelect.value = 'recent';

    renderCustomers();
}

function viewCustomerDetails(customerId) {
    const customers = getCustomers();
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    currentViewingCustomerId = customerId;
    const online = isCustomerOnline(customer);
    const initials = getCustomerInitials(customer.name);

    // Populate modal fields
    const avatarEl = document.getElementById('view-cust-avatar');
    if (avatarEl) {
        avatarEl.textContent = initials;
        avatarEl.className = `w-12 h-12 rounded-2xl ${online ? 'bg-gradient-to-tr from-emerald-500 to-teal-600' : 'bg-gradient-to-tr from-blue-600 to-indigo-600'} flex items-center justify-center text-lg font-black text-white shadow-md`;
    }

    const nameEl = document.getElementById('view-cust-name');
    if (nameEl) nameEl.textContent = customer.name;

    const statusBadge = document.getElementById('view-cust-status-badge');
    if (statusBadge) {
        statusBadge.textContent = online ? 'Online Now' : (customer.status || 'Standard');
        statusBadge.className = online 
            ? 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            : 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-300 border border-slate-600';
    }

    const idEl = document.getElementById('view-cust-id');
    if (idEl) idEl.textContent = customer.id;

    const cityEl = document.getElementById('view-cust-city');
    if (cityEl) cityEl.textContent = customer.city || 'Metro Manila';

    const tierEl = document.getElementById('view-cust-tier');
    if (tierEl) tierEl.textContent = customer.tier || 'Standard';

    const tripsEl = document.getElementById('view-cust-trips');
    if (tripsEl) tripsEl.textContent = customer.trips || 0;

    const spendEl = document.getElementById('view-cust-spend');
    if (spendEl) spendEl.textContent = '₱' + (Number(customer.totalSpend) || 0).toLocaleString();

    const loginsEl = document.getElementById('view-cust-logins');
    if (loginsEl) loginsEl.textContent = customer.loginCount || 1;

    const emailEl = document.getElementById('view-cust-email');
    if (emailEl) emailEl.textContent = customer.email;

    const emailLink = document.getElementById('view-cust-email-link');
    if (emailLink) emailLink.href = `mailto:${customer.email}`;

    const phoneEl = document.getElementById('view-cust-phone');
    if (phoneEl) phoneEl.textContent = customer.phone || 'None provided';

    const locEl = document.getElementById('view-cust-location');
    if (locEl) locEl.textContent = `${customer.city || 'Metro Manila'}, Philippines`;

    const joinedEl = document.getElementById('view-cust-joined');
    if (joinedEl) joinedEl.textContent = customer.joinedAt ? customer.joinedAt.slice(0, 10) : '2026-06-01';

    const activeEl = document.getElementById('view-cust-lastactive');
    if (activeEl) activeEl.textContent = formatRelativeTime(customer.lastActive);

    const notesEl = document.getElementById('view-cust-notes');
    if (notesEl) notesEl.value = customer.notes || '';

    // Populate Account Password
    const accounts = getRegisteredAccounts();
    const matchedAcc = accounts.find(a => (a.id && a.id === customer.id) || (a.email && a.email.toLowerCase() === (customer.email || '').toLowerCase()));
    const passEl = document.getElementById('view-cust-password');
    if (passEl) {
        passEl.textContent = (matchedAcc && matchedAcc.password) ? matchedAcc.password : (customer.password || '••••••••');
    }

    // Load Client Bookings History from mckanes_admin_bookings
    const allBookings = getBookings();
    const custEmail = (customer.email || '').toLowerCase().trim();
    const custName = (customer.name || '').toLowerCase().trim();

    const clientBookings = allBookings.filter(b => {
        const bEmail = (b.email || '').toLowerCase().trim();
        const bCust = (b.customer || '').toLowerCase().trim();
        return (bEmail && bEmail === custEmail) || (bCust && bCust === custName);
    });

    const bCountEl = document.getElementById('view-cust-bookings-count');
    if (bCountEl) bCountEl.textContent = clientBookings.length;

    const bListEl = document.getElementById('view-cust-bookings-list');
    if (bListEl) {
        if (clientBookings.length === 0) {
            bListEl.innerHTML = `
                <div class="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center text-gray-400">
                    <i class="fas fa-ticket text-sm mb-1 block"></i>
                    No reservations logged yet under this client account.
                </div>
            `;
        } else {
            bListEl.innerHTML = clientBookings.map(b => `
                <div class="p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition flex items-center justify-between text-xs">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="font-mono font-bold text-blue-600 text-[11px]">${b.id}</span>
                            <span class="font-bold text-gray-900">${b.title}</span>
                        </div>
                        <div class="text-[10px] text-gray-500 mt-0.5">
                            <span>${b.operator}</span> • <span>${b.date}</span> • <span>Seat: ${b.seat}</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-black text-gray-900">₱${(Number(b.amount) || 0).toLocaleString()}</div>
                        <span class="px-2 py-0.2 rounded-full text-[9px] font-bold ${b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' : b.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}">
                            ${b.status}
                        </span>
                    </div>
                </div>
            `).join('');
        }
    }

    const modal = document.getElementById('view-customer-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeViewCustomerModal() {
    const modal = document.getElementById('view-customer-modal');
    if (modal) modal.classList.add('hidden');
    currentViewingCustomerId = null;
}

function saveCurrentCustomerNotes() {
    if (!currentViewingCustomerId) return;
    const notes = document.getElementById('view-cust-notes')?.value || '';
    const customers = getCustomers();
    const index = customers.findIndex(c => c.id === currentViewingCustomerId);
    if (index >= 0) {
        customers[index].notes = notes;
        saveCustomers(customers);
        showAdminToast('Client operational notes saved successfully!', 'success');
    }
}

function openEditFromView() {
    const cid = currentViewingCustomerId;
    closeViewCustomerModal();
    if (cid) openEditCustomerModal(cid);
}

function openAddCustomerModal() {
    const form = document.getElementById('customer-profile-form');
    if (form) form.reset();

    const titleEl = document.getElementById('cust-form-title');
    const iconEl = document.getElementById('cust-form-icon');
    const idInput = document.getElementById('cust-form-id');

    if (titleEl) titleEl.textContent = 'Register New Client';
    if (iconEl) iconEl.className = 'fas fa-user-plus text-base';
    if (idInput) idInput.value = '';
    const passInput = document.getElementById('cust-form-password');
    if (passInput) passInput.value = '';

    const modal = document.getElementById('customer-form-modal');
    if (modal) modal.classList.remove('hidden');
}

function openEditCustomerModal(customerId) {
    const customers = getCustomers();
    const c = customers.find(item => item.id === customerId);
    if (!c) return;

    const titleEl = document.getElementById('cust-form-title');
    const iconEl = document.getElementById('cust-form-icon');
    const idInput = document.getElementById('cust-form-id');
    const nameInput = document.getElementById('cust-form-name');
    const emailInput = document.getElementById('cust-form-email');
    const phoneInput = document.getElementById('cust-form-phone');
    const cityInput = document.getElementById('cust-form-city');
    const tierInput = document.getElementById('cust-form-tier');
    const statusInput = document.getElementById('cust-form-status');
    const tripsInput = document.getElementById('cust-form-trips');
    const spendInput = document.getElementById('cust-form-spend');
    const notesInput = document.getElementById('cust-form-notes');

    if (titleEl) titleEl.textContent = `Edit Client: ${c.name}`;
    if (iconEl) iconEl.className = 'fas fa-user-pen text-base';
    if (idInput) idInput.value = c.id;
    if (nameInput) nameInput.value = c.name;
    if (emailInput) emailInput.value = c.email;
    if (phoneInput) phoneInput.value = c.phone || '';
    if (cityInput) cityInput.value = c.city || '';
    if (tierInput) tierInput.value = c.tier || 'Bronze';
    if (statusInput) statusInput.value = c.status || 'Active';
    if (tripsInput) tripsInput.value = c.trips || 0;
    if (spendInput) spendInput.value = c.totalSpend || 0;
    if (notesInput) notesInput.value = c.notes || '';
    const passInput = document.getElementById('cust-form-password');
    const accounts = getRegisteredAccounts();
    const matchedAcc = accounts.find(a => (a.id && a.id === customerId) || (a.email && a.email.toLowerCase() === (c.email || '').toLowerCase()));
    if (passInput) passInput.value = (matchedAcc && matchedAcc.password) ? matchedAcc.password : (c.password || '');

    const modal = document.getElementById('customer-form-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeCustomerFormModal() {
    const modal = document.getElementById('customer-form-modal');
    if (modal) modal.classList.add('hidden');
}

function handleSaveCustomer(e) {
    e.preventDefault();
    const id = document.getElementById('cust-form-id')?.value;
    const name = document.getElementById('cust-form-name')?.value.trim();
    const email = document.getElementById('cust-form-email')?.value.trim();
    const phone = document.getElementById('cust-form-phone')?.value.trim();
    const city = document.getElementById('cust-form-city')?.value.trim();
    const tier = document.getElementById('cust-form-tier')?.value;
    const status = document.getElementById('cust-form-status')?.value;
    const trips = Number(document.getElementById('cust-form-trips')?.value) || 0;
    const spend = Number(document.getElementById('cust-form-spend')?.value) || 0;
    const notes = document.getElementById('cust-form-notes')?.value.trim();
    const password = document.getElementById('cust-form-password')?.value.trim();

    if (!name || !email) {
        showAdminToast('Please provide both traveler name and email address.', 'error');
        return;
    }

    let customers = getCustomers();

    if (id) {
        // Edit existing customer
        const index = customers.findIndex(c => c.id === id);
        if (index >= 0) {
            customers[index] = {
                ...customers[index],
                name,
                email,
                phone,
                city,
                tier,
                status,
                trips,
                totalSpend: spend,
                notes,
                password: password || customers[index].password || 'MckanesTravel2026!',
                lastActive: new Date().toISOString()
            };
            saveCustomers(customers);

            // Synchronize with mckanes_registered_accounts
            let accounts = getRegisteredAccounts();
            const accIdx = accounts.findIndex(a => (a.id && a.id === id) || (a.email && a.email.toLowerCase() === email.toLowerCase()));
            if (accIdx >= 0) {
                accounts[accIdx] = {
                    ...accounts[accIdx],
                    name,
                    email,
                    phone,
                    city,
                    tier,
                    status,
                    trips,
                    totalSpend: spend,
                    notes,
                    password: password || accounts[accIdx].password || 'MckanesTravel2026!',
                    lastActive: new Date().toISOString()
                };
            } else {
                accounts.push({
                    id,
                    name,
                    email,
                    phone,
                    city,
                    tier,
                    status,
                    trips,
                    totalSpend: spend,
                    notes,
                    password: password || 'MckanesTravel2026!',
                    joinedAt: new Date().toISOString(),
                    lastActive: new Date().toISOString(),
                    loginCount: 1
                });
            }
            saveRegisteredAccounts(accounts);
            showAdminToast(`Client profile for ${name} updated successfully.`, 'success');
        }
    } else {
        // Register new customer
        const nextId = 'CUST-' + String(customers.length + 1).padStart(2, '0');
        const newCust = {
            id: nextId,
            name,
            email,
            phone: phone || '+63 917 000 0000',
            city: city || 'Metro Manila',
            tier: tier || 'Bronze',
            status: status || 'Active',
            trips,
            totalSpend: spend,
            notes,
            password: password || 'MckanesTravel2026!',
            joinedAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            loginCount: 1
        };
        customers.unshift(newCust);
        saveCustomers(customers);

        // Synchronize with mckanes_registered_accounts
        let accounts = getRegisteredAccounts();
        accounts.unshift({
            id: nextId,
            name,
            email,
            phone: phone || '+63 917 000 0000',
            city: city || 'Metro Manila',
            tier: tier || 'Bronze',
            status: status || 'Active',
            trips,
            totalSpend: spend,
            notes,
            password: password || 'MckanesTravel2026!',
            joinedAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            loginCount: 1
        });
        saveRegisteredAccounts(accounts);
        showAdminToast(`New client ${name} registered successfully as ${nextId}!`, 'success');
    }

    closeCustomerFormModal();
    renderCustomers();
}

function deleteCustomer(customerId) {
    const customers = getCustomers();
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    showAdminConfirmModal({
        title: 'Remove Traveler Client?',
        message: `Are you sure you want to remove traveler client "${customer.name}" (${customer.id}) from the directory? This action cannot be undone.`,
        icon: 'fas fa-user-minus',
        iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
        confirmText: 'Remove Client',
        confirmIcon: 'fas fa-trash-alt',
        confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25',
        cancelText: 'Cancel'
    }).then(confirmed => {
        if (!confirmed) return;

        const updated = customers.filter(c => c.id !== customerId);
        saveCustomers(updated);

        // Remove from mckanes_registered_accounts
        let accounts = getRegisteredAccounts();
        accounts = accounts.filter(a => a.id !== customerId && a.email.toLowerCase() !== customer.email.toLowerCase());
        saveRegisteredAccounts(accounts);

        // If active session belongs to this deleted user, log them out
        try {
            const rawUser = localStorage.getItem('mckanes_user');
            if (rawUser) {
                const u = JSON.parse(rawUser);
                if (u.email && u.email.toLowerCase() === customer.email.toLowerCase()) {
                    localStorage.removeItem('mckanes_user');
                }
            }
        } catch (e) {}

        renderCustomers();
        showAdminToast(`Client ${customer.name} removed from directory.`, 'info');
    });
}

function exportCustomersCsv() {
    const customers = getCustomers();
    if (customers.length === 0) {
        showAdminToast('No customer records to export.', 'error');
        return;
    }

    let csv = "Customer ID,Full Name,Email,Phone,City,Loyalty Tier,Status,Trips Completed,Total Spend (PHP),Joined Date,Last Active\n";
    customers.forEach(c => {
        const row = [
            `"${c.id}"`,
            `"${c.name}"`,
            `"${c.email}"`,
            `"${c.phone || ''}"`,
            `"${c.city || ''}"`,
            `"${c.tier || ''}"`,
            `"${c.status || ''}"`,
            c.trips || 0,
            c.totalSpend || 0,
            `"${c.joinedAt || ''}"`,
            `"${c.lastActive || ''}"`
        ];
        csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mckanes_traveler_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showAdminToast('Customer directory exported to CSV successfully!', 'success');
}

// ==========================================================================
// 6. INQUIRIES & MESSAGES
// ==========================================================================
function renderInquiries() {
    const container = document.getElementById('inquiries-list');
    if (!container) return;

    const inquiries = getInquiries();
    container.innerHTML = inquiries.map(inq => `
        <div class="p-5 border border-gray-100 rounded-2xl bg-white shadow-xs hover:border-blue-200 transition">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                <div class="flex items-center gap-2">
                    <span class="font-mono text-xs font-bold text-blue-600">${inq.id}</span>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${inq.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : inq.status === 'Replied' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}">
                        ${inq.status}
                    </span>
                </div>
                <span class="text-[11px] text-gray-400">${inq.date}</span>
            </div>
            <h4 class="font-bold text-sm text-gray-900 mb-1">${inq.subject}</h4>
            <p class="text-xs text-gray-600 mb-3 leading-relaxed bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                "${inq.message}"
            </p>
            ${inq.reply ? `
                <div class="text-xs text-blue-900 bg-blue-50/60 p-3 rounded-xl border border-blue-100 mb-3">
                    <strong>Admin Reply:</strong> "${inq.reply}"
                </div>
            ` : ''}
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 border-t border-gray-100 text-xs">
                <div class="text-gray-500">
                    From: <strong class="text-gray-800">${inq.name}</strong> (${inq.email})
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="openReplyModal('${inq.id}')" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer">
                        <i class="fas fa-reply mr-1"></i> Send Reply
                    </button>
                    <button onclick="toggleInquiryStatus('${inq.id}')" class="text-gray-500 hover:text-gray-700 px-2 py-1 text-xs font-medium cursor-pointer">
                        Mark ${inq.status === 'Pending' ? 'Replied' : inq.status === 'Replied' ? 'Resolved' : 'Pending'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openReplyModal(id) {
    const list = getInquiries();
    const inq = list.find(item => item.id === id);
    if (!inq) return;

    document.getElementById('reply-modal-inq-id').value = inq.id;
    document.getElementById('reply-modal-customer').textContent = `${inq.name} (${inq.email})`;
    document.getElementById('reply-modal-subject').textContent = inq.subject;
    document.getElementById('reply-modal-message').textContent = `"${inq.message}"`;
    document.getElementById('reply-modal-text').value = inq.reply || '';

    const modal = document.getElementById('inquiry-reply-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeReplyModal() {
    const modal = document.getElementById('inquiry-reply-modal');
    if (modal) modal.classList.add('hidden');
}

function handleReplySubmit(e) {
    e.preventDefault();
    const id = document.getElementById('reply-modal-inq-id').value;
    const replyText = document.getElementById('reply-modal-text').value.trim();

    const list = getInquiries();
    const inq = list.find(item => item.id === id);
    if (!inq) return;

    inq.reply = replyText;
    inq.status = 'Replied';
    saveInquiries(list);

    closeReplyModal();
    renderInquiries();
    showAdminToast(`Response sent to ${inq.name}!`, 'success');
}

function toggleInquiryStatus(id) {
    const list = getInquiries();
    const inq = list.find(item => item.id === id);
    if (!inq) return;

    if (inq.status === 'Pending') inq.status = 'Replied';
    else if (inq.status === 'Replied') inq.status = 'Resolved';
    else inq.status = 'Pending';

    saveInquiries(list);
    renderInquiries();
    showAdminToast(`Inquiry ${id} marked as ${inq.status}`, 'info');
}

// ==========================================================================
// 7. PROMO CODES & VOUCHERS
// ==========================================================================
function renderPromos() {
    const tbody = document.getElementById('promos-tbody');
    if (!tbody) return;

    const promos = getPromos();
    tbody.innerHTML = promos.map(pr => `
        <tr class="border-b border-gray-100 hover:bg-slate-50 transition text-xs">
            <td class="py-3 px-4 font-mono font-bold text-blue-600 text-sm">
                <div class="flex items-center gap-1.5">
                    <span>${pr.code}</span>
                    <button onclick="copyToClipboard('${pr.code}', 'Promo code')" class="text-gray-400 hover:text-blue-600 text-xs cursor-pointer" title="Copy code">
                        <i class="far fa-copy"></i>
                    </button>
                </div>
            </td>
            <td class="py-3 px-4 font-bold text-gray-900">${pr.discount}</td>
            <td class="py-3 px-4 text-gray-600">Min. ₱${pr.minSpend.toLocaleString()}</td>
            <td class="py-3 px-4 font-semibold text-gray-800">${pr.usesCount} / ${pr.maxUses}</td>
            <td class="py-3 px-4 text-gray-500">${pr.expiry}</td>
            <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${pr.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}">
                    ${pr.status}
                </span>
            </td>
        </tr>
    `).join('');
}

function handleAddPromoSubmit(e) {
    e.preventDefault();
    const code = document.getElementById('new-promo-code').value.trim().toUpperCase();
    const discount = document.getElementById('new-promo-discount').value.trim();
    const minSpend = parseInt(document.getElementById('new-promo-min').value) || 0;
    const maxUses = parseInt(document.getElementById('new-promo-uses').value) || 100;
    const expiry = document.getElementById('new-promo-expiry').value;

    const promos = getPromos();
    promos.unshift({
        code: code,
        discount: discount,
        type: discount.includes('%') ? 'Percentage' : 'Fixed',
        minSpend: minSpend,
        maxUses: maxUses,
        usesCount: 0,
        expiry: expiry,
        status: "Active"
    });

    savePromos(promos);
    renderPromos();
    document.getElementById('form-add-promo').reset();
    showAdminToast(`Created promo code ${code}!`, 'success');
}

// ==========================================================================
// 8. NOTIFICATIONS CENTER
// ==========================================================================
function toggleNotifications(e) {
    if (e) e.stopPropagation();
    const panel = document.getElementById('admin-notifications-dropdown');
    if (panel) {
        panel.classList.toggle('hidden');
    }
}

function renderNotifications() {
    const list = getNotifications();
    const badge = document.getElementById('notif-badge');
    const container = document.getElementById('notif-items-container');

    const unreadCount = list.filter(n => n.unread).length;
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    if (container) {
        container.innerHTML = list.map(n => `
            <div class="p-3 border-b border-gray-100 hover:bg-slate-50 transition cursor-pointer flex items-start gap-2.5 ${n.unread ? 'bg-blue-50/30' : ''}">
                <div class="w-2 h-2 rounded-full mt-1.5 ${n.unread ? 'bg-blue-600' : 'bg-transparent'}"></div>
                <div class="flex-1 min-w-0">
                    <div class="font-bold text-xs text-gray-900">${n.title}</div>
                    <div class="text-[11px] text-gray-600 leading-tight mt-0.5">${n.desc}</div>
                    <div class="text-[10px] text-gray-400 mt-1">${n.time}</div>
                </div>
            </div>
        `).join('');
    }
}

function markAllNotificationsRead() {
    const list = getNotifications();
    list.forEach(n => n.unread = false);
    saveNotifications(list);
    renderNotifications();
    showAdminToast('All notifications marked as read', 'info');
}

// ==========================================================================
// 9. GLOBAL QUICK SEARCH & AUTOCOMPLETE
// ==========================================================================
function setupGlobalSearch() {
    const input = document.getElementById('admin-global-search');
    const resultsPanel = document.getElementById('admin-global-search-results');
    if (!input || !resultsPanel) return;

    input.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length < 2) {
            resultsPanel.classList.add('hidden');
            return;
        }

        const bookings = getBookings().filter(b => 
            b.id.toLowerCase().includes(query) ||
            b.customer.toLowerCase().includes(query) ||
            b.title.toLowerCase().includes(query)
        ).slice(0, 4);

        const packages = getPackages().filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.destination.toLowerCase().includes(query)
        ).slice(0, 3);

        const customers = getCustomers().filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.email.toLowerCase().includes(query)
        ).slice(0, 3);

        if (bookings.length === 0 && packages.length === 0 && customers.length === 0) {
            resultsPanel.innerHTML = `
                <div class="p-4 text-center text-xs text-gray-400">
                    No results found for "${query}"
                </div>
            `;
            resultsPanel.classList.remove('hidden');
            return;
        }

        let html = '';

        if (bookings.length > 0) {
            html += `<div class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 border-b border-gray-100">Reservations</div>`;
            bookings.forEach(b => {
                html += `
                    <div onclick="jumpToBooking('${b.id}')" class="p-2.5 hover:bg-blue-50 transition cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-b-0">
                        <div>
                            <span class="font-mono text-xs font-bold text-blue-600">${b.id}</span>
                            <span class="font-bold text-xs text-gray-800 ml-2">${b.customer}</span>
                            <div class="text-[11px] text-gray-500">${b.title}</div>
                        </div>
                        <span class="text-xs font-bold text-gray-900">₱${b.amount.toLocaleString()}</span>
                    </div>
                `;
            });
        }

        if (packages.length > 0) {
            html += `<div class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 border-b border-gray-100">Holiday Packages</div>`;
            packages.forEach(p => {
                html += `
                    <div onclick="switchTab('packages')" class="p-2.5 hover:bg-blue-50 transition cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-b-0">
                        <div class="font-bold text-xs text-gray-800">${p.name}</div>
                        <span class="text-xs font-bold text-gray-900">₱${p.price.toLocaleString()}</span>
                    </div>
                `;
            });
        }

        if (customers.length > 0) {
            html += `<div class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 border-b border-gray-100">Travelers</div>`;
            customers.forEach(c => {
                html += `
                    <div onclick="switchTab('customers')" class="p-2.5 hover:bg-blue-50 transition cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-b-0">
                        <div>
                            <span class="font-bold text-xs text-gray-800">${c.name}</span>
                            <span class="text-[11px] text-gray-500 ml-2">${c.email}</span>
                        </div>
                        <span class="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">${c.tier}</span>
                    </div>
                `;
            });
        }

        resultsPanel.innerHTML = html;
        resultsPanel.classList.remove('hidden');
    });

    // Keyboard shortcut (Ctrl + K / Cmd + K)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            input.focus();
        }
        if (e.key === 'Escape') {
            resultsPanel.classList.add('hidden');
        }
    });
}

function jumpToBooking(id) {
    document.getElementById('admin-global-search-results').classList.add('hidden');
    switchTab('bookings');
    viewBookingDetails(id);
}

// Copy to Clipboard Utility
function copyToClipboard(text, label = 'Copied') {
    navigator.clipboard.writeText(text).then(() => {
        showAdminToast(`${label} copied to clipboard!`, 'info');
    }).catch(() => {
        showAdminToast(`Copied: ${text}`, 'info');
    });
}

// Agency Settings Persistence
function loadAgencySettings() {
    const settings = getStored('agency_settings', {
        name: "Mckanes Travel and Tours Services Inc.",
        accreditation: "DOT-NCR-TA-2026-08492",
        address: "Unit 1408, Ayala Tower One, Makati City, Metro Manila, Philippines",
        hotline: "+63 (02) 8888-MCKANES / +63 912 345 6789",
        busFee: "30.00",
        planeFee: "200.00"
    });

    const elName = document.getElementById('setting-name');
    const elAccred = document.getElementById('setting-accreditation');
    const elAddress = document.getElementById('setting-address');
    const elHotline = document.getElementById('setting-hotline');
    const elBusFee = document.getElementById('setting-bus-fee');
    const elPlaneFee = document.getElementById('setting-plane-fee');

    if (elName) elName.value = settings.name;
    if (elAccred) elAccred.value = settings.accreditation;
    if (elAddress) elAddress.value = settings.address;
    if (elHotline) elHotline.value = settings.hotline;
    if (elBusFee) elBusFee.value = settings.busFee;
    if (elPlaneFee) elPlaneFee.value = settings.planeFee;
}

function saveAgencySettings(e) {
    e.preventDefault();
    const settings = {
        name: document.getElementById('setting-name').value.trim(),
        accreditation: document.getElementById('setting-accreditation').value.trim(),
        address: document.getElementById('setting-address').value.trim(),
        hotline: document.getElementById('setting-hotline').value.trim(),
        busFee: document.getElementById('setting-bus-fee').value.trim(),
        planeFee: document.getElementById('setting-plane-fee').value.trim()
    };
    setStored('agency_settings', settings);
    showAdminToast('Agency configuration saved successfully!', 'success');
}

// Reset Local Database to Defaults
function resetLocalDatabase() {
    showAdminConfirmModal({
        title: 'Reset Local Database?',
        message: 'Are you sure you want to reset all local admin database records (bookings, schedules, packages, promos) to factory seed data? Current unsaved entries will be replaced.',
        icon: 'fas fa-database',
        iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
        confirmText: 'Reset Database',
        confirmIcon: 'fas fa-redo-alt',
        confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25',
        cancelText: 'Cancel'
    }).then(confirmed => {
        if (!confirmed) return;

        localStorage.removeItem('mckanes_admin_bookings');
        localStorage.removeItem('mckanes_admin_packages');
        localStorage.removeItem('mckanes_admin_bus_schedules');
        localStorage.removeItem('mckanes_admin_flight_schedules');
        localStorage.removeItem('mckanes_admin_customers');
        localStorage.removeItem('mckanes_admin_inquiries');
        localStorage.removeItem('mckanes_admin_promos');
        localStorage.removeItem('mckanes_admin_notifications');

        renderDashboard();
        renderBookingsTable();
        renderPackages();
        renderFleet();
        renderCustomers();
        renderInquiries();
        renderPromos();
        renderNotifications();

        showAdminToast('System database restored to default seed state.', 'success');
    });
}

// Real-Time Live Booking Notification Modal & Chime
let activeLiveAlertBookingId = null;
let liveAlertTimer = null;

function playBookingChime() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
}

function showAdminLiveBookingAlert(booking) {
    if (!booking) return;
    activeLiveAlertBookingId = booking.id;
    const alertEl = document.getElementById('admin-live-booking-alert');
    if (!alertEl) return;

    const custEl = document.getElementById('live-alert-customer');
    const detEl = document.getElementById('live-alert-details');
    const amtEl = document.getElementById('live-alert-amount');
    const iconEl = document.getElementById('live-alert-icon');
    const timeEl = document.getElementById('live-alert-time');

    if (custEl) custEl.textContent = `${booking.customer}${booking.email ? ` (${booking.email})` : ''}`;
    if (detEl) detEl.textContent = `${booking.title} • ${booking.pax || 1} Traveler${(Number(booking.pax) || 1) > 1 ? 's' : ''}`;
    if (amtEl) amtEl.textContent = `₱${(Number(booking.amount) || 0).toLocaleString()} • ${booking.status}`;
    if (timeEl) timeEl.textContent = 'Just now';

    if (iconEl) {
        iconEl.className = booking.type === 'flight' ? 'fas fa-plane text-sky-400'
                         : booking.type === 'bus' ? 'fas fa-bus text-amber-400'
                         : 'fas fa-umbrella-beach text-emerald-400';
    }

    playBookingChime();

    alertEl.classList.remove('-translate-y-28', 'opacity-0', 'pointer-events-none');
    alertEl.classList.add('translate-y-0', 'opacity-100');

    if (liveAlertTimer) clearTimeout(liveAlertTimer);
    liveAlertTimer = setTimeout(() => {
        closeAdminLiveAlert();
    }, 7500);
}

function closeAdminLiveAlert() {
    const alertEl = document.getElementById('admin-live-booking-alert');
    if (alertEl) {
        alertEl.classList.add('-translate-y-28', 'opacity-0', 'pointer-events-none');
        alertEl.classList.remove('translate-y-0', 'opacity-100');
    }
}

function handleLiveAlertView() {
    if (activeLiveAlertBookingId) {
        viewBookingDetails(activeLiveAlertBookingId);
        closeAdminLiveAlert();
    }
}

// Toast Feedback Notification
function showAdminToast(message, type = 'info') {
    const toast = document.getElementById('admin-toast');
    const toastMsg = document.getElementById('admin-toast-msg');
    const toastIcon = document.getElementById('admin-toast-icon');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    if (toastIcon) {
        toastIcon.className = type === 'success' ? 'fas fa-check-circle text-emerald-400 text-sm'
                            : type === 'error' ? 'fas fa-exclamation-circle text-rose-400 text-sm'
                            : 'fas fa-info-circle text-blue-400 text-sm';
    }

    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 4000);
}

// Live Cross-Tab Synchronization with Public Client Website
window.addEventListener('storage', (e) => {
    if (e.key === 'mckanes_admin_customers' || e.key === 'mckanes_registered_accounts' || e.key === 'mckanes_user') {
        renderCustomers();
        renderDashboard();
    }
    if (e.key === 'mckanes_admin_bookings') {
        renderBookingsTable();
        renderDashboard();
        renderFleet();
        try {
            const rawNew = e.newValue;
            if (rawNew) {
                const bks = JSON.parse(rawNew);
                if (Array.isArray(bks) && bks.length > 0) {
                    const newest = bks[0];
                    showAdminLiveBookingAlert(newest);
                    showAdminToast(`🎉 New Booking Received: ${newest.customer} confirmed ${newest.title} (₱${(Number(newest.amount) || 0).toLocaleString()})`, 'success');
                }
            }
        } catch (err) {}
    }
    if (e.key === 'mckanes_admin_notifications') {
        renderNotifications();
    }
});

// Periodic live re-render every 15 seconds to keep active relative times & online indicators real-time
setInterval(() => {
    const custTab = document.getElementById('tab-customers');
    if (custTab && !custTab.classList.contains('hidden')) {
        renderCustomers();
    }
}, 15000);
