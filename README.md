# Zee Dashboard

<div align="center">

![Zee Dashboard](https://img.shields.io/badge/Zee-Dashboard-blue?style=for-the-badge&logo=react)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

**A modern, beautiful dashboard for Clash/Mihomo proxy client**

[Features](#-features) • [Installation](#-installation) • [Docker](#-docker) • [Development](#-development) • [Languages](#-languages)

</div>

---

## ✨ Features

- 🎨 **Modern UI/UX** - Premium glassmorphism design with smooth GSAP animations
- 🌙 **Theme Support** - Dark, Light, and Auto (system) themes
- 🌍 **Multi-Language** - Support for English, Indonesia, 简体中文, and Tiếng Việt
- 📊 **Real-time Monitoring** - Live traffic, connections, and memory charts
- 🔌 **Proxy Management** - Full proxy group and provider management
- 📝 **Rule Management** - View and manage rules and rule providers
- 📱 **PWA Support** - Install as a standalone app on any device
- 🐳 **Docker Ready** - Easy deployment with Docker and docker-compose
- ⚡ **Fast & Optimized** - Built with Next.js 16 and React 19

## 📸 Screenshots

<div align="center">
  <img src="./assets/screenshot-dark.png" alt="Dark Theme" width="45%" />
  <img src="./assets/screenshot-light.png" alt="Light Theme" width="45%" />
</div>

## 🚀 Installation

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/ifauzeee/zee-dashboard.git
cd zee-dashboard

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🐳 Docker

### Using Docker Compose (Recommended)

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Using Docker Directly

```bash
# Build image
docker build -t zee-dashboard .

# Run container
docker run -d -p 3000:3000 --name zee-dashboard zee-dashboard
```

### With Nginx (Production)

```bash
# Start with nginx reverse proxy
docker-compose --profile production up -d
```

## 💻 Development

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | React Framework |
| React | 19.x | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 4.x | Styling |
| Framer Motion | 12.x | Animations |
| GSAP | 3.x | Advanced Animations |
| Zustand | 5.x | State Management |
| Recharts | 3.x | Charts |
| next-intl | latest | Internationalization |

### Project Structure

```
zee-dashboard/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── api/               # API routes
│   ├── config/            # Config page
│   ├── connections/       # Connections page
│   ├── logs/              # Logs page
│   ├── proxies/           # Proxies page
│   ├── rules/             # Rules page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home/Overview page
├── components/
│   ├── dashboard/         # Dashboard components
│   ├── hooks/             # Custom React hooks
│   ├── layout/            # Layout components
│   ├── providers/         # Context providers
│   ├── proxies/           # Proxy components
│   └── ui/                # UI components
├── i18n/                  # Internationalization config
├── messages/              # Translation files
├── public/                # Static assets
├── store/                 # Zustand stores
├── docker/                # Docker configs
├── Dockerfile             # Docker image
└── docker-compose.yml     # Docker Compose config
```

### Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## 🌍 Languages

| Language | Code | Status |
|----------|------|--------|
| English | `en` | ✅ Complete |
| Indonesia | `id` | ✅ Complete |
| 简体中文 | `zh-CN` | ✅ Complete |
| Tiếng Việt | `vi` | ✅ Complete |

### Adding New Language

1. Create a new file in `messages/` (e.g., `messages/ja.json`)
2. Copy structure from `messages/en.json`
3. Translate all strings
4. Add locale to `i18n/request.ts`
5. Add to `LanguageSelector.tsx`

## ⚙️ Configuration

### Clash API Connection

Configure connection in the Config page or modify `store/useClashStore.ts`:

```typescript
{
  host: '127.0.0.1',
  port: '9090',
  secret: 'your-secret'
}
```

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_DEFAULT_HOST=127.0.0.1
NEXT_PUBLIC_DEFAULT_PORT=9090
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- Inspired by [Yacd](https://github.com/MetaCubeX/yacd)
- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)

---

<div align="center">

Made with ❤️ by Zee

[⬆ Back to Top](#zee-dashboard)

</div>
