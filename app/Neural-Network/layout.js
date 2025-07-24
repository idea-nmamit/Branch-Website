import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Neural Network Visualization',
  description: 'Experience our interactive neural network visualization showcasing the power of artificial intelligence and machine learning concepts in an engaging way.',
  keywords: ['neural network', 'visualization', 'AI', 'machine learning', 'interactive', 'demo'],
  url: '/Neural-Network',
});

export default function NeuralNetworkLayout({ children }) {
  return children;
}
