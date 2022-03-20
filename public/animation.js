
// Append css
const animation_css_link = document.createElement("link");
animation_css_link.href = "https://canvas-video-embed.web.app/animation.css";
animation_css_link.type = "text/css";
animation_css_link.rel = "stylesheet";
animation_css_link.media = "screen,print";

document.getElementsByTagName("head")[0].appendChild(animation_css_link);

// Main
window.addEventListener('load', () => {
  document.querySelectorAll('canvas-video').forEach(looping_animation => {
    const animation_main = document.createElement('div');
    animation_main.setAttribute("name", looping_animation.getAttribute("name"));
    animation_main.style.cssText += looping_animation.style.cssText;
    animation_main.className += "animation_box";

    const type = looping_animation.getAttribute("type");
    if (type === "threejs") {
      create_threejs(looping_animation, animation_main);
    } else {
      create_2d_canvas(looping_animation, animation_main);
    }

    // replace the element
    looping_animation.parentNode.replaceChild(animation_main, looping_animation);
  });
});


function update_button(button) {
  if (button.getAttribute("playing") == "false") {
    button.getElementsByTagName('path')[0].setAttribute("d",
      "M 3,32 29,16 3,0 z");
  } else {
    button.getElementsByTagName('path')[0].setAttribute("d",
      "M 3,32 11,32 11,0 3,0 z M 21,32 29,32 29,0 21,0 z");
  }
}

function create_threejs(looping_animation, animation_main) {
  const renderer = new window.THREE.WebGLRenderer({ alpha: true });
  const scene = new window.THREE.Scene();
  const camera = new window.THREE.PerspectiveCamera(75, 1, 0.1, 1000);

  renderer.setSize(looping_animation.offsetWidth, looping_animation.offsetWidth);
  renderer.setClearColor( 0xffffff, 0);

  animation_main.appendChild(renderer.domElement);

  camera.position.z = 1;

  // TODO check https://www.youtube.com/watch?v=wHuSQ7I1aKs

  // https://drive.google.com/file/d/1KJ1AGps2PK1av3cz_VKvIdKC8ghyYT5N/view?usp=sharing

  const controls = new window.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.campingFactor = 0.25;
  controls.enableZoom = true;

  addLights(window.THREE, scene);

  const objLoader = new window.OBJLoader();
  objLoader.load(looping_animation.getAttribute("path"), (object) => {
    const scale = looping_animation.getAttribute("scale");
    object.scale.set(scale, scale, scale);
    scene.add(object);
  });

  function animation() {
    requestAnimationFrame(animation);

    controls.update();

    renderer.render(scene, camera);
  }
  animation();
}

function create_2d_canvas(looping_animation, animation_main) {
  function animation() {
    window[looping_animation.getAttribute("function") ? looping_animation.getAttribute("function") : looping_animation.getAttribute("name")](animation_main);
  }

    const canvas = document.createElement('canvas');
    animation_main.append(canvas);
    canvas.width = 1000;
    canvas.height = 1000;
    canvas.style.cssText += "width: 100%; height: auto;";

    const toolbar = document.createElement('div');
    animation_main.append(toolbar);

      const play_button = document.createElement('button');
      toolbar.append(play_button);
      play_button.setAttribute("playing", "false");
      function toolbar_press() {
        play_button.setAttribute("playing", "false");
        update_button(play_button);
        window.requestAnimationFrame(animation);
      }
      play_button.onclick = function () {
        if (this.getAttribute("playing") == "true") {
          this.setAttribute("playing", "false");
        } else {
          this.setAttribute("playing", "true");
          window.requestAnimationFrame(animation);
        }
        update_button(this);
      }

        const play_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        play_button.append(play_svg);
        play_svg.setAttribute("viewBox", "0 0 32 32");
        play_svg.append(document.createElementNS("http://www.w3.org/2000/svg", "path"));

      const play_proccess = document.createElement('input');
      toolbar.append(play_proccess);
      play_proccess.type = 'range';
      play_proccess.value = looping_animation.getAttribute("start");
      play_proccess.min = 0;
      play_proccess.max = 1000;
      play_proccess.onchange = toolbar_press;
      play_proccess.oninput = toolbar_press;
  

  update_button(play_button);

  play_proccess.onkeydown = (event) => {
    if (event.keyCode == 32) {
      event.preventDefault();
      play_button.click();
    }
  };

  animation();
}
