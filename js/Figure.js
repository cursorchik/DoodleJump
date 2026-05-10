class Figure
{
	constructor(w, h, color, sx, sy, ctx, field)
	{
		this.w = w;
		this.h = h;
		this.sx = sx;
		this.sy = sy;
		this.color = color;
		this.moveRight = Math.random() > 0.5;

		this.ctx = ctx;
		this.field = field;
	}

	draw()
	{
		if (this.moveRight)
		{
			if (this.sx + this.w >= this.field.width)
			{
				this.sx = this.field.width - this.w;
				this.moveRight = false;
			}
			else this.sx += PLATFORM_SPEED;
		}
		else
		{
			if (this.sx <= 0)
			{
				this.sx = 0;
				this.moveRight = true;
			}
			else this.sx -= PLATFORM_SPEED;
		}


		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(this.sx, this.sy, this.w, this.h);
	}

	remove()
	{
		this.field.removeItem(this);
	}
}