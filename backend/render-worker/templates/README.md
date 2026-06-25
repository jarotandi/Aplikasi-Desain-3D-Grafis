# Blender Template

Place the production Blender template at:

```text
backend/render-worker/templates/product_scene.blend
```

The render worker runs Blender with:

```bash
blender -b templates/product_scene.blend -P render_scene.py -- jobs/<job>.scene.json output/<job>.png
```

For first-time setup, create a simple empty `.blend` file in Blender with:

- One camera named `Camera`
- Optional lights, which will be replaced by `setup_lighting.py`
- Unit scale left at default

Save it as `product_scene.blend` in this folder.

Or generate a starter template from the render-worker folder:

```bash
blender -b --python create_template_blend.py
```
