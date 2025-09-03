# Localhost Browser

Easily open your localhost in VSCode's Simple Browser with a single click or keyboard shortcut.  
Automatically detects your project’s port from common config files like `.env`, `package.json`, or `mkdocs.yml`.

---

## Features

- Lightweight
- Open localhost in **Simple Browser** directly from the **status bar**.
- Automatic **port detection** from `.env`, `package.json`, `mkdocs.yml`, `docker-compose`, and more.
- Configurable **default port** if no port is detected.
- Customizable **keyboard shortcut** (`Shift + Ctrl + L` by default).

---

## Settings

| Setting                        | Description                                                                                   | Default                                                                                                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `localhostBrowser.defaultPort` | Default port to use when no PORT is detected in project files. Leave blank to use `localhost` | `""`                                                                                                                                                            |
| `localhostBrowser.keybinding`  | Keyboard shortcut to open the localhost browser                                               | `ctrl+shift+l` (`cmd+shift+l` on Mac)                                                                                                                           |
| `localhostBrowser.searchPaths` | List of files to search for PORT configuration                                                | `[".env", ".env.local", ".env.development", "package.json", "docker-compose.yml", "docker-compose.yaml", "next.config.js", "vite.config.js", "vite.config.ts"]` |

---

## Usage

1. Click the **status bar item**: `$(globe) Open Localhost`.
2. Or use the **keyboard shortcut** (`Shift + Ctrl + L`).
3. The Simple Browser will open with your detected or default localhost port.

---

## Supported Projects

- Node.js (Next.js, Vite, etc.)
- Docker / Docker Compose
- MkDocs / MkDocs Material
- Generic `.env` files
