const PLATFORM_COLOR = 'green';
const PLATFORM_WIDTH = 36;
const PLATFORM_HEIGHT = 5;
const PLATFORM_OFFSET_Y = 40;
const PLATFORM_SPEED = 0.4;

const PLAYER_WIDTH = 16;
const PLAYER_HEIGHT = 16;

const GRAVITY = 0.09;
const JUMP_POWER = -5.0;

const HORIZONTAL_ACC = 0.09;
const HORIZONTAL_FRICTION = 0.87;
const MAX_HORIZONTAL_SPEED = 2;

$(() =>
{
	class GameField
	{
		constructor(canvas, width = 200, height = 400)
		{
			this.canvas = canvas;
			this.ctx = this.canvas[0].getContext('2d');
			this.width = width;
			this.height = height;
			this.platforms = new Set();

			this.player = new Player(this.ctx, this);
			this.ai = new AIPlayer(this.player, this);

			this.score = 0;
			this.bestScore = 0;
			this.loadBestScore();

			this.generatePlatforms()

			this.start();
		}

		generatePlatforms()
		{
			const linesCount = this.height / PLATFORM_OFFSET_Y;

			for (let i = 1; i < linesCount; i++)
			{
				const x = this.getRandomInt(0, this.width);
				this.createPlatform(
					x > (this.width - PLATFORM_WIDTH) ? this.width - PLATFORM_WIDTH : x,
					PLATFORM_OFFSET_Y * i,
				);
			}

			const arr = [...this.platforms];
			this.player.setDefaultPosition(arr[arr.length - 1]);
		}

		restartGame()
		{
			this.platforms.clear();
			this.generatePlatforms();
			this.player.rightPressed = false;
			this.player.leftPressed = false;

			this.saveBestScore()

			this.score = 0;
		}

		start()
		{
			this.clear();

			this.ai.update();

			for (const figure of this.platforms) figure.draw();
			this.player.draw();

			this.ctx.font = "12px monospace";
			this.ctx.fillStyle = "#222";
			this.ctx.fillText("Score: " + Math.floor(this.score), 5, 15);
			this.ctx.fillText("Best: " + this.bestScore, 5, 30);

			// Статус AI (правый верхний угол)
			this.ctx.font = "bold 12px monospace";
			this.ctx.fillStyle = this.ai.enabled ? "#00aa00" : "#aa0000";
			this.ctx.fillText("AI: " + (this.ai.enabled ? "ON" : "OFF"), this.width - 50, 15);

			// Подсказка (внизу)
			this.ctx.font = "10px monospace";
			this.ctx.fillStyle = "#888";
			this.ctx.fillText("Press A to toggle AI", this.width - 110, this.height - 5);

			requestAnimationFrame(() => this.start());
		}

		clear()
		{
			this.ctx.fillStyle = '#ffffff';
			this.ctx.fillRect(0, 0, this.width, this.height);
		}

		removeItem(figure)
		{
			this.platforms.delete(figure);
		}

		createPlatform(sx, sy)
		{
			const figure = new Figure(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_COLOR, sx, sy, this.ctx, this);
			this.platforms.add(figure);
		}

		findPlatformBelow(player)
		{
			for (const platform of this.platforms)
			{
				const horizontal =	player.x + PLAYER_WIDTH > platform.sx &&
											player.x < platform.sx + PLATFORM_WIDTH;

				// Добавляем запас на основе скорости (чтобы не провалиться)
				const vertical = player.vy > 0 &&
					player.y + PLAYER_HEIGHT >= platform.sy &&
					player.y + PLAYER_HEIGHT - player.vy <= platform.sy + PLATFORM_HEIGHT;

				if (horizontal && vertical) return platform;
			}
			return null;
		}

		scrollIfNeeded(player)
		{
			const SCROLL_THRESHOLD = this.height * 0.5;

			if (player.y < SCROLL_THRESHOLD)
			{
				const delta = Math.min(SCROLL_THRESHOLD - player.y, 2);

				if (delta > 0) this.score += Math.floor(delta * 0.5);

				for (const platform of this.platforms) platform.sy += delta;

				player.y += delta;

				for (let platform of [...this.platforms])
				{
					if (platform.sy >= this.height) {
						this.platforms.delete(platform);
					}
				}

				this.generateAdditionalPlatforms();
			}
		}

		generateAdditionalPlatforms()
		{
			if (this.platforms.size === 0) return;

			let minY = Infinity;
			for (const platform of this.platforms)
			{
				if (platform.sy < minY) minY = platform.sy;
			}

			// Пока расстояние от верхней платформы до верха экрана не станет достаточно,
			// добавляем новые платформы выше.
			let currentY = minY - PLATFORM_OFFSET_Y;
			while (currentY > -200) {
				const x = this.getRandomInt(0, this.width - PLATFORM_WIDTH);
				this.createPlatform(x, currentY);
				currentY -= PLATFORM_OFFSET_Y;
			}
		}

		getRandomInt(min, max)
		{
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		loadBestScore()
		{
			const saved = localStorage.getItem('doodleJumpBestScore');
			if (saved !== null) this.bestScore = parseInt(saved, 10);
		}

		saveBestScore()
		{
			if (this.score > this.bestScore)
			{
				this.bestScore = this.score;
				localStorage.setItem('doodleJumpBestScore', this.bestScore);
			}
		}
	}

	const field = new GameField($('canvas'));

	$(document).on('keydown', (e) => {
		if (e.key === 'a' || e.key === 'A') {
			field.ai.toggle();
		}
	});

	requestAnimationFrame(() => field.start());
});