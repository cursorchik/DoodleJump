class Figure
{
	// w;
	h;
	sx;
	sy;
	color;
	ctx;
	field;
	fallDawn;
	intersectCount;

	constructor(w, h, color, sx, sy, ctx, field)
	{
		this.w = w;
		this.h = h;
		this.sx = sx;
		this.sy = sy;
		this.color = color;
		this.fallDawn = true;
		this.intersectCount = 0;

		this.ctx = ctx;
		this.field = field;
	}

	draw()
	{
		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(this.sx, this.sy, this.w, this.h);

		// this.upDown();
		// this.rain();
	}

	setIntersect()
	{
		this.intersectCount++;
	}

	getIntersectCount()
	{
		return this.intersectCount;
	}

	rain()
	{
		let speed = 0.6;
		this.sy = this.sy + speed;
		if (this.sy > this.field.height) this.remove();
	}

	setCollision()
	{
		this.hasCollision = true;
		this.color = 'red';
	}

	unsetCollision()
	{
		this.hasCollision = false;
		this.color = 'green';
	}

	remove()
	{
		this.field.removeItem(this);
	}

	upDown()
	{
		let speed = 2;

		if (this.fallDawn)
		{
			if ((this.sy + this.h) >= this.field.height) this.fallDawn = false;
			else this.sy = this.sy + speed;
		}
		else
		{
			if (this.sy <= 0) this.fallDawn = true;
			else this.sy = this.sy - speed;
		}
	}
}