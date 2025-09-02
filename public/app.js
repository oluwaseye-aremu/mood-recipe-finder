const moodSelect = document.getElementById('mood');
const findBtn = document.getElementById('findBtn');
const anotherBtn = document.getElementById('anotherBtn');
const resetBtn = document.getElementById('resetBtn');
const result = document.getElementById('result');
const recipeName = document.getElementById('recipeName');
const recipeLink = document.getElementById('recipeLink');
const message = document.getElementById('message');
const chatToggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatLog = document.getElementById('chatLog');
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
const galleryToggle = document.getElementById('galleryToggle');
const galleryDropdown = document.getElementById('galleryDropdown');
const galleryDropdownMobile = document.getElementById('galleryDropdownMobile');
const galleryGrid = document.getElementById('galleryGrid');

function setMessage(text) {
	message.textContent = text || '';
}

async function fetchRecipe(mood) {
	try {
		setMessage('Loading...');
		const res = await fetch(`/api/recipes?mood=${encodeURIComponent(mood)}`);
		const data = await res.json();
		if (!res.ok) {
			throw new Error(data.error || 'Failed to fetch');
		}
		recipeName.textContent = data.name;
		recipeLink.textContent = data.url;
		recipeLink.href = data.url;
		result.classList.remove('hidden');
		setMessage('');
	} catch (err) {
		result.classList.add('hidden');
		setMessage(err.message);
	}
}

findBtn.addEventListener('click', () => {
	const mood = (moodSelect.value || '').trim();
	if (!mood) {
		setMessage('Please select a mood.');
		return;
	}
	fetchRecipe(mood);
});

anotherBtn.addEventListener('click', () => {
	const mood = (moodSelect.value || '').trim();
	if (mood) fetchRecipe(mood);
});

resetBtn.addEventListener('click', () => {
	result.classList.add('hidden');
	recipeName.textContent = '';
	recipeLink.textContent = '';
	recipeLink.href = '#';
	setMessage('');
});



function appendChatBubble(text, role) {
	const wrapper = document.createElement('div');
	wrapper.className = role === 'user' ? 'flex justify-end' : 'flex';
	const bubble = document.createElement('div');
	bubble.className = role === 'user'
		? 'max-w-[80%] rounded-lg px-3 py-2 bg-indigo-600 text-white'
		: 'max-w-[80%] rounded-lg px-3 py-2 bg-slate-100 text-slate-900';
	bubble.textContent = text;
	wrapper.appendChild(bubble);
	chatLog.appendChild(wrapper);
	chatLog.scrollTop = chatLog.scrollHeight;
}

chatToggle.addEventListener('click', () => {
	const visible = !chatWindow.classList.contains('hidden');
	if (visible) {
		chatWindow.classList.add('hidden');
	} else {
		chatWindow.classList.remove('hidden');
		chatInput.focus();
	}
});

chatForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	const text = (chatInput.value || '').trim();
	if (!text) return;
	appendChatBubble(text, 'user');
	chatInput.value = '';
	try {
		const mood = (moodSelect.value || '').trim();
		const res = await fetch('/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message: text, mood })
		});
		const data = await res.json();
		appendChatBubble(data.reply || 'Sorry, I did not catch that.', 'assistant');
	} catch (err) {
		appendChatBubble('Oops, something went wrong. Please try again.', 'assistant');
	}
});

// Navbar interactions
mobileToggle && mobileToggle.addEventListener('click', () => {
	const open = !mobileMenu.classList.contains('hidden');
	if (open) mobileMenu.classList.add('hidden');
	else mobileMenu.classList.remove('hidden');
});

if (galleryToggle && galleryDropdown) {
	galleryToggle.addEventListener('click', (e) => {
		e.preventDefault();
		e.stopPropagation();
		galleryDropdown.classList.toggle('hidden');
	});
}

document.addEventListener('click', (e) => {
	if (!galleryDropdown) return;
	if (e.target.closest('#galleryMenu')) return;
	galleryDropdown.classList.add('hidden');
});

