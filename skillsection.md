# Interactive 3D Mechanical Keyboard Honeycomb Skills Section

## Overview
A futuristic, interactive 3D mechanical keyboard hexagonal interface. Each hexagon behaves like a physical keycap on an illuminated mechanical keyboard with crisp chamfered bevels, clean dark matte surfaces, and neon orange backlight channels in the seams between keys.

---

## Key Design Specifications

### 1. Hexagon Structure & 3D Keycap Feel
- **Shape**: Pointy-topped regular hexagons with uniform mathematical interlocking seams (6px gap).
- **Size**: Medium keycaps (98px width × 113px height).
- **Physical Layers**:
  - **Top Face (`.hex-top`)**: Solid dark matte keycap surface (`#1d1d22` to `#0c0c0f`) with top-edge specular highlight. The surface remains solid and dark upon clicking (does NOT get blinded/washed out by light).
  - **Chamfer Bevel (`.hex-border`)**: 3D perimeter chamfer with subtle dark orange accent.
  - **3D Base (`.hex-base`)**: 3D downward extrusion providing physical key depth.
  - **Seam Backlight (`.hex-backlight`)**: Perimeter neon orange glow located in the gaps/seams around the keycaps.
- **Center Hexagon**: Features the elegant cursive script **Skills** in white (`#ffffff`) with subtle luminescence.
- **Surrounding Hexagons**: Sleek blank keycaps with container slots (`.hex-svg-slot`) ready for custom SVG logos.

---

## Interaction & State Flow

### 1. Idle State
- Keycaps are solid dark with crisp, thin amber/orange edge accents.
- Gaps between keys are deep dark negative space with **no blurry wash or messy bleed**.

### 2. Hover State
- Keycap slightly raises (`translateY(-2px)`).
- Edge bevel warms up.
- Cursor indicates clickable key.

### 3. On Click (Actuation & Backlight Spark)
1. **Physical Key Press**: Key physically presses down (`translateY(3px) scale(0.97)`) with instant rebound.
2. **Tactile Switch Click**: High-precision synthetic mechanical key click synthesized via Web Audio API.
3. **Sunlight Orange Laser Seam**: A luminous, radiant sunlight orange line (`#fff4d6` bright solar core with `#ff7a00` flare halo) sparks **in the perimeter gaps/seams** around the clicked keycap. The keycap top face stays solid and dark.
4. **Wave Propagation**: The sunlight orange solar energy travels along the honeycomb seam channels to adjacent neighbor keys using BFS graph distance delays.
5. **Breathing Pulse**: Backlight in the seams breathes/pulses softly like radiant solar light.
6. **Return to Idle**: Gradually and smoothly fades back to the clean dark idle state.

---

## Honeycomb Grid Coordinate Layout

```
Row 0:                [Docker]
Row 1:           [Git]        [GitHub]
Row 2:     [Ollama]    [React]    [Node.js]    [HuggingFace]
Row 3: [AWS]     [Python]   [Skills]   [Django]     [Next.js]
Row 4:     [MongoDB]   [Flask]    [PostgreSQL] [Figma]
Row 5:                [SQL]
```

- **Width Step ($\Delta x$)**: 104px
- **Height Step ($\Delta y$)**: 90px
- All 17 keycaps tile with an exact uniform seam distance.
- Responsive scaling down to mobile viewports via `.honeycomb-wrapper` transform scaling.