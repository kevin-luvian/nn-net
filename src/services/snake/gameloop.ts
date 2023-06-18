import { SnakeDependencies } from "./types";
import basicVertWGSL from "../shaders/basic.vert.wgsl";
import basicFragWGSL from "../shaders/basic.frag.wgsl";
import { GridRenderer } from "./grid";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

class Snake {
  context!: GPUCanvasContext;
  device!: GPUDevice;

  private mGridRenderer!: GridRenderer;

  async init(deps: SnakeDependencies) {
    this.context = deps.context;

    const adapter = await navigator.gpu.requestAdapter();
    this.device = await adapter!.requestDevice();
    const format = navigator.gpu.getPreferredCanvasFormat();

    this.context.configure({
      device: this.device,
      format: format,
      alphaMode: "premultiplied",
    });

    this.mGridRenderer = new GridRenderer({ device: this.device, format });
  }

  initDraw() {
    const commandEncoder = this.device.createCommandEncoder();
    const textureView = this.context.getCurrentTexture().createView();
    const colorAttachment: GPURenderPassColorAttachment = {
      view: textureView,
      clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
      loadOp: "clear",
      storeOp: "store",
    };
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [colorAttachment],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

    return {
      grpe: passEncoder,
      commit: () => {
        this.device.queue.submit([commandEncoder.finish()]);
      },
    };
  }

  async gameloop() {
    const { grpe, commit } = this.initDraw();
    this.mGridRenderer.draw({ device: this.device, grpe });

    grpe.end();
    commit();
  }

  renderGrid() {
    // this.context.LINES;
  }
}

export default Snake;