// Sample dish data for gallery and dropdowns
const sampleDishes = [
	{ name: 'Jollof Rice', desc: 'Smoky party-style rice.', price: 3500, img: 'https://images.pexels.com/photos/6210961/pexels-photo-6210961.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1' },
	{ name: 'Suya Skewers', desc: 'Spicy grilled beef sticks.', price: 2800, img: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1' },
	{ name: 'Pounded Yam & Egusi', desc: 'Hearty melon soup delight.', price: 4200, img: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1' },
	{ name: 'Chicken Shawarma', desc: 'Creamy, spicy wrap.', price: 2500, img: 'https://images.pexels.com/photos/1095550/pexels-photo-1095550.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1' },
	{ name: 'Seafood Pasta', desc: 'Rich tomato seafood mix.', price: 5500, img: 'https://images.pexels.com/photos/3296271/pexels-photo-3296271.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1' },
	{ name: 'Avocado Toast', desc: 'Fresh and zesty.', price: 1800, img: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1' },
	{ name: 'Grilled Salmon', desc: 'Lemon herb glaze.', price: 6200, img: 'https://images.pexels.com/photos/3296271/pexels-photo-3296271.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1' },
	{ name: 'Pancake Stack', desc: 'Maple syrup drizzle.', price: 2000, img: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1' }
];

const FALLBACK_IMG = 'https://images.weserv.nl/?url=' + encodeURIComponent('source.unsplash.com/400x300/?food,dish,meal');

function proxied(url) {
	try {
		if (typeof url !== 'string' || url.length === 0) return FALLBACK_IMG;
		if (/^https?:\/\/images\.weserv\.nl\//i.test(url)) return url; // already proxied
		const parsed = new URL(url);
		const upstream = `${parsed.hostname || ''}${parsed.pathname || ''}${parsed.search || ''}`;
		return 'https://images.weserv.nl/?url=' + encodeURIComponent(upstream);
	} catch (_) {
		const stripped = String(url).replace(/^https?:\/\//i, '');
		if (stripped) return 'https://images.weserv.nl/?url=' + encodeURIComponent(stripped);
		return FALLBACK_IMG;
	}
}
function imgTag(src, alt, classes) {
	return `<img src="${proxied(src)}" alt="${alt}" class="${classes}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';" />`;
}

function naira(amount) {
	return `₦${amount.toLocaleString()}`;
}

function renderDropdownCards(targetEl, items) {
	if (!targetEl) return;
	targetEl.innerHTML = '';
	items.slice(0, 4).forEach((item) => {
		const card = document.createElement('div');
		card.className = 'flex gap-3 items-center';
		card.innerHTML = `
			${imgTag(item.img, item.name, 'w-16 h-16 rounded object-cover')}
			<div class="min-w-0">
				<p class="font-medium text-slate-800 truncate">${item.name}</p>
				<p class="text-xs text-slate-500 truncate">${item.desc}</p>
				<p class="text-sm font-semibold text-emerald-600">${naira(item.price)}</p>
			</div>
		`;
		targetEl.appendChild(card);
	});
}

function renderGalleryGrid(targetEl, items) {
	if (!targetEl) return;
	targetEl.innerHTML = '';
	const randomized = [...items].sort(() => Math.random() - 0.5).slice(0, 6);
	randomized.forEach((item) => {
		const card = document.createElement('div');
		card.className = 'bg-white rounded-xl border border-slate-200 shadow overflow-hidden';
		card.innerHTML = `
			${imgTag(item.img, item.name, 'w-full h-40 object-cover')}
			<div class="p-4 space-y-1">
				<h3 class="font-semibold text-slate-800">${item.name}</h3>
				<p class="text-sm text-slate-600">${item.desc}</p>
				<p class="text-emerald-600 font-semibold">${naira(item.price)}</p>
			</div>
		`;
		targetEl.appendChild(card);
	});
}

function ensureGalleryPopulated() {
	try {
		renderDropdownCards(galleryDropdown, sampleDishes);
		renderDropdownCards(galleryDropdownMobile, sampleDishes);
		renderGalleryGrid(galleryGrid, sampleDishes);
		if (galleryGrid && galleryGrid.children.length === 0) {
			const placeholders = new Array(6).fill(0).map((_, i) => ({
				name: `Delicious Dish ${i + 1}`,
				desc: 'Chef special, made fresh.',
				price: 3000 + i * 250,
				img: 'https://source.unsplash.com/400x300/?food,meal'
			}));
			renderGalleryGrid(galleryGrid, placeholders);
		}
	} catch (_) {
		if (galleryGrid) {
			galleryGrid.innerHTML = '<div class="text-slate-600">Unable to load dishes right now. Please refresh.</div>';
		}
	}
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', ensureGalleryPopulated);
} else {
	ensureGalleryPopulated();
}



