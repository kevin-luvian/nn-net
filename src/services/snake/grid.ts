import basicVertWGSL from "../shaders/basic.vert.wgsl";
import basicFragWGSL from "../shaders/basic.frag.wgsl";
import { DrawOptions, GridRendererDependencies } from "./types";

export class GridRenderer {
  private mGridSize = new Float32Array([3, 2]);
  public pipeline;

  constructor({ device, format }: GridRendererDependencies) {
    const vertexBufferLayout: GPUVertexBufferLayout = {
      arrayStride: Float32Array.BYTES_PER_ELEMENT * 2,
      attributes: [
        {
          format: "float32x2",
          offset: 0,
          shaderLocation: 0,
        } as GPUVertexAttribute,
      ],
    };
    this.pipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: device.createShaderModule({ code: basicVertWGSL }),
        entryPoint: "main",
        buffers: [vertexBufferLayout],
      },
      fragment: {
        module: device.createShaderModule({ code: basicFragWGSL }),
        entryPoint: "main",
        targets: [
          {
            format: format,
          },
        ],
      },
    });
  }

  draw({ device, grpe }: DrawOptions) {
    {
      const uniformArray = new Float32Array([50, 50, 500, 400]);
      const uniformBuffer = device.createBuffer({
        label: "Grid Uniforms",
        size: Float32Array.BYTES_PER_ELEMENT * 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      const bindGroup = device.createBindGroup({
        label: "Cell renderer bind group",
        layout: this.pipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: { buffer: uniformBuffer },
          },
        ],
      });

      device.queue.writeBuffer(uniformBuffer, 0, uniformArray);
      grpe.setBindGroup(0, bindGroup);
    }

    // {
    //   const positionsArray = new Float32Array([0, 0]);
    //   const positionsBuffer = device.createBuffer({
    //     label: "Grid Uniforms",
    //     size: Float32Array.BYTES_PER_ELEMENT * 4,
    //     usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    //   });
    //   const bindGroup = device.createBindGroup({
    //     label: "Position renderer bind group",
    //     layout: this.pipeline.getBindGroupLayout(0),
    //     entries: [
    //       {
    //         binding: 0,
    //         resource: { buffer: positionsBuffer },
    //       },
    //     ],
    //   });

    //   device.queue.writeBuffer(positionsBuffer, 0, positionsArray);
    //   grpe.setBindGroup(0, bindGroup);
    // }

    const vertices = new Float32Array([
      //   X,    Y,
      -1,
      -1, // Triangle 1 (Blue)
      1,
      -1,
      1,
      1,

      -1,
      -1, // Triangle 2 (Red)
      1,
      1,
      -1,
      1,
    ]);
    const vertexBuffer = device.createBuffer({
      label: "Grid Cell Vertices",
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(vertexBuffer, 0, vertices);

    grpe.setPipeline(this.pipeline);
    grpe.setVertexBuffer(0, vertexBuffer);
    grpe.draw(vertices.length / 2, 10, 0, 0);
  }
}
