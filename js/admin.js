/* ============================================
   Travel By Petal — Admin Panel Logic
   ============================================ */

const SUPABASE_URL = 'https://audtbcwgkaybqvixfjnf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1ZHRiY3dna2F5YnF2aXhmam5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDYzNDYsImV4cCI6MjA5MDkyMjM0Nn0.OlxAEW_3vt5ykzdU9_PIxJGZMC4QM9RIdf7ahVTMW84';

let sb;

// === INIT ===
document.addEventListener('DOMContentLoaded', async () => {
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
        showAdmin();
    }
});

// === AUTH ===
async function adminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const error = document.getElementById('loginError');

    const { data, error: err } = await sb.auth.signInWithPassword({ email, password });
    if (err) {
        error.textContent = 'Login failed: ' + err.message;
    } else {
        showAdmin();
    }
}

async function adminLogout() {
    await sb.auth.signOut();
    document.getElementById('adminApp').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
}

function showAdmin() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminApp').style.display = 'flex';
    loadDashboard();
}

// === TAB NAVIGATION ===
function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`[data-tab-content="${tab}"]`).classList.add('active');
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    const titles = {
        dashboard: 'Dashboard', requests: 'Trip Requests', destinations: 'Destinations',
        testimonials: 'Testimonials', blog: 'Blog Posts', analytics: 'Analytics', chatlog: 'Chat Logs'
    };
    document.getElementById('pageTitle').textContent = titles[tab] || tab;

    // Load data
    const actions = document.getElementById('headerActions');
    actions.innerHTML = '';

    switch (tab) {
        case 'dashboard': loadDashboard(); break;
        case 'requests': loadRequests(); break;
        case 'destinations':
            actions.innerHTML = '<button class="btn-add" onclick="openDestModal()">+ Add Destination</button>';
            loadDestinations(); break;
        case 'testimonials':
            actions.innerHTML = '<button class="btn-add" onclick="openTestModal()">+ Add Testimonial</button>';
            loadTestimonials(); break;
        case 'blog':
            actions.innerHTML = '<button class="btn-add" onclick="openBlogModal()">+ New Post</button>';
            loadBlogPosts(); break;
        case 'analytics': loadAnalytics(); break;
        case 'chatlog': loadChatLogs(); break;
    }
}

// === DASHBOARD ===
async function loadDashboard() {
    try {
        const [requests, dests, chats] = await Promise.all([
            sb.from('trip_requests').select('id, status, destination, created_at, full_name, phone').order('created_at', { ascending: false }),
            sb.from('destinations').select('id').eq('is_active', true),
            sb.from('chatbot_logs').select('id').gte('created_at', new Date(Date.now() - 86400000).toISOString()),
        ]);

        const allReqs = requests.data || [];
        const newReqs = allReqs.filter(r => r.status === 'new');

        document.getElementById('statNewRequests').textContent = newReqs.length;
        document.getElementById('statTotalRequests').textContent = allReqs.length;
        document.getElementById('statDestinations').textContent = (dests.data || []).length;
        document.getElementById('statChats').textContent = (chats.data || []).length;

        const badge = document.getElementById('newRequestsBadge');
        badge.textContent = newReqs.length > 0 ? newReqs.length : '';
        badge.style.display = newReqs.length > 0 ? 'inline' : 'none';

        // Recent requests
        const recent = allReqs.slice(0, 5);
        document.getElementById('recentRequests').innerHTML = recent.length > 0 ? `
            <table class="admin-table">
                <thead><tr><th>Date</th><th>Name</th><th>Destination</th><th>Status</th></tr></thead>
                <tbody>${recent.map(r => `
                    <tr>
                        <td>${new Date(r.created_at).toLocaleDateString('he-IL')}</td>
                        <td>${r.full_name}</td>
                        <td>${r.destination || '-'}</td>
                        <td><span class="status-badge status-${r.status}">${statusLabel(r.status)}</span></td>
                    </tr>`).join('')}
                </tbody>
            </table>` : '<p style="color:#999">No requests yet</p>';

        // Top destinations
        const destCounts = {};
        allReqs.forEach(r => { if (r.destination) destCounts[r.destination] = (destCounts[r.destination] || 0) + 1; });
        const sorted = Object.entries(destCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const maxCount = sorted.length > 0 ? sorted[0][1] : 1;

        document.getElementById('topDestinations').innerHTML = sorted.length > 0 ? `
            <div class="bar-chart">${sorted.map(([dest, count]) => `
                <div class="bar-row">
                    <span class="bar-label">${dest}</span>
                    <div class="bar-track"><div class="bar-fill" style="width:${(count/maxCount)*100}%"><span class="bar-value">${count}</span></div></div>
                </div>`).join('')}
            </div>` : '<p style="color:#999">No data yet</p>';

    } catch (err) {
        console.error('Dashboard error:', err);
    }
}

// === TRIP REQUESTS ===
async function loadRequests() {
    const status = document.getElementById('filterStatus')?.value;
    const search = document.getElementById('filterSearch')?.value?.toLowerCase() || '';

    let query = sb.from('trip_requests').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) { console.error(error); return; }

    let filtered = data || [];
    if (search) {
        filtered = filtered.filter(r =>
            (r.full_name || '').toLowerCase().includes(search) ||
            (r.destination || '').toLowerCase().includes(search) ||
            (r.phone || '').includes(search)
        );
    }

    document.getElementById('requestsTable').innerHTML = filtered.length > 0 ? `
        <table class="admin-table">
            <thead><tr><th>Date</th><th>Name</th><th>Phone</th><th>Destination</th><th>Service</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>${filtered.map(r => `
                <tr>
                    <td>${new Date(r.created_at).toLocaleDateString('he-IL')}</td>
                    <td><strong>${r.full_name}</strong></td>
                    <td><a href="https://wa.me/${r.phone?.replace(/[^0-9]/g,'')}" target="_blank">${r.phone}</a></td>
                    <td>${r.destination || '-'}</td>
                    <td>${r.service_type || '-'}</td>
                    <td>
                        <select class="status-select" onchange="updateRequestStatus('${r.id}', this.value)">
                            ${['new','contacted','quoted','booked','closed'].map(s => `<option value="${s}" ${r.status===s?'selected':''}>${statusLabel(s)}</option>`).join('')}
                        </select>
                    </td>
                    <td><button class="btn-small-admin btn-edit" onclick="viewRequest('${r.id}')">Details</button></td>
                </tr>`).join('')}
            </tbody>
        </table>` : '<p style="color:#999;padding:20px">No requests found</p>';
}

