# 首页 Hero 区域修复 Spec

## Why
用户反馈首页存在三个问题：1) 打字机效果需要支持三行文字按顺序显示；2) Hero 区域整体布局偏下，中间标题需要更大；3) GitHub 贡献图未居中；4) 需要移除随记功能。

## What Changes
- **Hero 打字机效果重构**：支持三行文字（欢迎语、主标题、副标题）按顺序逐行打字机显示
- **Hero 布局上移**：减少垂直 padding，让整体内容更靠近视口顶部
- **中间标题放大**：主标题字体从 48px 提升至 56px，增强视觉层次
- **GitHub 贡献图居中**：修复图表容器未居中对齐的问题
- **删除随记功能**：移除 Notes Calendar 组件及其相关代码

## Impact
- 受影响文件：src/views/HomePage.vue
- 受影响组件：无新增组件，仅修改现有组件

## ADDED Requirements
### Requirement: 三行顺序打字机效果
The system SHALL provide a sequential typewriter effect for three lines of text in the Hero section.

#### Scenario: 页面加载时
- **WHEN** 用户进入首页
- **THEN** 第一行"欢迎来到我的博客"先以打字机效果显示
- **AND** 第一行完成后，第二行"你好，我是 Resin"以打字机效果显示
- **AND** 第二行完成后，第三行"用代码，构建属于自己的宇宙。"以打字机效果显示
- **AND** 每行显示时有闪烁光标，完成后光标消失或移至下一行

### Requirement: Hero 布局上移
The system SHALL position the Hero content closer to the top of the viewport.

#### Scenario: 桌面端显示
- **WHEN** 页面在桌面端显示
- **THEN** Hero 区域的垂直 padding 减少，内容整体向上偏移
- **AND** 主标题字体大小为 56px（原 48px）

## MODIFIED Requirements
### Requirement: GitHub 贡献图居中
The GitHub contribution graph SHALL be centered within its container.

#### Scenario: 图表显示
- **WHEN** GitHub 贡献图渲染
- **THEN** 图表在容器内水平居中对齐
- **AND** 图例与图表对齐方式一致

## REMOVED Requirements
### Requirement: 随记功能
**Reason**: 用户明确要求删除此功能
**Migration**: 移除 Notes Calendar 组件及相关样式代码
