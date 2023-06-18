import { useEffect, useMemo, useRef } from "react";
import Layout from "../../components/layout";
import Snake from "../../services/snake/gameloop"


export default function Home() {
  const cvDivRef = useRef(null)
  const cvRef = useRef(null)
  const snek = useMemo(() => new Snake(), []);

  useEffect(() => {
    if (!cvRef.current || !cvDivRef.current) return;
    const divElem = cvDivRef.current as HTMLCanvasElement;
    const elem = cvRef.current as HTMLCanvasElement;
    const ctx = elem.getContext('webgpu') as GPUCanvasContext;
    if (!ctx) throw new Error("no webgpu context");

    const devicePixelRatio = window.devicePixelRatio || 1;
    elem.width = elem.clientWidth * devicePixelRatio;
    elem.height = divElem.clientHeight * devicePixelRatio;

    console.log({
      // devicePixelRatio,
      clientWidth: elem.clientWidth,
      clientHeight: elem.clientHeight,
      divCHeight: divElem.clientHeight
    })

    let counter = 0
    let latestFrame: number | undefined;
    (async () => {
      await snek.init({ context: ctx });
      const loop = async () => {
        // console.log("Looping~", counter++)
        await snek.gameloop();
        latestFrame = requestAnimationFrame(loop)
      }
      latestFrame = requestAnimationFrame(loop)
    })()

    return () => {
      if (latestFrame) {
        cancelAnimationFrame(latestFrame)
      }
    }
  }, [cvRef, cvDivRef, snek])

  return (
    <Layout>
      <p>Snaking</p>
      <div ref={cvDivRef} className="h-100 p-absolute">
        <canvas ref={cvRef} className="bg-white w-100 h-100" />
      </div>
    </Layout>
  )
}
