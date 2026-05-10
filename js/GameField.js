$(() =>
{
	const PLATFORM_COLOR = 'green';
	const PLATFORM_WIDTH = 32;
	const PLATFORM_HEIGHT = 5;
	const PLATFORM_OFFSET_Y = 40;

	const PLAYER_WIDTH = 16;
	const PLAYER_HEIGHT = 16;

	class GameField
	{
		constructor(player, image, width = 200, height = 400)
		{
			this.canvas = $('canvas');
			this.ctx = this.canvas[0].getContext('2d');
			this.width = width;
			this.height = height;
			this.figures = new Set();

			this.player = new Player(this.ctx, this);

			const linesCount = this.height / PLATFORM_OFFSET_Y;

			for (let i = 1; i < linesCount; i++)
			{
				const x = this.getRandomInt(0, this.width);
				this.createPlatform(
					x > (this.width - PLATFORM_WIDTH) ? this.width - PLATFORM_WIDTH : x,
					PLATFORM_OFFSET_Y * i,
				);
			}

			const arr = [...this.figures];
			this.player.setDefaultPosition(arr[arr.length - 1]);

			this.start();
		}

		start()
		{
			this.clear();

			for (const figure of this.figures) figure.draw();
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
			this.figures.delete(figure);
		}

		createPlatform(sx, sy)
		{
			const figure = new Figure(PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_COLOR, sx, sy, this.ctx, this);
			this.figures.add(figure);
		}

		isCollisionWithPlatforms(playerX, playerY)
		{
			for (const figure of [...this.figures])
			{
				if (
					playerX < (this.width - figure.sx + PLATFORM_WIDTH) || playerX > (this.width - figure.sx)
					&&
					playerY < (this.height - figure.sy + PLATFORM_HEIGHT) || playerY > (this.height - figure.sy)
				)
				{
					if (figure.getIntersectCount() > 1)
					{
						figure.setCollision();
						return true;
					}
					figure.setIntersect();
				}
			}

			return false;
		}

		getRandomInt(min, max)
		{
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
	}

	class Player
	{
		x;
		y;
		fallDawn = false;
		pointOfJump

		jumpSpeed = 0.7;
		maxJumpHeight = PLAYER_HEIGHT * 2;

		ctx;
		field;

		constructor(ctx, field)
		{
			this.ctx = ctx;
			this.field = field;
		}

		draw()
		{
			this.ctx.fillStyle = 'black';

			if (this.fallDawn)
			{
				if (this.field.isCollisionWithPlatforms(this.x, this.y)) this.fallDawn = false;
				else this.y = this.y + this.jumpSpeed;
			}
			else
			{
				if (Math.abs(this.pointOfJump - this.y) >= this.maxJumpHeight) this.fallDawn = true;
				else this.y = this.y - this.jumpSpeed;
			}

			this.ctx.fillRect(this.x, this.y, PLAYER_WIDTH, PLAYER_HEIGHT);
		}

		moveRight()
		{
			// Кое что надо тут сделать еще...
			this.x = this.x + 0.6
		}

		moveLeft()
		{
			// Кое что надо тут сделать еще...
			this.x = this.x - 0.6
		}

		setDefaultPosition(platform)
		{
			this.x = platform.sx;
			this.y = platform.sy - 16;
			this.pointOfJump = this.y;
		}
	}

	const field = new GameField('');

	requestAnimationFrame(() => field.start());
});