# 3D圣诞树 2024

一个使用Three.js制作的3D圣诞树动画网页。

## 特性

- 3D圣诞树模型
- 旋转的摄像机视角
- 闪烁的星星
- 飘落的雪花
- 圣诞装饰球
- 响应式设计

## 部署到GitHub Pages

1. 创建一个新的GitHub仓库

2. 将这些文件上传到仓库：
   - index.html
   - main.js
   - README.md

3. 在仓库设置中启用GitHub Pages：
   - 进入仓库的Settings标签
   - 找到Pages部分
   - 在Source下选择main分支
   - 点击Save

4. 等待几分钟，你的网站将在以下地址可用：
   `https://[你的用户名].github.io/[仓库名]/`

## 本地测试

由于浏览器的安全限制，需要通过Web服务器来运行这个项目。你可以：

1. 使用Python的简单HTTP服务器：
   ```bash
   python -m http.server
   ```

2. 或使用Node.js的http-server：
   ```bash
   npx http-server
   ```

然后在浏览器中访问 `http://localhost:8000`

## 技术栈

- Three.js - 3D图形库
- HTML5
- JavaScript 