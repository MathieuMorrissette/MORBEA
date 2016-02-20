using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites.beamor.models.map
{
    public class Map
    {
        public const byte MAP_CHUNK_SIZE = 16;

        public string MapName { get; set; }
        public Chunk[] Chunks;
        public int Width { get; set; }
        public int Height { get; set; }
        public Tileset[] Tilesets { get; set; }

        public Map(string data_json)
        {
            JObject mapobject = JObject.Parse(data_json);

            this.Width = mapobject["width"].Value<int>();
            this.Height = mapobject["height"].Value<int>();

            int chunk_count = (this.Width / MAP_CHUNK_SIZE) * (this.Height / MAP_CHUNK_SIZE);

            this.Chunks = new Chunk[chunk_count];

            JToken layers = mapobject["layers"];

            foreach (JToken token in layers)
            {
                int[] array = token["data"].Values<int>().ToArray();

                for (int i = 0; i < chunk_count; i++)
                {
                    if (this.Chunks[i] == null)
                    {
                        this.Chunks[i] = new Chunk();
                    }

                    this.Chunks[i].AddLayer(array.Take(MAP_CHUNK_SIZE * MAP_CHUNK_SIZE).ToArray());
                    array = array.Skip(MAP_CHUNK_SIZE * MAP_CHUNK_SIZE).ToArray();
                }
            }

            JToken tilesets = mapobject["tilesets"];

            this.Tilesets = new Tileset[tilesets.Count()];

            for (int i = 0; i < this.Tilesets.Length; i++)
            {
                JToken json_tileset = tilesets[i];
                int tilesetHeight = json_tileset["imageheight"].Value<int>();
                int tilesetWidth = json_tileset["imagewidth"].Value<int>();
                string tilesetName = json_tileset["name"].Value<string>();

                this.Tilesets[0] = new Tileset(tilesetName, tilesetWidth, tilesetHeight);
            }

            Console.WriteLine("Map Created");
        }

        public void LoadMap(string data)
        {


        }
    }
}
