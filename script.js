function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(hexChar => hexChar + hexChar).join('');
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  }
  
  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
  
  function updateColorDisplay(inputNumber) {
    const colorInput = document.getElementById(`color${inputNumber}`).value;
    const colorDisplay = document.getElementById(`colorDisplay${inputNumber}`);
    colorDisplay.style.backgroundColor = colorInput;
  }
  
  function calculateIntermediateColors() {
    const color1 = document.getElementById('color1').value;
    const color2 = document.getElementById('color2').value;
    const numColors = parseInt(document.getElementById('numColors').value, 10);
  
    if (!color1 || !color2 || isNaN(numColors)) {
      alert('Please enter valid colors and select a number of colors.');
      return;
    }
  
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
  
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const ratio = i / (numColors - 1); // Normalizing the range to [0, 1]
      const intermediateRgb = [
        Math.round(rgb1[0] * (1 - ratio) + rgb2[0] * ratio),
        Math.round(rgb1[1] * (1 - ratio) + rgb2[1] * ratio),
        Math.round(rgb1[2] * (1 - ratio) + rgb2[2] * ratio)
      ];
      const intermediateHex = rgbToHex(intermediateRgb[0], intermediateRgb[1], intermediateRgb[2]);
      colors.push(intermediateHex);
    }
  
    const colorList = document.getElementById('colorList');
    colorList.innerHTML = '';
  
    const numColumns = Math.ceil(numColors / 5);
    for (let i = 0; i < numColumns; i++) {
      const column = document.createElement('div');
      column.className = 'color-column';
      colorList.appendChild(column);
  
      for (let j = i * 5; j < Math.min((i + 1) * 5, numColors); j++) {
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item';
        colorItem.innerHTML = `
          <div class="color-circle" style="background-color: ${colors[j]};"></div>
          <span>${j + 1}: ${colors[j]}</span>
        `;
        column.appendChild(colorItem);
      }
    }
  
    document.getElementById('averageColorText').textContent = `Generated ${numColors} intermediate colors:`;
  }

//golden ratio

