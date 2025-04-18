figma.showUI(__html__);
figma.ui.resize(326, 540);

const svgFiles = ['Vector.svg', 'Vector-1.svg'];

// Define a type for the messages coming from the UI
// This helps with type checking and autocompletion
type PluginMessage = 
  | { type: 'get-svg-list' } 
  | { type: 'get-svg-preview', vector: string }
  | { type: 'place-svg', vector: string, color: string };

figma.ui.onmessage = async (msg: PluginMessage) => {
  if (msg.type === 'get-svg-list') {
    figma.ui.postMessage({ type: 'svg-list', vectors: svgFiles });
  } else if (msg.type === 'get-svg-preview') {
    try {
      const response = await fetch(msg.vector);
      const svgContent = await response.text();
      figma.ui.postMessage({ type: 'svg-preview', svgString: svgContent });
    } catch (error) {
      console.error('Error fetching SVG:', error);
      figma.ui.postMessage({ type: 'svg-preview-error', error: 'Failed to load SVG' });
    }
  } else if (msg.type === 'place-svg') {
    const { vector, color } = msg;
    try {
      const response = await fetch(vector);
      const svgContent = await response.text();
      
      const node = figma.createNodeFromSvg(svgContent);
      
      // Set the color
      const rgb = hexToRgb(color);
      // Add type assertion for node.children
      (node.children as SceneNode[]).forEach((child: SceneNode) => {
        if (child.type === 'VECTOR' && 'fills' in child) { // Check if child has fills property
          child.fills = [{ type: 'SOLID', color: rgb }];
        }
      });

      figma.currentPage.appendChild(node);
      figma.currentPage.selection = [node];
      figma.viewport.scrollAndZoomIntoView([node]);

      figma.ui.postMessage({
        type: 'svg-placed',
        message: `Placed ${vector} with color ${color}`,
      });
    } catch (error) {
      console.error('Error placing SVG:', error);
      figma.ui.postMessage({ type: 'svg-place-error', error: 'Failed to place SVG' });
    }
  }
};

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}

// Don't close the plugin immediately
// figma.closePlugin();
