using WebServer.websites.beamor.models.map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites.beamor.models
{
    public class Chunk
    {
        public const byte CHUNK_SIZE = 16; // Number of tiles
        public const byte TILE_SIZE = 32; // Pixel

        public Tile[,] Tiles = new Tile[CHUNK_SIZE, CHUNK_SIZE];

        public void FillChunk(Tile tile)
        {
            for (int i = 0; i < CHUNK_SIZE; i++)
            {
                for (int j = 0; j < CHUNK_SIZE; j++)
                {
                    this.Tiles[i, j] = tile;
                }
            }
        }
    }
}
