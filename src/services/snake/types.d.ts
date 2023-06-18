import { Result } from "neverthrow";

export interface SnakeDependencies {
  context: GPUCanvasContext;
}

export interface GridRendererDependencies {
  device: GPUDevice;
  format: GPUTextureFormat;
}

export interface DrawOptions {
  device: GPUDevice;
  grpe: GPURenderPassEncoder;
}
