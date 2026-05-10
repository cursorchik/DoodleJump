class Player
{
	x;
	y;
	vy = 0;
	vx = 0;

	ctx;
	field;

	rightPressed = false;
	leftPressed = false;

	constructor(ctx, field)
	{
		this.ctx = ctx;
		this.field = field;

		$(document).on('keydown', (e) =>
		{
			if (e.key === 'ArrowRight')
			{
				this.rightPressed = true;
				this.leftPressed = false;
			}
			else if (e.key === 'ArrowLeft')
			{
				this.rightPressed = false;
				this.leftPressed = true;
			}
		});

		$(document).on('keyup', (e) =>
		{
			if (e.key === 'ArrowRight') this.rightPressed = false;
			else if (e.key === 'ArrowLeft') this.leftPressed = false;
		});
	}

	draw()
	{
		let acc = 0;
		if (this.rightPressed) acc = HORIZONTAL_ACC;
		else if (this.leftPressed) acc = -HORIZONTAL_ACC;

		this.vx += acc;
		// Применяем трение (только если клавиши не нажаты — чтобы не мешать ускорению)
		if (!this.rightPressed && !this.leftPressed) this.vx *= HORIZONTAL_FRICTION;

		// Ограничиваем скорость
		if (this.vx > MAX_HORIZONTAL_SPEED) this.vx = MAX_HORIZONTAL_SPEED;
		if (this.vx < -MAX_HORIZONTAL_SPEED) this.vx = -MAX_HORIZONTAL_SPEED;

		this.x += this.vx;

		this.vy += GRAVITY;
		this.y += this.vy;

		if (this.vy > 0)
		{
			const platform = this.field.findPlatformBelow(this);
			if (platform)
			{
				this.y = platform.sy - PLAYER_HEIGHT;
				this.vy = JUMP_POWER;
			}
		}

		if (this.y + PLAYER_HEIGHT >= this.field.height) this.field.restartGame();

		if (this.x + PLAYER_WIDTH > this.field.width)
		{
			this.x = this.field.width - PLAYER_WIDTH;
			this.vx = 0;  // или можно отразить: this.vx = -this.vx * 0.5
		}
		if (this.x < 0)
		{
			this.x = 0;
			this.vx = 0;
		}

		this.field.scrollIfNeeded(this);

		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(this.x, this.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	}

	moveRight()
	{
		if (this.x + PLAYER_WIDTH < this.field.width)
		{
			this.x = this.x + PLAYER_X_SPEED
		}
	}

	moveLeft()
	{
		if (this.x > 0) this.x = this.x - PLAYER_X_SPEED
	}

	setDefaultPosition(platform)
	{
		this.x = platform.sx;
		this.y = platform.sy - PLAYER_HEIGHT;
		this.vy = 0;
	}
}