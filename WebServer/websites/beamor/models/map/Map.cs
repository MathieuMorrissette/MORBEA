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

            int chunk_width_count = (this.Width / MAP_CHUNK_SIZE);
            int chunk_height_count = (this.Height / MAP_CHUNK_SIZE);
            int chunk_count = chunk_width_count * chunk_height_count;
            int row_length = MAP_CHUNK_SIZE * chunk_width_count * MAP_CHUNK_SIZE;

            this.Chunks = new Chunk[chunk_count];

            JToken layers = mapobject["layers"];

            int layer_index = 0;
            foreach (JToken token in layers)
            {
                int[] map_array = token["data"].Values<int>().ToArray();


                for (int row = 0; row < this.Height; row++)
                {
                    for (int segment_x = 0; segment_x < chunk_width_count; segment_x++)
                    {
                        //Find the chunk index
                        int chunk_index = ((row / MAP_CHUNK_SIZE) * chunk_width_count) + segment_x;

                        if (this.Chunks[chunk_index] == null)
                        {
                            this.Chunks[chunk_index] = new Chunk();
                        }

                        // Find the segment index in the array
                        int segment_index = (row * MAP_CHUNK_SIZE * chunk_width_count) + segment_x * MAP_CHUNK_SIZE;

                        if (this.Chunks[chunk_index].Layers.Count < (layer_index + 1))
                        {
                            this.Chunks[chunk_index].Layers.Add(new int[MAP_CHUNK_SIZE * MAP_CHUNK_SIZE]);
                        }

                        Array.Copy(map_array, segment_index, this.Chunks[chunk_index].Layers[layer_index], segment_x * MAP_CHUNK_SIZE, MAP_CHUNK_SIZE);
                    }
                }
                
                layer_index++;
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