async function viewRequest(id) {
    const { data } = await sb.from('trip_requests').select('*').eq('id', id).single();
    if (!data) return;

    const fields = [
        ['full_name', 'Full Name'], ['phone', 'Phone'], ['email', 'Email'],
        ['destination', 'Destination'], ['travel_dates', 'Travel Dates'], ['date_flexibility', 'Date Flexibility'],
        ['ages', 'Ages'], ['passport_valid', 'Passport Valid'], ['service_type', 'Service Type'],
        ['budget', 'Budget'], ['support_level', 'Support Level'], ['flight_pref', 'Flight Pref'],
        ['airline_pref', 'Airline'], ['luggage_type', 'Luggage'], ['cancel_policy', 'Cancel Policy'],
        ['hotel_level', 'Hotel Level'], ['bed_type', 'Bed Type'], ['meals', 'Meals'],
        ['hotel_cancel', 'Hotel Cancel'], ['shabbat_kosher', 'Shabbat/Kosher'],
    ];

    document.getElementById('requestDetail').innerHTML = `
        <h3 style="margin-bottom:20px">Trip Request — ${data.full_name}</h3>
        <div class="request-detail-grid">
            ${fields.map(([k, label]) => `<div class="detail-item"><label>${label}</label><p>${data[k] || '-'}</p></div>`).join('')}
            <div class="detail-item full-width"><label>Special Notes</label><p>${data.special_notes || '-'}</p></div>
            <div class="detail-item full-width">
                <label>Admin Notes</label>
                <textarea id="adminNotes_${data.id}" rows="3" style="width:100%;padding:8px;border:2px solid var(--admin-border);border-radius:8px;font-family:inherit">${data.admin_notes || ''}</textarea>
                <button class="btn-small-admin btn-edit" style="margin-top:8px" onclick="saveAdminNotes('${data.id}')">Save Notes</button>
            </div>
        </div>
        <div style="margin-top:16px;display:flex;gap:12px">
            <a href="https://wa.me/${(data.phone||'').replace(/[^0-9]/g,'')}" target="_blank" class="btn-admin-primary" style="width:auto;text-decoration:none;text-align:center">WhatsApp</a>
            <a href="mailto:${data.email}" class="btn-admin-secondary" style="text-decoration:none;text-align:center">Email</a>
        </div>`;

    document.getElementById('requestModal').style.display = 'flex';
}

async function updateRequestStatus(id, status) {
    await sb.from('trip_requests').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    loadDashboard();
}

async function saveAdminNotes(id) {
    const notes = document.getElementById(`adminNotes_${id}`).value;
    await sb.from('trip_requests').update({ admin_notes: notes }).eq('id', id);
    alert('Notes saved!');
}

