# canvas-video

## Introduction

A tool that helps to embed canvas videos.

It draws canvas 1000x1000, and summons your function with the video element.

To be able to use the context use `animation_element.getElementsByTagName("input")[0]` (see example below)

To be able to use the timeline use `animation_element.getElementsByTagName("canvas")[0].getContext("2d")` (see example below)

## Installation

just put this anywhere you want:
```html
<script id="canvas-video" src="https://canvas-video-embed.web.app/animation.js"></script>
```

## Usage Exampples
### To create 2d animation
```html
<!DOCTYPE html>
<html>
<head>
  <script id="canvas-video" src="https://canvas-video-embed.web.app/animation.js"></script>
</head>
<body>
  <canvas-video name="clock" start="0"></canvas-video>
  <canvas-video name="clock2" function="clock" function="test2" start="0"></canvas-video>
  
  <script>
    function clock(animation_element) {
      const input = animation_element.getElementsByTagName("input")[0];
      const degree = input.value / input.max * Math.PI * 2;

      const ctx = animation_element.getElementsByTagName("canvas")[0].getContext("2d");
      ctx.lineWidth = 50;
      ctx.clearRect(0, 0, 1000, 1000);
      ctx.beginPath();
      ctx.moveTo(500, 500);
      ctx.lineTo(500 + Math.cos(degree)*400, 500 + Math.sin(degree)*400);
      ctx.stroke();

      if (parseInt(input.value) >= parseInt(input.max)) {
        input.value = 0;
      } else {
        input.value++;
      }

      if (animation_element.getElementsByTagName("button")[0].getAttribute("playing") == "true") {
        window.requestAnimationFrame(() => {
          clock(animation_element)
        });
      }
    }
  </script>
</body>
</html>
```
result:

![clock](https://user-images.githubusercontent.com/53610738/159015772-1e691bb7-be66-4dd3-aed9-41a2b003cc35.PNG)

### To load 3d object at path `3d_objects_folder/my-object.obj`
```html
<!DOCTYPE html>
<html>
<head>
  <script id="CanvasVideo" src="https://canvas-video-embed.web.app/animation.js"></script>
</head>
<body>
  <canvas-video type="threejs" object="3d_objects/magnets_merged.obj" material="3d_objects/magnets_merged.mtl" scale="0.4"></canvas-video>
</body>
</html>
```

If you dont want to do `npm install --save three` then you can try to do workaround with `<script>`:
```html
<!DOCTYPE html>
<html>
<head>
  <!-- instead of using npm load threejs from url -->
  <script type="module">
    import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
    import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/OBJLoader.js';
    import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/MTLLoader.js';
    import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
    
    window.THREE = THREE;
    window.OBJLoader = OBJLoader;
    window.MTLLoader = MTLLoader;
    window.OrbitControls = OrbitControls;
  </script>
  <script>
    THREE = window.THREE;
    OBJLoader = window.OBJLoader;
    MTLLoader = window.MTLLoader;
    OrbitControls = window.OrbitControls;
  </script>
  <script id="CanvasVideo" src="https://canvas-video-embed.web.app/animation.js"></script>
</head>
<body>
  <canvas-video type="threejs" object="3d_objects/magnets_merged.obj" material="3d_objects/magnets_merged.mtl" scale="0.4"></canvas-video>
</body>
</html>
```

## Info

Hosted on firebase:
- https://canvas-video-embed.web.app/
- https://canvas-video-embed.firebaseapp.com/


What the scrip is acutally doing?

Its not a custom element, it just replaces `<canvas-video>` with video stucture:

this:
```html
<canvas-video name="clock" start="200"></canvas-video>
```
to this:
```html
<div name="clock" class="animation_box" style="">
  <canvas width="1000" height="1000" style="width: 100%; height: auto;"></canvas>
  <div>
    <button playing="false">
      <svg viewBox="0 0 32 32">
        <path d="M 3,32 29,16 3,0 z"></path>
      </svg>
    </button>
    <input type="range" min="0" max="1000" value="200">
  </div>
</div>
```
