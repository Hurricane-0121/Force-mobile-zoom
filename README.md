# 强制手机网页双指缩放 (Force Mobile Zoom)
强制缩放 + 自动修复滚动容器（兼容所有主流网站）
Force zoom + auto-fix scroll containers (Compatible with all major websites)

[![Greasy Fork](https://img.shields.io/greasyfork/dt/???)]()  <!-- 如果发布到 Greasy Fork 后可添加徽章 -->

一个移动端用户脚本，**强制移动网页支持双指缩放**，并自动修复缩放后无法滚动的问题。适用于那些通过 `<meta viewport>` 禁止缩放的网站。

## 功能特点
- 🖐️ **强制启用双指缩放**：无视网页 `user-scalable=no` 或 `maximum-scale=1.0` 限制。
- 📜 **修复滚动失效**：自动识别页面中的滚动容器（如 `#app`、`main`、`.content` 等），确保放大后内容可滑动。
- 🔄 **动态内容支持**：监听 DOM 变化，对新加载的内容同样生效。
- ⚡ **轻量高效**：仅修改必要的样式，不影响页面原有布局。

## 安装方法
1. 确保手机浏览器支持插件扩展
2. 点击以下链接直接安装：  
   [👉 安装脚本](https://raw.githubusercontent.com/Hurricane-0121/Force-mobile-zoom/main/force-mobile-zoom.user.js)  
3. 或手动复制脚本代码，在浏览器或其他插件平台中新建脚本粘贴保存。

## 使用说明
- 安装后无需任何配置，脚本会在所有网页自动运行。
- 如果某个网站依然无法缩放，请检查是否被其他脚本或浏览器设置干扰。

## 反馈与贡献
- 遇到问题请提交 [GitHub Issues](https://github.com/Hurricane-0121/Force-mobile-zoom) 。
- 欢迎 Pull Request 改进代码。

## 许可证
[MIT](LICENSE) © Manning9264