// === DESTINATIONS ===
async function loadDestinations() {
    const { data } = await sb.from('destinations').select('*').order('sort_order');
    document.getElementById('destinationsTable').innerHTML = (data && data.length > 0) ? `
        <table class="admin-table">
            <thead><tr><th>Order</th><th>Image</th><th>Title (HE)</th><th>Tag</th><th>Active</th><th>Actions</th></tr></thead>
            <tbody>${data.map(d => `
                <tr>
                    <td>${d.sort_order}</td>
                    <td><img src="${d.image_url}" width="60" height="40" style="object-fit:cover;border-radius:6px"></td>
                    <td><strong>${d.title_he}</strong><br><small style="color:#999">${d.title_en}</small></td>
                    <td>${d.tag_he}</td>
                    <td>${d.is_active ? '✅' : '❌'}</td>
                    <td>
                        <button class="btn-small-admin btn-edit" onclick="editDest('${d.id}')">Edit</button>
                        <button class="btn-small-admin btn-delete" onclick="deleteDest('${d.id}')">Delete</button>
                    </td>
                </tr>`).join('')}
            </tbody>
        </table>` : '<p style="color:#999;padding:20px">No destinations. Click + Add to create one.</p>';
}

function openDestModal(data) {
    document.getElementById('destModalTitle').textContent = data ? 'Edit Destination' : 'Add Destination';
    document.getElementById('destId').value = data?.id || '';
    document.getElementById('destSlug').value = data?.slug || '';
    document.getElementById('destTitleEn').value = data?.title_en || '';
    document.getElementById('destTitleHe').value = data?.title_he || '';
    document.getElementById('destTagEn').value = data?.tag_en || '';
    document.getElementById('destTagHe').value = data?.tag_he || '';
    document.getElementById('destImage').value = data?.image_url || '';
    document.getElementById('destGradient').value = data?.gradient || '';
    document.getElementById('destHighEn').value = (data?.highlights_en || []).join('\n');
    document.getElementById('destHighHe').value = (data?.highlights_he || []).join('\n');
    document.getElementById('destTimeEn').value = data?.best_time_en || '';
    document.getElementById('destTimeHe').value = data?.best_time_he || '';
    document.getElementById('destCtaUrl').value = data?.cta_url || '#trip-form';
    document.getElementById('destCtaEn').value = data?.cta_text_en || '';
    document.getElementById('destCtaHe').value = data?.cta_text_he || '';
    document.getElementById('destSort').value = data?.sort_order || 0;
    document.getElementById('destActive').checked = data?.is_active !== false;
    document.getElementById('destModal').style.display = 'flex';
}

async function editDest(id) {
    const { data } = await sb.from('destinations').select('*').eq('id', id).single();
    if (data) openDestModal(data);
}

async function saveDest(e) {
    e.preventDefault();
    const id = document.getElementById('destId').value;
    const record = {
        slug: document.getElementById('destSlug').value,
        title_en: document.getElementById('destTitleEn').value,
        title_he: document.getElementById('destTitleHe').value,
        tag_en: document.getElementById('destTagEn').value,
        tag_he: document.getElementById('destTagHe').value,
        image_url: document.getElementById('destImage').value,
        gradient: document.getElementById('destGradient').value,
        highlights_en: document.getElementById('destHighEn').value.split('\n').filter(Boolean),
        highlights_he: document.getElementById('destHighHe').value.split('\n').filter(Boolean),
        best_time_en: document.getElementById('destTimeEn').value,
        best_time_he: document.getElementById('destTimeHe').value,
        cta_url: document.getElementById('destCtaUrl').value,
        cta_text_en: document.getElementById('destCtaEn').value,
        cta_text_he: document.getElementById('destCtaHe').value,
        sort_order: parseInt(document.getElementById('destSort').value) || 0,
        is_active: document.getElementById('destActive').checked,
        updated_at: new Date().toISOString(),
    };

    if (id) {
        await sb.from('destinations').update(record).eq('id', id);
    } else {
        await sb.from('destinations').insert(record);
    }

    closeModal('destModal');
    loadDestinations();
}

async function deleteDest(id) {
    if (!confirm('Are you sure you want to delete this destination?')) return;
    await sb.from('destinations').delete().eq('id', id);
    loadDestinations();
}

