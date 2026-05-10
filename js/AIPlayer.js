class AIPlayer
{
	constructor(player, field)
	{
		this.player = player;
		this.field = field;
		this.enabled = true;
		this.tolerance = 4;
	}

	update()
	{
		if (!this.enabled) return;

		const platforms = [...this.field.platforms];
		if (platforms.length === 0) return;

		// Поиск ближайшей платформы снизу
		let best = null;
		let bestDist = Infinity;

		for (const p of platforms)
		{
			if (p.sy <= this.player.y + PLAYER_HEIGHT) continue;
			const dist = p.sy - (this.player.y + PLAYER_HEIGHT);

			if (dist < bestDist && dist < 200) { bestDist = dist; best = p; }
		}

		if (!best) { this.releaseControls(); return; }

		const targetCenter = best.sx + best.w / 2;
		const playerCenter = this.player.x + PLAYER_WIDTH / 2;
		const error = targetCenter - playerCenter;

		if (Math.abs(error) <= this.tolerance)
		{
			this.releaseControls();
		}
		else if (error > 0)
		{
			this.player.rightPressed = true;
			this.player.leftPressed = false;
		}
		else
		{
			this.player.rightPressed = false;
			this.player.leftPressed = true;
		}

		this.preventEdgeCollision();
	}

	preventEdgeCollision()
	{
		if (this.player.x <= 5 && this.player.leftPressed) this.player.leftPressed = false;
		if (this.player.x + PLAYER_WIDTH >= this.field.width - 5 && this.player.rightPressed) this.player.rightPressed = false;
	}

	releaseControls()
	{
		this.player.rightPressed = false;
		this.player.leftPressed = false;
	}

	toggle()
	{
		this.enabled = !this.enabled;
		this.releaseControls();
	}
}