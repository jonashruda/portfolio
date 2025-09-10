# Portfolio
Static portfolio site for GitHub Pages.

## Edit text without touching HTML
- `data/bio.txt` controls the About section.
- `data/projects.json` controls the list of projects.
- Each project has `data/projects/<slug>/description.txt` for long text.
- Thumbnails and images live in `assets/img/`.

## Add a project
1. Add an object to `data/projects.json`:
```json
{
  "slug": "my-project",
  "title": "My Project",
  "category": "programming",
  "categoryLabel": "Programming",
  "thumbnail": "assets/img/my-thumb.png",
  "imageUrls": ["assets/img/pic1.png", "assets/img/pic2.png"],
  "videoUrl": "https://www.youtube.com/embed/…",
  "descriptionPath": "data/projects/my-project/description.txt",
  "repo":"https://github.com/jonashruda/my-project",
  "demo":"https://example.com"
}
```
2. Create `data/projects/my-project/description.txt` and write the description.
3. Add images to `assets/img/` and reference them.
4. Open `project.html?slug=my-project` to verify.

## Local test
Open `index.html` and `project.html` directly. For YouTube embeds you need an internet connection.

## Publish on GitHub Pages
- Repo: `jonashruda/portfolio`
- Branch: `main`
- Pages settings: Deploy from branch → `/root`