// === TESTIMONIALS ===
async function loadTestimonials() {
    const { data } = await sb.from('testimonials').select('*').order('sort_order');
    document.getElementById('testimonialsTable').innerHTML = (data && data.length > 0) ? `
        <table class="admin-table">
            <thead><tr><th>Author</th><th>Trip</th><th>Stars</th><th>Active</th><th>Actions</th></tr></thead>
            <tbody>${data.map(t => `
                <tr>
                    <td><strong>${t.author_name}</strong> (${t.author_initials})</td>
                    <td>${t.trip_label || '-'}</td>
                    <td>${'★'.repeat(t.stars)}</td>
                    <td>${t.is_active ? '✅' : '❌'}</td>
                    <td>
                        <button class="btn-small-admin btn-edit" onclick="editTestimonial('${t.id}')">Edit</button>
                        <button class="btn-small-admin btn-delete" onclick="deleteTestimonial('${t.id}')">Delete</button>
                    </td>
                </tr>`).join('')}
            </tbody>
        </table>` : '<p style="color:#999;padding:20px">No testimonials yet.</p>';
}

function openTestModal(data) {
    document.getElementById('testModalTitle').textContent = data ? 'Edit Testimonial' : 'Add Testimonial';
    document.getElementById('testId').value = data?.id || '';
    document.getElementById('testAuthor').value = data?.author_name || '';
    document.getElementById('testInitials').value = data?.author_initials || '';
    document.getElementById('testTrip').value = data?.trip_label || '';
    document.getElementById('testText').value = data?.review_text || '';
    document.getElementById('testStars').value = data?.stars || 5;
    document.getElementById('testActive').checked = data?.is_active !== false;
    document.getElementById('testModal').style.display = 'flex';
}

async function editTestimonial(id) {
    const { data } = await sb.from('testimonials').select('*').eq('id', id).single();
    if (data) openTestModal(data);
}

async function saveTestimonial(e) {
    e.preventDefault();
    const id = document.getElementById('testId').value;
    const record = {
        author_name: document.getElementById('testAuthor').value,
        author_initials: document.getElementById('testInitials').value,
        trip_label: document.getElementById('testTrip').value,
        review_text: document.getElementById('testText').value,
        stars: parseInt(document.getElementById('testStars').value),
        is_active: document.getElementById('testActive').checked,
    };

    if (id) await sb.from('testimonials').update(record).eq('id', id);
    else await sb.from('testimonials').insert(record);

    closeModal('testModal');
    loadTestimonials();
}

async function deleteTestimonial(id) {
    if (!confirm('Delete this testimonial?')) return;
    await sb.from('testimonials').delete().eq('id', id);
    loadTestimonials();
}

// === BLOG POSTS ===
async function loadBlogPosts() {
    const { data } = await sb.from('blog_posts').select('*').order('created_at', { ascending: false });
    document.getElementById('blogTable').innerHTML = (data && data.length > 0) ? `
        <table class="admin-table">
            <thead><tr><th>Title</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>${data.map(p => `
                <tr>
                    <td><strong>${p.title_he || p.title_en}</strong></td>
                    <td>${p.is_published ? '<span class="status-badge status-booked">Published</span>' : '<span class="status-badge status-new">Draft</span>'}</td>
                    <td>${new Date(p.created_at).toLocaleDateString('he-IL')}</td>
                    <td>
                        <button class="btn-small-admin btn-edit" onclick="editBlogPost('${p.id}')">Edit</button>
                        <button class="btn-small-admin btn-delete" onclick="deleteBlogPost('${p.id}')">Delete</button>
                    </td>
                </tr>`).join('')}
            </tbody>
        </table>` : '<p style="color:#999;padding:20px">No blog posts yet. Click + New Post to create one.</p>';
}

function openBlogModal(data) {
    document.getElementById('blogModalTitle').textContent = data ? 'Edit Post' : 'New Blog Post';
    document.getElementById('blogId').value = data?.id || '';
    document.getElementById('blogSlug').value = data?.slug || '';
    document.getElementById('blogTitleHe').value = data?.title_he || '';
    document.getElementById('blogTitleEn').value = data?.title_en || '';
    document.getElementById('blogContentHe').value = data?.content_he || '';
    document.getElementById('blogContentEn').value = data?.content_en || '';
    document.getElementById('blogCover').value = data?.cover_image || '';
    document.getElementById('blogTags').value = (data?.tags || []).join(', ');
    document.getElementById('blogPublished').checked = data?.is_published || false;
    document.getElementById('blogModal').style.display = 'flex';
}

async function editBlogPost(id) {
    const { data } = await sb.from('blog_posts').select('*').eq('id', id).single();
    if (data) openBlogModal(data);
}

