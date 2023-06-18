
struct VertexOutput {
  @builtin(position) pos: vec4f,
};

@fragment 
fn main(inp: VertexOutput) -> @location(0) vec4<f32> {
  return inp.pos;
}
