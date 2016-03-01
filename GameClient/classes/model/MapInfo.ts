class MapInfo implements IMapInfo
{
    public MapName: string;
    public Tilesets: Tileset[];

    public static GetMapInfo(mapInfo: IMapInfo): MapInfo
    {
        var buffer = new MapInfo();
        buffer.MapName = mapInfo.MapName;
        buffer.Tilesets = Tileset.GetTilesets(mapInfo.Tilesets);

        return buffer;
    }
}