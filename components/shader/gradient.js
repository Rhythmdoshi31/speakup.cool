import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'

function App() {
  return (
    <ShaderGradientCanvas
      style={{ position: 'absolute', inset: 0 }}
      pixelDensity={1.5}
      fov={45}
    >
      <ShaderGradient cDistance={32} cPolarAngle={125} />
    </ShaderGradientCanvas>
  )
}