async function saveBlogPost(e) {
    e.preventDefault();
    const id = document.getElementById('blogId').value;
    const isPublished = document.getElementById('blogPublished').checked;
    const record = {
        slug: document.getElementById('blogSlug').value,
        title_he: document.getElementById('blogTitleHe').value,
        title_en: document.getElementById('blogTitleEn').value,
        content_he: document.getElementById('blogContentHe').value,
        content_en: document.getElementById('blogContentEn').value,
        cover_image: document.getElementById('blogCover').value,
        tags: document.getElementById('blogTags').value.split(',').map(t => t.trim()).filter(Boolean),
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
    };

    if (id) await sb.from('blog_posts').update(record).eq('id', id);
    else await sb.from('blog_posts').insert(record);

    closeModal('blogModal');
    loadBlogPosts();
}

async function deleteBlogPost(id) {
    if (!confirm('Delete this blog post?')) return;
    await sb.from('blog_posts').delete().eq('id', id);
    loadBlogPosts();
}

// === ANALYTICS ===
async function loadAnalytics() {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

    const [views, formStarts, formCompletes, destSearches] = await Promise.all([
        sb.from('analytics_events').select('id').eq('event_type', 'page_view').gte('created_at', weekAgo),
        sb.from('analytics_events').select('id').eq('event_type', 'form_start').gte('created_at', weekAgo),
        sb.from('analytics_events').select('id').eq('event_type', 'form_complete').gte('created_at', weekAgo),
        sb.from('analytics_events').select('event_data').eq('event_type', 'dest_click').gte('created_at', weekAgo),
    ]);

    const pvCount = (views.data || []).length;
    const fsCount = (formStarts.data || []).length;
    const fcCount = (formCompletes.data || []).length;
    const convRate = fsCount > 0 ? Math.round((fcCount / fsCount) * 100) : 0;

    document.getElementById('statPageViews').textContent = pvCount;
    document.getElementById('statFormStarts').textContent = fsCount;
    document.getElementById('statFormCompletes').textContent = fcCount;
    document.getElementById('statConversion').textContent = convRate + '%';

    // Destination clicks
    const destClicks = {};
    (destSearches.data || []).forEach(e => {
        const dest = e.event_data?.destination || 'Unknown';
        destClicks[dest] = (destClicks[dest] || 0) + 1;
    });
    const sortedDests = Object.entries(destClicks).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxD = sortedDests.length > 0 ? sortedDests[0][1] : 1;

    document.getElementById('analyticsDestinations').innerHTML = sortedDests.length > 0 ? `
        <div class="bar-chart">${sortedDests.map(([d, c]) => `
            <div class="bar-row">
                <span class="bar-label">${d}</span>
                <div class="bar-track"><div class="bar-fill" style="width:${(c/maxD)*100}%"><span class="bar-value">${c}</span></div></div>
            </div>`).join('')}
        </div>` : '<p style="color:#999">No clicks yet</p>';

    // Recent events
    const { data: recentEvents } = await sb.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(20);
    document.getElementById('analyticsEvents').innerHTML = (recentEvents && recentEvents.length > 0) ? `
        <table class="admin-table">
            <thead><tr><th>Time</th><th>Event</th><th>Details</th></tr></thead>
            <tbody>${recentEvents.map(e => `
                <tr>
                    <td>${new Date(e.created_at).toLocaleString('he-IL')}</td>
                    <td>${e.event_type}</td>
                    <td><small>${JSON.stringify(e.event_data).substring(0, 60)}</small></td>
                </tr>`).join('')}
            </tbody>
        </table>` : '<p style="color:#999">No events yet</p>';
}

// === CHAT LOGS ===
async function loadChatLogs() {
    const { data } = await sb.from('chatbot_logs').select('*').order('created_at', { ascending: false }).limit(50);
    document.getElementById('chatLogTable').innerHTML = (data && data.length > 0) ? `
        <table class="admin-table">
            <thead><tr><th>Time</th><th>User Message</th><th>Bot Response</th><th>AI?</th></tr></thead>
            <tbody>${data.map(l => `
                <tr>
                    <td>${new Date(l.created_at).toLocaleString('he-IL')}</td>
                    <td style="max-width:250px;overflow:hidden;text-overflow:ellipsis">${l.user_message}</td>
                    <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis">${l.bot_response.substring(0, 80)}...</td>
                    <td>${l.was_ai ? '🤖' : '📋'}</td>
                </tr>`).join('')}
            </tbody>
        </table>` : '<p style="color:#999;padding:20px">No chat logs yet</p>';
}

// === HELPERS ===
function statusLabel(status) {
    const labels = { new: 'New', contacted: 'Contacted', quoted: 'Quoted', booked: 'Booked', closed: 'Closed' };
    return labels[status] || status;
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}