document.addEventListener('DOMContentLoaded', function() {
    const initialColorInput = document.getElementById('initialColor');
    const initialColorPreview = document.getElementById('initialColorPreview');
  
    initialColorInput.addEventListener('input', function() {
      const color = initialColorInput.value;
      initialColorPreview.style.backgroundColor = color;
    });
  
    const generatePaletteBtn = document.getElementById('generatePaletteBtn');
    generatePaletteBtn.addEventListener('click', function() {
      const initialColor = initialColorInput.value;
      generatePalette(initialColor);
    });
  });
  
  function generatePalette(initialColor) {
    const goldenRatio = 1.61803398875;
    const initialHue = hexToHue(initialColor);
    let hue = initialHue;
  
    const paletteElement = document.getElementById('palette');
    paletteElement.innerHTML = '';
  
    for (let i = 0; i < 5; i++) {
      const saturation = Math.floor(Math.random() * 101);
      const lightness = Math.floor(Math.random() * 51) + 50;
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      const hexColor = hslToHex(hue, saturation, lightness);
  
      const colorBox = document.createElement('div');
      colorBox.className = 'color-box';
      colorBox.style.backgroundColor = color;
  
      const colorInfo = document.createElement('div');
      colorInfo.className = 'color-info';
      colorInfo.textContent = hexColor;
  
      colorBox.appendChild(colorInfo);
      paletteElement.appendChild(colorBox);
  
      hue = (hue + 360 / goldenRatio) % 360;
    }
  }
  
  function hexToHue(hex) {
    const rgb = hexToRgb(hex);
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
  
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h;
  
    if (max === min) {
      h = 0;
    } else if (max === r) {
      h = ((g - b) / (max - min)) % 6;
    } else if (max === g) {
      h = (b - r) / (max - min) + 2;
    } else {
      h = (r - g) / (max - min) + 4;
    }
  
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    
    return h;
  }
  
  function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  }
  
  function hslToHex(h, s, l) {
    const hue = h / 360;
    const saturation = s / 100;
    const lightness = l / 100;
  
    let r, g, b;
    if (saturation === 0) {
      r = g = b = lightness;
    } else {
        const hueToRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
          };
          const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
          const p = 2 * lightness - q;
          r = hueToRgb(p, q, hue + 1 / 3);
          g = hueToRgb(p, q, hue);
          b = hueToRgb(p, q, hue - 1 / 3);
        }
      
        const toHex = x => {
          const hex = Math.round(x * 255).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      }


      //paleta de cores

      document.addEventListener('DOMContentLoaded', function() {
        const baseColorInput = document.getElementById('baseColor');
        const baseColorDisplay = document.getElementById('baseColorDisplay');
      
        baseColorInput.addEventListener('input', function() {
          const color = baseColorInput.value;
          baseColorDisplay.style.backgroundColor = color;
        });
      
        const generatePaletteBtn = document.getElementById('generatePaletteBtn');
        generatePaletteBtn.addEventListener('click', function() {
          const baseColor = baseColorInput.value;
          const colorMode = document.getElementById('colorMode').value;
          generatePalette(baseColor, colorMode);
        });
      });
      
      function generatePalette() {
        const baseColor = document.getElementById('baseColor').value;
        const colorMode = document.getElementById('colorMode').value;
        const paletteElement = document.getElementById('palette');
        paletteElement.innerHTML = '';
    
        if (!isValidHex(baseColor)) {
            alert("Please enter a valid HEX color code.");
            return;
        }
    
        let colorCount;
        switch (colorMode) {
            case 'complementary':
            case 'triadic':
            case 'analogous':
            case 'tetradic':
            case 'square':
            case 'rectangular':
            case 'golden ratio':
            case 'monochromatic':
            case 'tints':
            case 'shades':
            case 'grayscale':
            case 'split_complementary':
            case 'duotone':
            case 'acromatic':
            case 'rainbow':
                colorCount = 5;
                break;
            default:
                colorCount = 5;
        }
    
        for (let i = 0; i < colorCount; i++) {
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            const color = generateColor(baseColor, colorMode, i + 1);
            colorBox.style.backgroundColor = color;
            colorBox.onclick = () => copyToClipboard(color);
    
            const colorHex = document.createElement('p');
            colorHex.className = 'color-hex';
            colorHex.textContent = color;
    
            const copyOverlay = document.createElement('div');
            copyOverlay.className = 'copy-overlay';
            copyOverlay.innerHTML = '<i class="fa fa-copy"></i> Copiar';
    
            colorBox.appendChild(copyOverlay);
            colorBox.appendChild(colorHex);
            paletteElement.appendChild(colorBox);
        }
    }
    
    function generateColor(baseColor, colorMode, index) {
        let [h, s, l] = hexToHsl(baseColor);
    
        switch (colorMode) {
            case 'complementary':
                h = (h + 180) % 360;
                break;
            case 'triadic':
                h = (h + 120 * index) % 360;
                break;
            case 'analogous':
                h = (h + 30 * index) % 360;
                break;
            case 'tetradic':
                h = (h + 90 * index) % 360;
                break;
            case 'square':
                h = (h + 90 * Math.floor(index / 2)) % 360;
                break;
            case 'rectangular':
                h = (h + 60 * index) % 360;
                break;
            case 'golden ratio':
                h = (h + (360 / 1.618) * index) % 360;
                break;
            case 'monochromatic':
                l = (l + (index * 10)) % 100;
                break;
            case 'tints':
                l = Math.min(l + (index * 10), 100);
                break;
            case 'shades':
                l = Math.max(l - (index * 10), 0);
                break;
            case 'grayscale':
                s = 0;
                l = (index * 20) % 100;
                break;
            case 'split_complementary':
                h = (h + (index % 2 === 0 ? 150 : 210)) % 360;
                break;
            case 'duotone':
                h = (index % 2 === 0) ? h : (h + 180) % 360;
                break;
            case 'acromatic':
                s = 0;
                l = (l + (index * 10)) % 100;
                break;
            case 'rainbow':
                h = (h + (index * 30)) % 360;
                break;
        }
    
        return hslToHex(h, s, l);
    }
    
    function hexToHsl(hex) {
        hex = hex.replace(/^#/, '');
    
        let r = parseInt(hex.substring(0, 2), 16) / 255;
        let g = parseInt(hex.substring(2, 4), 16) / 255;
        let b = parseInt(hex.substring(4, 6), 16) / 255;
    
        let cmin = Math.min(r, g, b);
        let cmax = Math.max(r, g, b);
        let delta = cmax - cmin;
        let h = 0;
        let s = 0;
        let l = 0;
    
        if (delta == 0) {
            h = 0;
        } else if (cmax == r) {
            h = ((g - b) / delta) % 6;
        } else if (cmax == g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }
    
        h = Math.round(h * 60);
    
        if (h < 0) {
            h += 360;
        }
    
        l = (cmax + cmin) / 2;
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);
    
        return [h, s, l];
    }
    
    function hslToHex(h, s, l) {
        s /= 100;
        l /= 100;
    
        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m = l - c / 2;
        let r = 0;
        let g = 0;
        let b = 0;
    
        if (0 <= h && h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (60 <= h && h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (120 <= h && h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (180 <= h && h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (240 <= h && h < 300) {
            r = x;
            g = 0;
            b = c;
        } else if (300 <= h && h < 360) {
            r = c;
            g = 0;
            b = x;
        }
    
        r = Math.round((r + m) * 255).toString(16);
        g = Math.round((g + m) * 255).toString(16);
        b = Math.round((b + m) * 255).toString(16);
    
        return `#${(r.length == 1 ? "0" + r : r)}${(g.length == 1 ? "0" + g : g)}${(b.length == 1 ? "0" + b : b)}`;
    }
    
    function copyToClipboard(text) {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert(`Copied: ${text}`);
    }
    
    function isValidHex(hex) {
        return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
    }
    