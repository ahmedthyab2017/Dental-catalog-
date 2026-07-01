# Design Templates System

## Supported Platforms
1. **Instagram**
   - Stories (1080x1920px)
   - Posts (1080x1080px)
   - Reels (1080x1920px)

2. **Facebook**
   - Cover (820x312px)
   - Post (1200x628px)

3. **TikTok**
   - Vertical (1080x1920px)
   - Text overlay

4. **Before-After Slider**
   - Custom dimensions
   - Interactive slider

## Template Creation

Templates are stored as:
- HTML template
- CSS styling
- JSON configuration

### Example Template Structure
```json
{
  "platform": "instagram",
  "type": "post",
  "width": 1080,
  "height": 1080,
  "elements": [
    {
      "type": "image",
      "placeholder": "{{before_image}}",
      "position": "left"
    },
    {
      "type": "text",
      "content": "{{clinic_name}}",
      "font": "bold",
      "size": 32
    }
  ]
}
```

## Auto-Generation

When a case is ready to publish:
1. Select template
2. System fills in: clinic name, before/after photos
3. Generates image using template engine
4. Saves to Cloudinary
5. Provides download link
