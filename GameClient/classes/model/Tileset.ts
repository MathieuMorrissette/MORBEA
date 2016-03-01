class Tileset implements ITileset
{
    public ImageName: string;
    public Width: number;
    public Height: number;

    public static GetTilesets(tilesets: ITileset[]): Tileset[]
    {
        var list: Tileset[] = new Array<Tileset>();

        for (var i = 0; i < tilesets.length; i++)
        {
            var tileset = tilesets[i];
            var tilesetInstance = Tileset.GetTileset(tileset);
            list.push(tilesetInstance);
        }

        return list;
    }

    public static GetTileset(tileset: ITileset): Tileset
    {
        var buffer = new Tileset();
        buffer.ImageName = tileset.ImageName;
        buffer.Width = tileset.Width;
        buffer.Height = tileset.Height;
        return buffer;
    }
}