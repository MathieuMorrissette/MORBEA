class Chunk implements IChunk
{
    public Location: ChunkLocation;
    public Layers: number[][];

    public static GetChunk(chunk: IChunk)
    {
        var buffer = new Chunk();
        buffer.Layers = chunk.Layers;
        buffer.Location = chunk.Location;

        return buffer; 
    }
}