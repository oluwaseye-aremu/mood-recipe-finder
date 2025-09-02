const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const databaseFilePath = path.join(__dirname, 'recipes.sqlite');
const db = new sqlite3.Database(databaseFilePath);

function initializeDatabase() {
	db.serialize(() => {
		db.run(`CREATE TABLE IF NOT EXISTS recipes (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			mood TEXT NOT NULL,
			url TEXT NOT NULL
		)`);

		const sampleRecipes = [
			{ name: 'Comforting Mac and Cheese', mood: 'comfort', url: 'https://www.simplyrecipes.com/recipes/perfect_macaroni_and_cheese/' },
			{ name: 'Cozy Chicken Noodle Soup', mood: 'comfort', url: 'https://www.simplyrecipes.com/recipes/homemade_chicken_noodle_soup/' },
			{ name: 'Refreshing Quinoa Salad', mood: 'happy', url: 'https://www.loveandlemons.com/quinoa-salad/' },
			{ name: 'Zesty Fish Tacos', mood: 'happy', url: 'https://www.simplyrecipes.com/recipes/fish_tacos/' },
			{ name: 'Energizing Smoothie Bowl', mood: 'energized', url: 'https://www.loveandlemons.com/smoothie-bowl/' },
			{ name: 'Spicy Chickpea Stir-fry', mood: 'energized', url: 'https://www.bonappetit.com/recipe/chickpea-stir-fry' },
			{ name: 'Calming Chamomile Tea Cookies', mood: 'calm', url: 'https://sallysbakingaddiction.com/tea-cakes/' },
			{ name: 'Meditative Miso Soup', mood: 'calm', url: 'https://www.justonecookbook.com/miso-soup/' },
			{ name: 'Uplifting Lemon Pasta', mood: 'sad', url: 'https://www.bonappetit.com/recipe/lemony-pasta' },
			{ name: 'Cheery Veggie Omelet', mood: 'sad', url: 'https://www.simplyrecipes.com/recipes/classic_omelet/' }
		];

		db.run('CREATE INDEX IF NOT EXISTS idx_recipes_mood ON recipes(mood)');

		db.get('SELECT COUNT(*) as count FROM recipes', (err, row) => {
			if (err) return;
			if (row && row.count === 0) {
				const insertStatement = db.prepare('INSERT INTO recipes (name, mood, url) VALUES (?, ?, ?)');
				sampleRecipes.forEach((recipe) => {
					insertStatement.run(recipe.name, recipe.mood, recipe.url);
				});
				insertStatement.finalize();
			}
		});
	});
}

function getRandomRecipeByMood(mood) {
	return new Promise((resolve, reject) => {
		db.all('SELECT * FROM recipes WHERE mood = ?', [mood], (err, rows) => {
			if (err) {
				return reject(err);
			}
			if (!rows || rows.length === 0) {
				return resolve(null);
			}
			const randomIndex = Math.floor(Math.random() * rows.length);
			resolve(rows[randomIndex]);
		});
	});
}

module.exports = {
	db,
	initializeDatabase,
	getRandomRecipeByMood,
};


