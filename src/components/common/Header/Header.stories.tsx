import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Header from './index';

const meta: Meta<typeof Header> = {
  title: 'Design System/Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['transparent', 'white', 'black'],
      description: '헤더 배경 스타일',
    },
    size: {
      control: 'select',
      options: ['web', 'mobile'],
      description: '헤더 크기 (웹/모바일)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

// ========================================
// Transparent (투명 배경)
// ========================================
export const Transparent: Story = {
  args: {
    variant: 'transparent',
    size: 'web',
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#151515', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export const TransparentMobile: Story = {
  name: 'Transparent - Mobile',
  args: {
    variant: 'transparent',
    size: 'mobile',
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#151515', padding: '20px', maxWidth: '375px' }}>
        <Story />
      </div>
    ),
  ],
};

// ========================================
// White (흰색 배경)
// ========================================
export const White: Story = {
  args: {
    variant: 'white',
    size: 'web',
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WhiteMobile: Story = {
  name: 'White - Mobile',
  args: {
    variant: 'white',
    size: 'mobile',
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px', maxWidth: '375px' }}>
        <Story />
      </div>
    ),
  ],
};

// ========================================
// Black (검정 배경)
// ========================================
export const Black: Story = {
  args: {
    variant: 'black',
    size: 'web',
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#000000', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export const BlackMobile: Story = {
  name: 'Black - Mobile',
  args: {
    variant: 'black',
    size: 'mobile',
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#000000', padding: '20px', maxWidth: '375px' }}>
        <Story />
      </div>
    ),
  ],
};

// ========================================
// Showcase (All Variants)
// ========================================
export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Web 버전 */}
      <div>
        <h3 style={{ color: '#333', marginBottom: '16px', fontSize: '16px' }}>Web</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#151515', padding: '0' }}>
            <Header variant="transparent" size="web" />
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '0', border: '1px solid #e0e0e0' }}>
            <Header variant="white" size="web" />
          </div>
          <div style={{ backgroundColor: '#151515', padding: '0' }}>
            <Header variant="black" size="web" />
          </div>
        </div>
      </div>

      {/* Mobile 버전 */}
      <div>
        <h3 style={{ color: '#333', marginBottom: '16px', fontSize: '16px' }}>Mobile</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: '#151515', padding: '0', width: '375px' }}>
            <Header variant="transparent" size="mobile" />
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '0', width: '375px', border: '1px solid #e0e0e0' }}>
            <Header variant="white" size="mobile" />
          </div>
          <div style={{ backgroundColor: '#151515', padding: '0', width: '375px' }}>
            <Header variant="black" size="mobile" />
          </div>
        </div>
      </div>
    </div>
  ),
};
