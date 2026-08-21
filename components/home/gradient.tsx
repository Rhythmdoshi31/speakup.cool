"use client";

import {
  ShaderGradient,
  ShaderGradientCanvas,
} from "@shadergradient/react";

export default function HomeGradient() {
  return (
    <div className="absolute inset-0 h-full w-full">
      <ShaderGradientCanvas
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ShaderGradient
          control="query"
          urlString="https://shadergradient.co/customize?animate=on&axesHelper=off&brightness=0.9&cAzimuthAngle=180&cDistance=5.01&cPolarAngle=90&cameraZoom=1&color1=%23ff6e42&color2=%23092634&color3=%23710014&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1.2&positionX=-0.5&positionY=-0.1&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=-10&rotationZ=50&shader=defaults&type=plane&uAmplitude=1&uDensity=4.5&uFrequency=5.5&uSpeed=0.2&uStrength=2.3&uTime=0&wireframe=false"
        />
      </ShaderGradientCanvas>
    </div>
  );
}