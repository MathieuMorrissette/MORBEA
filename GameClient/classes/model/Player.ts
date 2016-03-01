class Player extends Character implements IPlayer
{
    public Type: PlayerType;

    public GetPlayerImage(): HTMLImageElement
    {
        var player_image = new Image();
        if (this.Type == PlayerType.Archer)
        {
            player_image.src = "../resources/characters/archer.png";
        }

        return player_image;
    }

    public static GetPlayer(player: IPlayer): Player
    {
        var buffer = new Player();
        buffer.Type = player.Type;
        buffer.Name = player.Name;
        buffer.PositionInfo = player.PositionInfo;
        buffer.Health = player.Health;
        buffer.Strengh = player.Strengh;
        buffer.Defence = player.Defence;
        buffer.GodMode = player.GodMode;

        return buffer;
    }
}