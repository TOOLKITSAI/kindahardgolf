# 移动端游戏显示修复

## 问题描述
在移动设备上，游戏iframe中的"Play Daily Hole"和"Map Editor"按钮不可见，因为iframe高度设置过小。

## 解决方案

### 修改的文件：
1. **css/responsive.css**
2. **css/style.css**

### 具体修改：

#### 1. 768px断点（平板/大手机）
- 原高度：500px
- 新高度：650px
- 添加：max-height: 85vh（响应式视口高度）

#### 2. 480px断点（标准手机）
- 原高度：400px
- 新高度：600px
- 添加：max-height: 80vh

#### 3. 360px断点（小手机）
- 原高度：350px
- 新高度：550px
- 添加：max-height: 75vh

#### 4. 横屏模式
- 原高度：400px
- 新高度：500px
- 添加：max-height: 90vh

#### 5. 容器溢出处理
- 添加了移动端的overflow-y: auto
- 添加了iOS平滑滚动支持

## 测试建议

请在以下设备/模式测试：
- iPhone SE (375x667)
- iPhone 12/13 (390x844)
- iPhone 14 Pro Max (430x932)
- Samsung Galaxy S20 (360x800)
- iPad Mini (768x1024)
- 横屏模式

## Git提交命令

```bash
git add css/responsive.css css/style.css
git commit -m "Fix: Increase game iframe height on mobile to show all buttons

- Adjusted iframe heights for different mobile breakpoints
- Added viewport-based max-height for responsive scaling
- Enabled scrolling fallback for very small screens
- Ensures 'Play Daily Hole' and 'Map Editor' buttons are visible"
git push
```

## 如果问题仍然存在

可以考虑：
1. 使用JavaScript动态检测游戏内容高度
2. 与游戏开发者沟通，优化移动端布局
3. 添加"全屏"按钮让用户在全屏模式下玩游戏

---
修复日期：2025-01-17
