
struct MyUniforms {
  grid: vec2f,
  window: vec2f,
};

@group(0) @binding(0) var<uniform> uni: MyUniforms;

struct VertexInput {
  @location(0) pos: vec2f,
  @builtin(instance_index) instance: u32,
};

struct VertexOutput {
  @builtin(position) pos: vec4f,
};

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var i = f32(input.instance);
  var size = uni.grid / uni.window;

  var offX = i * 0.15;

  var nX = u32(uni.window.x / uni.grid.x);
  var nY = u32(uni.window.y / uni.grid.y);

  var xPos = f32(input.instance % nX);
  var yPos = f32(input.instance / nY);

  var pos = input.pos * size;
  pos.x = pos.x + (xPos*size.x) + offX;
  pos.y = pos.y + (yPos*size.y);

  var output: VertexOutput;
  output.pos = vec4f(pos.x, pos.y, 0, 1);
  return output;
}