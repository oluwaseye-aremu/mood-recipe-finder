const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase, getRandomRecipeByMood } = require('./db');
const https = require('https');
const http = require('http');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

initializeDatabase();

app.get('/api/recipes', async (req, res) => {
	try {
		const mood = String(req.query.mood || '').toLowerCase().trim();
		if (!mood) {
			return res.status(400).json({ error: 'Mood is required as a query parameter.' });
		}
		const recipe = await getRandomRecipeByMood(mood);
		if (!recipe) {
			return res.status(404).json({ error: 'No recipes found for this mood.' });
		}
		return res.json({ id: recipe.id, name: recipe.name, url: recipe.url, mood: recipe.mood });
	} catch (error) {
		return res.status(500).json({ error: 'Internal server error' });
	}
});

app.post('/api/chat', async (req, res) => {
	try {
		const userMessage = String((req.body && req.body.message) || '').trim();
		const mood = String((req.body && req.body.mood) || '').toLowerCase().trim();
		if (!userMessage) {
			return res.status(400).json({ reply: "I'd love to chat! What would you like to ask?" });
		}

		const lower = userMessage.toLowerCase();
		let reply;

		const mentionsRecipe = /(recipe|cook|food|dish|eat|suggest|another)/i.test(lower);
		const greetings = /(hello|hi|hey|yo|good\s*(morning|afternoon|evening))/i.test(lower);
		const thanks = /(thanks|thank you|thx|appreciate)/i.test(lower);

		if (thanks) {
			reply = "You're welcome! If you want another idea, just say the mood or ask for a recipe.";
		} else if (greetings && !mentionsRecipe) {
			reply = "Hey there! I'm your friendly kitchen buddy. Tell me your mood, and I'll suggest something tasty.";
		} else if (mentionsRecipe || mood) {
			const requestedMoodMatch = lower.match(/(happy|comfort|energized|calm|sad)/);
			const effectiveMood = (requestedMoodMatch && requestedMoodMatch[1]) || mood || 'happy';
			const recipe = await getRandomRecipeByMood(effectiveMood);
			if (recipe) {
				reply = `How about “${recipe.name}”? It pairs nicely with a ${effectiveMood} vibe. Here you go: ${recipe.url}`;
			} else {
				reply = "I couldn't find a recipe for that mood yet. Try another mood like happy, calm, or comfort.";
			}
		} else {
			reply = "I can suggest recipes by mood (happy, comfort, energized, calm, sad). Ask me for a recipe!";
		}

		return res.json({ reply });
	} catch (error) {
		return res.status(500).json({ reply: "Oops, something went wrong on my side. Try again in a moment." });
	}
});

// Simple image proxy to avoid hotlink restrictions
app.get('/img', (req, res) => {
	const targetUrl = String(req.query.url || '');
	try {
		if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
			return res.status(400).send('Invalid url');
		}
		const client = targetUrl.startsWith('https') ? https : http;
		client.get(targetUrl, (upstream) => {
			const contentType = upstream.headers['content-type'] || 'image/jpeg';
			res.setHeader('Content-Type', contentType);
			upstream.pipe(res);
		}).on('error', () => {
			res.status(502).send('Bad gateway');
		});
	} catch (_) {
		res.status(500).send('Server error');
	}
});

app.listen(port, () => {
	console.log(`Mood Recipes server listening on http://localhost:${port}`);
});


