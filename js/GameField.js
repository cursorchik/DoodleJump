const PLATFORM_COLOR = 'green';
const PLATFORM_WIDTH = 32;
const PLATFORM_HEIGHT = 5;
const PLATFORM_OFFSET_Y = 40;
const PLATFORM_SPEED = 0.2;

const PLAYER_WIDTH = 16;
const PLAYER_HEIGHT = 16;
const PLAYER_X_SPEED = 0.4;

const GRAVITY = 0.05;      // ускорение вниз за кадр
const JUMP_POWER = -3;    // начальная скорость вверх (отрицательная)

// Горизонтальная физика

const HORIZONTAL_ACC = 0.09;     // ускорение при нажатии
const HORIZONTAL_FRICTION = 0.87; // трение воздуха (1 = без потерь, <1 замедляет)
const MAX_HORIZONTAL_SPEED = 2;   // максимальная скорость

$(() =>
{
	class GameField
	{
		constructor(width = 200, height = 400)
		{
			this.canvas = $('canvas');
			this.ctx = this.canvas[0].getContext('2d');
			this.width = width;
			this.height = height;
			this.platforms = new Set();

			this.player = new Player(this.ctx, this);

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
		}

		start()
		{
			this.clear();

			for (const figure of this.platforms) figure.draw();
			this.player.draw();

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
				let delta = Math.min(SCROLL_THRESHOLD - player.y, 2);

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
	}



	const field = new GameField();

	requestAnimationFrame(() => field.start());
});