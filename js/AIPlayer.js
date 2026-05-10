// AIPlayer.js
class AIPlayer
{
	/**
	 * @param {Player} player - объект игрока
	 * @param {GameField} field - игровое поле (чтобы получить список платформ)
	 */
	constructor(player, field)
	{
		this.player = player;
		this.field = field;
		this.enabled = true;
	}

	update()
	{
		if (!this.enabled) return;

		const platforms = [...this.field.platforms];
		if (platforms.length === 0) return;

		let targetPlatform = null;
		let minDistance = Infinity;

		for (const platform of platforms)
		{
			if (platform.sy > this.player.y)
			{
				const distance = platform.sy - this.player.y;
				if (distance < minDistance)
				{
					minDistance = distance;
					targetPlatform = platform;
				}
			}
		}

		if (!targetPlatform) return;

		const platformCenterX = targetPlatform.sx + targetPlatform.w / 2;
		const playerCenterX = this.player.x + PLAYER_WIDTH / 2;

		const tolerance = 8;
		if (Math.abs(platformCenterX - playerCenterX) <= tolerance)
		{
			this.player.rightPressed = false;
			this.player.leftPressed = false;
			return;
		}

		if (playerCenterX < platformCenterX)
		{
			this.player.rightPressed = true;
			this.player.leftPressed = false;
		}
		else
		{
			this.player.rightPressed = false;
			this.player.leftPressed = true;
		}
	}

	toggle()
	{
		this.enabled = !this.enabled;
		if (!this.enabled)
		{
			this.player.rightPressed = false;
			this.player.leftPressed = false;
		}
		console.log('AI enabled:', this.enabled);
	}
}