import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  // Create a status bar item
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.text = "$(globe) Open Localhost";
  statusBarItem.tooltip = "Click to open localhost in Simple Browser";
  statusBarItem.command = "localhostBrowser.openBrowser";
  statusBarItem.show();

  // Register the command
  const disposable = vscode.commands.registerCommand(
    "localhostBrowser.openBrowser",
    async () => {
      const port = await findPort();
      const url = port ? `localhost:${port}` : "localhost";

      // Execute the SimpleBrowser: Show command
      await vscode.commands.executeCommand("simpleBrowser.show", url);

      // Show a status message
      vscode.window.setStatusBarMessage(
        `Opened ${url} in Simple Browser`,
        3000
      );
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(statusBarItem);
}

async function findPort(): Promise<string | null> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return null;
  }

  const rootPath = workspaceFolders[0].uri.fsPath;
  const config = vscode.workspace.getConfiguration("localhostBrowser");
  const searchPaths = config.get<string[]>("searchPaths") || [
    ".env",
    ".env.local",
    ".env.development",
    "package.json",
    "docker-compose.yml",
    "docker-compose.yaml",
    "Dockerfile",
    "next.config.js",
    "vite.config.js",
    "vite.config.ts",
    "angular.json",
    "vue.config.js",
  ];

  for (const fileName of searchPaths) {
    const filePath = path.join(rootPath, fileName);

    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, "utf8");
        const port = extractPortFromContent(content, fileName);
        if (port) {
          return port;
        }
      } catch (error) {
        console.log(`Error reading ${fileName}:`, error);
      }
    }
  }

  // Check for running processes on common development ports
  const commonPorts = [
    "3000",
    "3001",
    "4200",
    "5000",
    "5173",
    "8000",
    "8080",
    "8081",
    "9000",
  ];
  for (const port of commonPorts) {
    if (await isPortInUse(port)) {
      return port;
    }
  }

  return null;
}

function extractPortFromContent(
  content: string,
  fileName: string
): string | null {
  // For .env files
  if (fileName.startsWith(".env")) {
    const portMatch = content.match(/^PORT\s*=\s*(\d+)/m);
    if (portMatch) {
      return portMatch[1];
    }
  }

  // For package.json
  if (fileName === "package.json") {
    try {
      const pkg = JSON.parse(content);
      // Check scripts for port configurations
      if (pkg.scripts) {
        for (const script of Object.values(pkg.scripts)) {
          const portMatch = (script as string).match(
            /(?:--port|--port=|-p)\s*(\d+)/
          );
          if (portMatch) {
            return portMatch[1];
          }
        }
      }
    } catch (e) {
      // Invalid JSON, skip
    }
  }

  // For docker-compose files
  if (fileName.includes("docker-compose")) {
    const portMatch = content.match(/ports:\s*\n\s*-\s*["']?(\d+):/m);
    if (portMatch) {
      return portMatch[1];
    }
  }

  // For config files (Next.js, Vite, etc.)
  if (fileName.includes("config")) {
    const portMatch = content.match(/port:\s*(\d+)/);
    if (portMatch) {
      return portMatch[1];
    }
  }

  // Generic PORT pattern search
  const genericPortMatch = content.match(/PORT\s*[:=]\s*(\d+)/i);
  if (genericPortMatch) {
    return genericPortMatch[1];
  }

  return null;
}

async function isPortInUse(port: string): Promise<boolean> {
  // This is a simplified check - in a real implementation you might want to
  // actually check if the port is listening, but for now we'll return false
  // since we don't have access to network checking in this context
  return false;
}

class LocalhostBrowserProvider
  implements vscode.TreeDataProvider<LocalhostBrowserItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    LocalhostBrowserItem | undefined | null | void
  > = new vscode.EventEmitter<LocalhostBrowserItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    LocalhostBrowserItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor() {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: LocalhostBrowserItem): vscode.TreeItem {
    return element;
  }

  getChildren(
    element?: LocalhostBrowserItem
  ): Thenable<LocalhostBrowserItem[]> {
    if (!element) {
      return Promise.resolve([
        new LocalhostBrowserItem(
          "Click to open localhost",
          "Open localhost in Simple Browser",
          vscode.TreeItemCollapsibleState.None,
          {
            command: "localhostBrowser.openBrowser",
            title: "Open Localhost",
          }
        ),
      ]);
    }
    return Promise.resolve([]);
  }
}

class LocalhostBrowserItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly tooltip: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.tooltip = tooltip;
    this.iconPath = new vscode.ThemeIcon("globe");
  }
}

export function deactivate() {}
