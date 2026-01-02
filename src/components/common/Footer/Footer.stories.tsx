import type { Meta, StoryObj } from '@storybook/react';
import Footer from './index';

const meta: Meta<typeof Footer> = {
  title: 'Design System/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['web', 'mobile'],
      description: '푸터 변형',
    },
    copyright: {
      control: 'text',
      description: '저작권 텍스트',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Web: Story = {
  args: {
    variant: 'web',
  },
};

export const Mobile: Story = {
  args: {
    variant: 'mobile',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '375px' }}>
        <Story />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
      <div>
        <p style={{ color: '#8E8E8E', marginBottom: '16px', fontSize: '12px' }}>Web</p>
        <Footer variant="web" />
      </div>
      <div style={{ maxWidth: '375px' }}>
        <p style={{ color: '#8E8E8E', marginBottom: '16px', fontSize: '12px' }}>Mobile</p>
        <Footer variant="mobile" />
      </div>
    </div>
  ),
};
