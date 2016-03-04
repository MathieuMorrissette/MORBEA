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

    public GetImage(callback: (image: HTMLImageElement) => any )
    {
        var image = new Image();
        image.onload = () =>
        {
            console.log("Image has been loaded successfully!");
            callback(image);
        };

        image.src = "http://localhost:8080/resources/tiles/" + this.ImageName + ".png";
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