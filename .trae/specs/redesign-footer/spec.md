# 页脚重设计 Spec

## Why
当前页脚设计较为常规，缺乏品牌个性和视觉冲击力。用户希望重设计页脚，使其与整体博客风格更协调，更具现代感和专业度。

## What Changes
- **全新视觉风格**：采用深色背景（#1A1A1A）与浅色文字的强对比设计，与当前白色主题形成视觉收尾
- **品牌区域强化**：大号品牌标识 + 个性化 Slogan，增强品牌记忆点
- **导航分组优化**：按功能分组（导航/资源/联系），使用更清晰的视觉层次
- **社交链接可视化**：使用图标而非纯文字链接，提升可识别性
- **版权信息简化**：底部单行简洁版权信息，去除冗余分隔线
- **悬停动效**：链接悬停时颜色过渡 + 轻微位移，提升交互质感

## Impact
- 受影响文件：src/components/Footer.vue
- 设计风格：深色主题页脚，与浅色页面主体形成对比

## ADDED Requirements
### Requirement: 深色主题页脚
The system SHALL provide a dark-themed footer with high contrast typography.

#### Scenario: 页面滚动到底部
- **WHEN** 用户滚动到页面底部
- **THEN** 页脚显示为深色背景（#1A1A1A）
- **AND** 文字为浅色（#F9FAFB 主文字，#9CA3AF 次要文字）

### Requirement: 品牌区域强化
The footer SHALL prominently display the brand identity.

#### Scenario: 页脚展示
- **WHEN** 页脚渲染
- **THEN** 品牌名 "resin-blog" 以 24px 粗体显示
- **AND** Slogan "用代码，构建属于自己的宇宙。" 以 14px 显示

### Requirement: 社交图标链接
Social links SHALL be displayed as icon buttons with hover effects.

#### Scenario: 悬停社交图标
- **WHEN** 用户悬停在社交图标上
- **THEN** 图标颜色变为 #3B82F6（蓝色）
- **AND** 图标向上位移 2px

## MODIFIED Requirements
### Requirement: 导航分组
Footer navigation SHALL be organized into clear groups.

#### Scenario: 导航展示
- **WHEN** 页脚导航渲染
- **THEN** 分为三组：导航（首页/归档/简历/规划/关于）、资源（链接/求索/面经）、联系（邮箱/GitHub/Twitter）

## REMOVED Requirements
### Requirement: 旧版页脚样式
**Reason**: 全新设计替代
**Migration**: 完全替换 Footer.vue 组件代码
