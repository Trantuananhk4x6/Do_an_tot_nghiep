# 🚀 AI Interview - Futuristic UI Upgrade

## 📦 Installation

Chạy lệnh sau để cài đặt các packages cần thiết:

```cmd
npm install three@0.154.0 @react-three/fiber@8.13.5 @react-three/drei@9.56.5 framer-motion@11.0.0
```

## ✨ New Features

### 1. 🎨 React Three Fiber (R3F) 3D Components

Đã tạo các components 3D tái sử dụng trong `src/components/ui/3d/`:

#### `FloatingParticles.tsx`
- Hiệu ứng particles 3D floating với màu gradient purple/pink/blue
- Props: `count`, `color`, `size`, `speed`
- Animation: Rotating và floating particles

#### `AnimatedSphere.tsx`
- 3D sphere với distortion effect
- Props: `position`, `scale`, `color`, `distort`, `speed`
- Animation: Floating và rotating

#### `WaveBackground.tsx`
- Background 3D wave animation
- Props: `color`, `amplitude`, `frequency`, `speed`
- Animation: Sine/cosine wave motion

#### `Scene3D.tsx`
- Wrapper component cho Canvas 3D
- Tự động setup lighting, camera, controls
- Props: `camera`, `enableControls`, `className`

#### `HolographicCard.tsx`
- Card với holographic/futuristic effect
- Animated gradient borders
- Corner accents, grid pattern, glow effects
- Props: `glowColor` (purple/pink/blue/cyan)

#### `Floating3DText.tsx`
- 3D text với floating animation
- Props: `text`, `position`, `color`, `size`

### 2. 🎭 Enhanced Animations

#### Landing Page (Banner)
- ✅ 3D particle background với FloatingParticles
- ✅ 3D animated spheres (purple, pink, blue)
- ✅ Framer Motion animations cho tất cả elements
- ✅ Enhanced floating decorations với rotation và scale
- ✅ Animated icon với 3D rotation
- ✅ Stagger animations cho feature cards
- ✅ Hover effects với scale và rotation

#### Resume/Dashboard Page
- ✅ HolographicCard wrapper cho table
- ✅ Animated header với icons
- ✅ Stagger animations cho table rows
- ✅ Hover effects với color transitions
- ✅ Animated empty state với rotating icon
- ✅ Icons cho mỗi column (FileText, Calendar)
- ✅ Badge styling cho document type

### 3. 🎨 New CSS Utilities

Đã thêm vào `globals.css`:

#### 3D & Perspective
```css
.perspective-1000    /* perspective: 1000px */
.perspective-2000    /* perspective: 2000px */
.transform-3d        /* transform-style: preserve-3d */
```

#### Holographic Effects
```css
.animate-gradient-xy         /* Gradient animation */
.holographic-shimmer        /* Shimmer effect */
.animate-neon-pulse         /* Neon glow pulse */
```

#### Futuristic Animations
```css
.animate-float-y            /* Floating Y-axis */
.animate-rotate-y           /* 3D rotation */
.animate-glitch             /* Glitch effect on hover */
.animate-data-stream        /* Data streaming effect */
.animate-energy-field       /* Energy field pulse */
.scan-line                  /* Scan line animation */
.animate-matrix-rain        /* Matrix rain effect */
.animate-neon-border        /* Neon border color change */
```

#### Backgrounds
```css
.cyber-grid                 /* Cyberpunk grid pattern */
.hex-pattern               /* Hexagonal pattern */
```

#### Components
```css
.futuristic-card           /* Card với hover 3D effect */
.cyber-button              /* Cyberpunk style button */
.glow-text                 /* Text với glow effect */
```

## 🎯 How to Use

### Sử dụng 3D Components

```tsx
import dynamic from 'next/dynamic';

// Dynamic import (client-side only)
const Scene3D = dynamic(() => import('@/components/ui/3d/Scene3D'), { ssr: false });
const FloatingParticles = dynamic(() => import('@/components/ui/3d/FloatingParticles'), { ssr: false });
const AnimatedSphere = dynamic(() => import('@/components/ui/3d/AnimatedSphere'), { ssr: false });
const HolographicCard = dynamic(() => import('@/components/ui/3d/HolographicCard'), { ssr: false });

// Usage
<Scene3D camera={{ position: [0, 0, 8] }}>
  <FloatingParticles count={800} speed={0.3} />
  <AnimatedSphere position={[-3, 2, -2]} scale={0.8} color="#8b5cf6" />
</Scene3D>

<HolographicCard glowColor="purple" className="p-6">
  Your content here
</HolographicCard>
```

### Sử dụng Framer Motion

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Sử dụng CSS Classes mới

```tsx
<div className="perspective-1000">
  <div className="futuristic-card transform-3d hover:animate-rotate-y">
    <h1 className="glow-text gradient-text">Title</h1>
    <button className="cyber-button">Click Me</button>
  </div>
</div>

<div className="cyber-grid scan-line">
  <div className="animate-energy-field">
    Content with energy field
  </div>
</div>
```

## 📊 Updated Pages

### ✅ Landing Page (`src/app/page.tsx`)
- 3D background scene với particles và spheres
- Enhanced animations cho hero section
- Framer Motion cho tất cả elements

### ✅ Resume Page (`src/app/(features)/resume/page.tsx`)
- Animated header với icons
- HolographicCard table wrapper
- Stagger animations

### ✅ Resume Table (`components/ResumeTable.tsx`)
- Holographic card wrapper
- Row animations
- Icon enhancements
- Hover effects

## 🎨 Design Principles

1. **Futuristic** - Cyberpunk, sci-fi inspired
2. **Innovation** - 3D elements, advanced animations
3. **Responsive** - Mobile-first, responsive 3D
4. **Performance** - Dynamic imports, optimized animations
5. **Accessibility** - Smooth transitions, reduced motion support

## 🚀 Next Steps

### Remaining Pages to Upgrade:

1. **Quiz Page** - Add HolographicCard cho questions, animated difficulty selector
2. **Interview Pages** - 3D avatar, animated feedback UI
3. **About Page** - 3D founder profile card, particle effects
4. **Find Job Page** - Holographic job cards
5. **Consulting Page** - Network visualization với 3D
6. **Support CV Page** - Enhanced template selector

## 💡 Tips

### Performance
- Sử dụng `dynamic import` cho 3D components
- Set `ssr: false` để render client-side only
- Reduce particle count trên mobile

### Responsive Design
- 3D effects tự động reduce trên mobile (CSS media queries)
- Use `perspective-1000` thay vì `perspective-2000` cho mobile

### Customization
- Tất cả colors có thể customize qua props
- Animation speeds có thể adjust
- Grid patterns và backgrounds có thể override

## 🐛 Troubleshooting

### "Module not found: three"
```cmd
npm install three@0.154.0 @react-three/fiber@8.13.5 @react-three/drei@9.56.5
```

### Hydration Errors
- Luôn sử dụng `dynamic import` với `ssr: false` cho 3D components

### Performance Issues
- Giảm `count` prop của FloatingParticles
- Use `speed={0.1}` cho slower animations
- Disable 3D effects trên mobile nếu cần

## 📚 Resources

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Drei Components](https://github.com/pmndrs/drei)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Three.js Manual](https://threejs.org/manual/)

## 🎉 Result

Giao diện mới:
- ⚡ Futuristic & Innovation design
- 🎨 3D elements everywhere
- ✨ Smooth animations
- 📱 Fully responsive
- 🚀 Performance optimized
- 😲 "WOW" factor cho users!

---

**Created with 💜 by AI Interview Team**
