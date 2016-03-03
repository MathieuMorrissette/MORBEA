class MapInfo implements IMapInfo
{
    public MapName: string;
    public Tilesets: Tileset[];
    public Width: number;
    public Height: number;

    public static GetMapInfo(mapInfo: IMapInfo): MapInfo
    {
        var buffer = new MapInfo();
        buffer.MapName = mapInfo.MapName;
        buffer.Tilesets = Tileset.GetTilesets(mapInfo.Tilesets);
        buffer.Width = mapInfo.Width;
        buffer.Height = mapInfo.Height;

        return buffer;
    }
}